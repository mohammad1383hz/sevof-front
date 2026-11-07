// src/components/TrustBadge.tsx
// نشان «مورد اعتماد بیش از ۱۰۰۰ مشتری» — مشترک بین صفحه‌ی ورود و صفحه‌ی پلن‌ها
import React from "react";
import { t } from "../i18n";
import { tx } from "../i18n/rich";

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M10 1.6l2.36 5.1 5.54.62-4.16 3.9 1.16 5.58L10 13.98l-4.9 2.82 1.16-5.58-4.16-3.9 5.54-.62L10 1.6z" />
  </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 12a4.8 4.8 0 100-9.6 4.8 4.8 0 000 9.6zM4 20.4c0-3.98 3.58-6.8 8-6.8s8 2.82 8 6.8v.4H4v-.4z" />
  </svg>
);

const TrustBadge: React.FC<{ className?: string }> = ({ className = "mb-4 sm:mb-5" }) => {
  const avatarTints = ["#CBE0DA", "#DAD5C7", "#E3DFD1", "#F4EFE2"];

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="inline-flex items-center gap-3 rounded-full bg-[#FBFAF6] border border-[#DAD5C7] shadow-sm px-4 py-2 sm:px-5 sm:py-2.5">
        {/* آواتارها روی هم می‌افتند؛ در صفحه‌ی راست‌به‌چپ جهت هم‌پوشانی برعکس می‌شود */}
        <div className="flex -space-x-2.5 rtl:space-x-reverse shrink-0">
          {avatarTints.map((tint, i) => (
            <div
              key={i}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#FBFAF6] flex items-center justify-center"
              style={{ backgroundColor: tint }}
            >
              <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1B6F63]/70" />
            </div>
          ))}
        </div>
        <div className="h-8 w-px bg-[#DAD5C7] shrink-0" />
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center justify-center gap-0.5" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B08D57]" />
            ))}
          </div>
          <p className="text-[11px] sm:text-xs text-[#3D453F] text-center whitespace-nowrap">
            {tx("auth.login.trustedBy", {
              count: <span className="font-bold text-[#1E2A28]">{t("auth.login.trustedCount")}</span>,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustBadge;
