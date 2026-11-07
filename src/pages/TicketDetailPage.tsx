import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import type { SidebarView } from "../components/Sidebar";
import { ticketService } from "../services/api";
import type { Ticket, TicketAttachment } from "../services/api";
import { t, formatDate } from "../i18n";
const STATUS_LABEL: Record<Ticket["status"], { text: string; className: string }> = {
  open: { text: "support.status.open", className: "bg-amber-50 text-amber-600 border-amber-200" },
  answered: { text: "support.status.answered", className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  closed: { text: "support.status.closed", className: "bg-gray-100 text-gray-500 border-gray-200" },
};

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

function unwrap<T>(res: any): T | null {
  if (!res) return null;
  const inner = res.data?.data ?? res.data;
  return (inner ?? null) as T | null;
}

const BackButton: React.FC<{ className?: string; onClick: () => void }> = ({ className, onClick }) => (
  <button
    onClick={onClick}
    className={`group inline-flex items-center gap-1.5 text-xs font-medium text-[#1B6F63] bg-white border border-[#DAD5C7] rounded-full px-3.5 py-2 hover:bg-[#F5FBF8] hover:border-[#1B6F63]/40 hover:gap-2.5 transition-all duration-200 shadow-sm ${className || ""}`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 transition-transform duration-200 rtl:-scale-x-100 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5">
      <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.56l3.72 3.72a.75.75 0 1 1-1.06 1.06l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 1 1 1.06 1.06L5.56 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
    </svg>
    {t("support.backToTickets")}
  </button>
);

// آیکن گیره‌ی پیوست
const PaperclipIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32a1.5 1.5 0 01-2.122-2.122l7.007-7.007" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>
);

// function formatSize(bytes: number | null): string {
//   if (!bytes) return "";
//   if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} کیلوبایت`;
//   return `${(bytes / (1024 * 1024)).toFixed(1)} مگابایت`;
// }

// گرید پیوست‌های یک پیام (بعد از ارسال، از سرور اومده)
const AttachmentGrid: React.FC<{ attachments: TicketAttachment[]; onOpen: (url: string) => void }> = ({ attachments, onOpen }) => {
  if (!attachments?.length) return null;
  return (
    <div className={`grid gap-1.5 mt-2 ${attachments.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
      {attachments.map((att) => (
        <button
          key={att.id}
          type="button"
          onClick={() => onOpen(att.url)}
          className="relative rounded-lg overflow-hidden border border-black/10 bg-black/5 aspect-square"
        >
          <img src={att.url} alt={att.original_name ?? t("support.attachedImage")} className="w-full h-full object-cover" loading="lazy" />
        </button>
      ))}
    </div>
  );
};

// مودال نمایش عکس در سایز کامل
const ImageLightbox: React.FC<{ url: string | null; onClose: () => void }> = ({ url, onClose }) => {
  if (!url) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 end-4 text-white/90 bg-white/10 hover:bg-white/20 rounded-full p-2"
      >
        <XIcon className="h-5 w-5" />
      </button>
      <img src={url} alt={t("support.fullImage")} className="max-h-[85vh] max-w-full rounded-xl" onClick={(e) => e.stopPropagation()} />
    </div>
  );
};

const TicketDetailPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const siteId = searchParams.get("site") ?? undefined;

  const [activeView, setActiveView] = useState<SidebarView>("support");

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  // --- state مربوط به آپلود عکس ---
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const backToListPath = siteId ? `/support?site=${siteId}` : "/support";

  const fetchTicket = useCallback(async () => {
    if (!ticketId) return;
    try {
      const res = await ticketService.show(ticketId);
      const payload = unwrap<{ ticket: Ticket }>(res);

      if (res.success && payload?.ticket) {
        setTicket(payload.ticket);
        setError(null);
      } else {
        setError(res.message || t("support.errors.notFound"));
      }
    } catch {
      setError(t("support.errors.ticketNetwork"));
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.replies?.length]);

  // پاک‌سازی object URLهای پیش‌نمایش برای جلوگیری از نشت حافظه
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handlePickImages = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // اجازه بده همون فایل دوباره انتخاب بشه

    if (!files.length) return;

    setSendError(null);

    const validFiles: File[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setSendError(t("support.errors.imagesOnly"));
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setSendError(t("support.errors.tooLarge", { name: file.name }));
        continue;
      }
      validFiles.push(file);
    }

    setSelectedImages((prev) => {
      const combined = [...prev, ...validFiles];
      if (combined.length > MAX_IMAGES) {
        setSendError(t("support.errors.tooMany", { max: MAX_IMAGES }));
        return combined.slice(0, MAX_IMAGES);
      }
      return combined;
    });
  };

  // ساخت پیش‌نمایش هر بار که لیست فایل‌ها تغییر می‌کنه
  useEffect(() => {
    const urls = selectedImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImages]);

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = replyText.trim();
    if (!ticketId || (!trimmedText && selectedImages.length === 0) || sending) return;

    setSending(true);
    setSendError(null);
    try {
      const res = await ticketService.reply(ticketId, {
        message: trimmedText || undefined,
        images: selectedImages,
      });
      if (res.success) {
        setReplyText("");
        setSelectedImages([]);
        fetchTicket();
      } else {
        setSendError(res.message || t("support.errors.reply"));
      }
    } catch {
      setSendError(t("support.errors.replyNetwork"));
    } finally {
      setSending(false);
    }
  };

  const handleClose = async () => {
    if (!ticketId || closing) return;
    setClosing(true);
    try {
      const res = await ticketService.close(ticketId);
      if (res.success) fetchTicket();
    } finally {
      setClosing(false);
    }
  };

  const isAwaitingFirstReply = ticket?.status === "open";
  const composerLabel = isAwaitingFirstReply ? t("support.reply.send") : t("support.reply.sendReply");
  const composerPlaceholder = isAwaitingFirstReply ? t("support.reply.messagePlaceholder") : t("support.reply.replyPlaceholder");
  const canSend = (replyText.trim().length > 0 || selectedImages.length > 0) && !sending;

  return (
    <Layout activeView={activeView} onChangeView={setActiveView} siteId={siteId}>
      <div className="max-w-3xl mx-auto">
        <div className="p-3 sm:p-4 lg:p-5 pb-0">
          <BackButton onClick={() => navigate(backToListPath)} className="hidden sm:inline-flex w-fit mb-4" />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="h-8 w-8 border-2 border-[#DAD5C7] border-t-[#1B6F63] rounded-full animate-spin motion-reduce:animate-none" />
          </div>
        )}

        {error && !loading && (
          <div className="mx-3 sm:mx-4 lg:mx-5 bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {ticket && !loading && (
          <div className="flex flex-col">
            <div className="sticky top-0 z-20 bg-[#F5F3ED]/95 backdrop-blur supports-[backdrop-filter]:bg-[#F5F3ED]/80 px-3 sm:px-4 lg:px-5 py-3">
              <div className="bg-white border border-[#DAD5C7] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
                <div className="min-w-0">
                  <h1 className="text-base font-bold text-[#1E2A28] truncate">{ticket.subject}</h1>
                  <p className="text-xs text-[#9BA69F] mt-0.5">
                    {formatDate(ticket.created_at)}
                  </p>
                </div>
                <span className={`shrink-0 text-xs border px-2.5 py-1 rounded-full ${STATUS_LABEL[ticket.status].className}`}>
                  {t(STATUS_LABEL[ticket.status].text)}
                </span>
              </div>
            </div>

            <div className="px-3 sm:px-4 lg:px-5 space-y-3 pb-3">
              {ticket.replies?.map((reply) => (
                <div key={reply.id} className={`flex ${reply.is_staff_reply ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      reply.is_staff_reply
                        ? "bg-white border border-[#DAD5C7] text-[#1E2A28]"
                        : "bg-[#1B6F63] text-white"
                    }`}
                  >
                    {reply.message && <p className="whitespace-pre-wrap leading-relaxed">{reply.message}</p>}

                    <AttachmentGrid attachments={reply.attachments} onOpen={setLightboxUrl} />

                    <p className={`text-[10px] mt-1.5 ${reply.is_staff_reply ? "text-[#9BA69F]" : "text-white/70"}`}>
                      {reply.is_staff_reply ? t("support.reply.staff") : t("support.reply.you")} ·{" "}
                      {formatDate(reply.created_at, { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="sticky bottom-0 z-20 bg-[#F5F3ED]/95 backdrop-blur supports-[backdrop-filter]:bg-[#F5F3ED]/80 px-3 sm:px-4 lg:px-5 py-3">
              {ticket.status === "closed" ? (
                <div className="space-y-2">
                  <div className="text-center text-xs text-[#9BA69F] bg-[#F5F3ED] border border-[#DAD5C7] rounded-xl py-3">
                    {t("support.closedNotice")}
                  </div>
                  <BackButton onClick={() => navigate(backToListPath)} className="sm:hidden w-fit" />
                </div>
              ) : (
                <form onSubmit={handleSendReply} className="bg-white border border-[#DAD5C7] rounded-2xl p-3 space-y-2 shadow-sm">
                  {/* پیش‌نمایش عکس‌های انتخاب‌شده قبل از ارسال */}
                  {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {imagePreviews.map((url, idx) => (
                        <div key={url} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#DAD5C7]">
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

                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    placeholder={composerPlaceholder}
                    className="w-full border border-[#DAD5C7] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B6F63]/30 resize-none"
                  />

                  {sendError && <p className="text-xs text-rose-600">{sendError}</p>}

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={!canSend}
                        className="bg-[#1B6F63] hover:bg-[#155850] disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                      >
                        {sending ? t("common.status.submitting") : composerLabel}
                      </button>

                      <button
                        type="button"
                        onClick={handlePickImages}
                        disabled={selectedImages.length >= MAX_IMAGES}
                        title={t("support.form.addImage")}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#1B6F63] border border-[#DAD5C7] rounded-xl px-3 py-2 hover:bg-[#F5FBF8] disabled:opacity-50 transition-colors"
                      >
                        <PaperclipIcon className="h-4 w-4" />
                        {selectedImages.length > 0 ? `${selectedImages.length}/${MAX_IMAGES}` : t("support.reply.photo")}
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

                    <div className="flex items-center gap-3">
                      <BackButton onClick={() => navigate(backToListPath)} className="sm:hidden" />
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={closing}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 disabled:opacity-60 transition-colors"
                      >
                        {closing ? t("support.reply.closing") : t("support.reply.close")}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      <ImageLightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />
    </Layout>
  );
};

export default TicketDetailPage;