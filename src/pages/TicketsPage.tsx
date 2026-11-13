import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import type { SidebarView } from "../components/Sidebar";
import { ticketService, authService } from "../services/api";
import type { Ticket, TicketPriority, TicketStatus } from "../services/api";
import { t, formatDate } from "../i18n";

const STATUS_LABEL: Record<TicketStatus, { text: string; className: string }> = {
  open: { text: "support.status.open", className: "bg-amber-50 text-amber-600 border-amber-200" },
  answered: { text: "support.status.answered", className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  closed: { text: "support.status.closed", className: "bg-gray-100 text-gray-500 border-gray-200" },
};

// موضوعات پرتکرار که کاربر می‌تونه سریع انتخاب کنه، یا خودش موضوع دلخواهش رو تایپ کنه
const SUBJECT_TOPICS: { label: string }[] = [
  { label: "support.topics.wordpress" },
  { label: "support.topics.api" },
  { label: "support.topics.bug" },
  { label: "support.topics.billing" },
];

// محدودیت‌های اعتبارسنجی فرم
const SUBJECT_MIN_LENGTH = 3;
const SUBJECT_MAX_LENGTH = 150;
const MESSAGE_MIN_LENGTH = 5;
const MESSAGE_MAX_LENGTH = 5000;

// محدودیت‌های آپلود عکس
const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

// الگوی اعتبارسنجی شماره موبایل ایران
const PHONE_REGEX = /^09\d{9}$/;

function unwrap<T>(res: any): T | null {
  if (!res) return null;
  const inner = res.data?.data ?? res.data;
  return (inner ?? null) as T | null;
}

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>
);

const PaperclipIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32a1.5 1.5 0 01-2.122-2.122l7.007-7.007" />
  </svg>
);

const TicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const siteId = searchParams.get("site") ?? undefined;
  const [activeView, setActiveView] = useState<SidebarView>("support");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("normal");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // --- state مربوط به آپلود عکس ---
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- state مربوط به شماره موبایل کاربرانی که با گوگل/ایمیل وارد شدن و شماره ندارن ---
  const [needsPhone, setNeedsPhone] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(true);
  const [phone, setPhone] = useState("");

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await ticketService.list();
      const inner = res?.data?.data ?? res?.data; // سازگار با هر دو حالت (تا وقتی request فیکس بشه)
      if (res.success) {
        setTickets(inner?.tickets ?? []);
        setError(null);
      } else {
        setTickets([]);
        setError(res.message || t("support.errors.load"));
      }
    } catch {
      setTickets([]);
      setError(t("support.errors.loadNetwork"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // بررسی اینکه کاربر جاری شماره موبایل ثبت‌شده داره یا نه
  // (کاربرهایی که با گوگل یا ایمیل وارد شدن ممکنه شماره نداشته باشن)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res: any = await authService.me();
        const payload = unwrap<{ user: { phone?: string | null } }>(res);
        const user = payload?.user ?? res?.user ?? null;
        if (active) setNeedsPhone(!user?.phone);
      } catch {
        // اگه نتونستیم وضعیت شماره رو تشخیص بدیم، به‌صورت محافظه‌کارانه فیلد رو نشون بده
        if (active) setNeedsPhone(true);
      } finally {
        if (active) setCheckingPhone(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // ساخت پیش‌نمایش هر بار که لیست فایل‌ها تغییر می‌کنه + پاک‌سازی object URLها
  useEffect(() => {
    const urls = selectedImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImages]);

  const handlePickTopic = (topic: string) => {
    setSelectedTopic(topic);
    setSubject(topic);
    if (formError) setFormError(null);
  };

  const handleSubjectChange = (value: string) => {
    setSubject(value);
    // اگر کاربر بعد از انتخاب یک موضوع آماده، متن رو دستی عوض کنه،
    // دیگه اون چیپ به عنوان "انتخاب‌شده" نشون داده نشه (چون متن دیگه دقیقاً همون نیست)
    if (selectedTopic && value !== selectedTopic) {
      setSelectedTopic(null);
    }
    if (formError) setFormError(null);
  };

  const handleMessageChange = (value: string) => {
    setMessage(value);
    if (formError) setFormError(null);
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (formError) setFormError(null);
  };

  const handlePickImages = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // اجازه بده همون فایل دوباره انتخاب بشه

    if (!files.length) return;

    setFormError(null);

    const validFiles: File[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setFormError(t("support.errors.imagesOnly"));
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setFormError(t("support.errors.tooLarge", { name: file.name }));
        continue;
      }
      validFiles.push(file);
    }

    setSelectedImages((prev) => {
      const combined = [...prev, ...validFiles];
      if (combined.length > MAX_IMAGES) {
        setFormError(t("support.errors.tooMany", { max: MAX_IMAGES }));
        return combined.slice(0, MAX_IMAGES);
      }
      return combined;
    });
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // اعتبارسنجی فرم قبل از ارسال؛ در صورت مشکل، پیام خطای مناسب برمی‌گردونه
  const validateForm = (): string | null => {
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedSubject) return t("support.errors.subjectRequired");
    if (trimmedSubject.length < SUBJECT_MIN_LENGTH)
      return t("support.errors.subjectMin", { min: SUBJECT_MIN_LENGTH });
    if (trimmedSubject.length > SUBJECT_MAX_LENGTH)
      return t("support.errors.subjectMax", { max: SUBJECT_MAX_LENGTH });

    if (!trimmedMessage) return t("support.errors.messageRequired");
    if (trimmedMessage.length < MESSAGE_MIN_LENGTH)
      return t("support.errors.messageMin", { min: MESSAGE_MIN_LENGTH });
    if (trimmedMessage.length > MESSAGE_MAX_LENGTH)
      return t("support.errors.messageMax", { max: MESSAGE_MAX_LENGTH });

    if (needsPhone && !PHONE_REGEX.test(phone.trim())) {
      return t("support.errors.phone");
    }

    return null;
  };

  const isFormValid =
    subject.trim().length >= SUBJECT_MIN_LENGTH &&
    subject.trim().length <= SUBJECT_MAX_LENGTH &&
    message.trim().length >= MESSAGE_MIN_LENGTH &&
    message.trim().length <= MESSAGE_MAX_LENGTH &&
    (!needsPhone || PHONE_REGEX.test(phone.trim()));

  const resetForm = () => {
    setSubject("");
    setMessage("");
    setPriority("normal");
    setSelectedTopic(null);
    setFormError(null);
    setSelectedImages([]);
    setPhone("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const submittedSubject = subject.trim();
    const submittedMessage = message.trim();
    const submittedPriority = priority;
    const submittedPhone = needsPhone ? phone.trim() : undefined;

    setSubmitting(true);
    setFormError(null);
    try {
      const res: any = await ticketService.create({
        subject: submittedSubject,
        message: submittedMessage,
        priority: submittedPriority,
        images: selectedImages,
        ...(submittedPhone ? { phone: submittedPhone } : {}),
      });

      if (res.success) {
        // پاسخ API گاهی شکل‌های متفاوتی داره (شبیه fetchTickets)، پس همه حالت‌های محتمل رو پوشش می‌دیم
        const returnedTicket: Partial<Ticket> | undefined =
          res.data?.ticket ?? res.data?.data?.ticket ?? res.data?.data ?? res.data;

        // اگه سرور تیکت معتبر (با id) برگردونده باشه همون رو نشون می‌دیم،
        // در غیر این صورت یه نسخه‌ی موقت از روی داده‌ی خود فرم می‌سازیم
        // تا لیست فوراً و بدون کرش آپدیت بشه؛ چند لحظه بعد با نسخه‌ی واقعی از سرور جایگزین می‌شه
        const newTicket: Ticket =
          returnedTicket && returnedTicket.id
            ? (returnedTicket as Ticket)
            : ({
                id: `temp-${Date.now()}`, // شناسه‌ی موقت که با توکن واقعی سرور تداخل نداره
                subject: submittedSubject,
                category: null,
                priority: submittedPriority,
                status: "open",
                last_reply_at: null,
                closed_at: null,
                created_at: new Date().toISOString(),
                replies_count: 0,
              } as Ticket);

        setTickets((prev) => [newTicket, ...prev]);
        setShowForm(false);
        resetForm();

        // شماره‌ای که همین الان ثبت شد رو دیگه دفعه‌ی بعد نپرس
        if (submittedPhone) setNeedsPhone(false);

        // لیست رو از سرور تازه می‌کنیم تا id واقعی و بقیه‌ی فیلدها با نسخه‌ی موقت جایگزین بشن
        fetchTickets();
      } else {
        setFormError(res.message || t("support.errors.submit"));
      }
    } catch {
      setFormError(t("support.errors.submitNetwork"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  // دکمه‌ی بازگشت بالای صفحه: اگر سایتی انتخاب شده باشد (siteId داریم)،
  // به داشبورد همان سایت برمی‌گردیم؛ اگر کاربر هنوز هیچ دامنه‌ای ثبت نکرده
  // (siteId نداریم)، باید به صفحه‌ی «افزودن دامنه» هدایت شود.
  const handleBack = () => {
    if (siteId) {
      navigate(`/dashboard?site=${siteId}`);
    } else {
      navigate("/dashboard?new=1");
    }
  };

  return (
    <Layout activeView={activeView} onChangeView={setActiveView} siteId={siteId}>
      <div className="p-3 sm:p-4 lg:p-5 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#0D0F23]">{t("layout.nav.support")}</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 border border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 text-sm font-medium px-3.5 py-2 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4 rtl:-scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              {t("common.actions.back")}
            </button>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="bg-[#5B47FB] hover:bg-[#4935E0] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              + {t("support.newTicket")}
            </button>
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white border border-[#E4E5F0] rounded-2xl p-4 sm:p-5 space-y-3"
          >
            <div>
              <label className="text-xs font-medium text-[#0D0F23] block mb-1.5">{t("support.form.topic")}</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SUBJECT_TOPICS.map((topic) => {
                  const isActive = selectedTopic === t(topic.label);
                  return (
                    <button
                      key={topic.label}
                      type="button"
                      onClick={() => handlePickTopic(t(topic.label))}
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                        isActive
                          ? "border-[#5B47FB] bg-[#EFEDFF] text-[#4935E0] shadow-sm"
                          : "border-[#E4E5F0] bg-white text-[#6C7193] hover:border-[#5B47FB]/40 hover:bg-[#F7F6FF]"
                      }`}
                    >
                      {t(topic.label)}
                    </button>
                  );
                })}
              </div>
              <input
                value={subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                maxLength={SUBJECT_MAX_LENGTH}
                placeholder={t("support.form.subjectPlaceholder")}
                className="w-full border border-[#E4E5F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B47FB]/30"
              />
              <p className="text-[10px] text-[#9A9DB8] mt-1 text-start">
                {subject.trim().length}/{SUBJECT_MAX_LENGTH}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-[#0D0F23] block mb-1.5">{t("support.form.description")}</label>
              <textarea
                value={message}
                onChange={(e) => handleMessageChange(e.target.value)}
                maxLength={MESSAGE_MAX_LENGTH}
                rows={4}
                placeholder={t("support.form.descriptionPlaceholder")}
                className="w-full border border-[#E4E5F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B47FB]/30 resize-none"
              />
              <p className="text-[10px] text-[#9A9DB8] mt-1 text-start">
                {message.trim().length}/{MESSAGE_MAX_LENGTH}
              </p>
            </div>

            {/* اگه کاربر شماره موبایل ثبت‌شده نداشته باشه (مثلاً با گوگل یا ایمیل وارد شده)، ازش می‌خوایم اینجا وارد کنه */}
            {!checkingPhone && needsPhone && (
              <div>
                <label className="text-xs font-medium text-[#0D0F23] block mb-1.5">{t("support.form.phone")}</label>
                <input
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="09xxxxxxxxx"
                  dir="ltr"
                  className="w-full border border-[#E4E5F0] rounded-xl px-3 py-2 text-sm text-start focus:outline-none focus:ring-2 focus:ring-[#5B47FB]/30"
                />
                <p className="text-[10px] text-[#9A9DB8] mt-1">
                  {t("support.form.phoneHint")}
                </p>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-[#0D0F23] block mb-1.5">{t("support.form.image")}</label>

              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {imagePreviews.map((url, idx) => (
                    <div key={url} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#E4E5F0]">
                      <img src={url} alt={t("support.attachment", { index: idx + 1 })} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeSelectedImage(idx)}
                        className="absolute top-0.5 end-0.5 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handlePickImages}
                disabled={selectedImages.length >= MAX_IMAGES}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5B47FB] border border-[#E4E5F0] rounded-xl px-3 py-2 hover:bg-[#F7F6FF] disabled:opacity-50 transition-colors"
              >
                <PaperclipIcon className="h-4 w-4" />
                {selectedImages.length > 0 ? t("support.form.imagesSelected", { count: selectedImages.length, max: MAX_IMAGES }) : t("support.form.addImage")}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesSelected}
                className="hidden"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#0D0F23] block mb-1.5">{t("support.form.priority")}</label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: "low", label: t("support.priority.low"), dot: "bg-[#9A9DB8]" },
                    { value: "normal", label: t("support.priority.normal"), dot: "bg-[#5B47FB]" },
                    { value: "high", label: t("support.priority.high"), dot: "bg-[#B3453A]" },
                  ] as { value: TicketPriority; label: string; dot: string }[]
                ).map((opt) => {
                  const isActive = priority === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPriority(opt.value)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "border-[#5B47FB] bg-[#EFEDFF] text-[#4935E0] shadow-sm"
                          : "border-[#E4E5F0] bg-white text-[#6C7193] hover:border-[#5B47FB]/40 hover:bg-[#F7F6FF]"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${opt.dot}`} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {formError && (
              <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={submitting || !isFormValid}
                className="bg-[#5B47FB] hover:bg-[#4935E0] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
              >
                {submitting ? t("common.status.submitting") : t("support.form.submit")}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm text-[#9A9DB8] px-3 py-2"
              >
                {t("common.actions.cancel")}
              </button>
            </div>
          </form>
        )}

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="h-8 w-8 border-2 border-[#E4E5F0] border-t-[#5B47FB] rounded-full animate-spin motion-reduce:animate-none" />
          </div>
        )}

        {error && !loading && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-sm">{error}</div>
        )}

        {!loading && !error && tickets.length === 0 && (
          <div className="text-center py-12 text-[#9A9DB8] text-sm">
            {t("support.empty")}
          </div>
        )}

        <div className="space-y-2">
          {tickets.map((ticket) => {
            // گارد امن: اگه status ناشناخته بود یا created_at نامعتبر بود، رندر کرش نکنه
            const statusInfo = STATUS_LABEL[ticket.status] ?? STATUS_LABEL.open;
            const createdDate = ticket.created_at ? new Date(ticket.created_at) : null;
            const createdLabel =
              createdDate && !isNaN(createdDate.getTime())
                ? formatDate(createdDate)
                : "";

            return (
              <button
                key={ticket.id}
                onClick={() => navigate(siteId ? `/support/${ticket.id}?site=${siteId}` : `/support/${ticket.id}`)}
                className="w-full text-start bg-white border border-[#E4E5F0] rounded-2xl p-4 hover:border-[#5B47FB]/40 transition-colors flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#0D0F23] truncate">{ticket.subject}</p>
                  <p className="text-xs text-[#9A9DB8] mt-1">
                    {createdLabel}
                    {ticket.replies_count ? ` · ${t("support.messages", { count: ticket.replies_count })}` : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs border px-2.5 py-1 rounded-full ${statusInfo.className}`}
                >
                  {t(statusInfo.text)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default TicketsPage;