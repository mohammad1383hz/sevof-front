// src/context/SidebarLayoutContext.tsx
import React, { createContext, useContext } from "react";

/**
 * وضعیت باز/بسته‌بودنِ سایدبارِ دسکتاپ را از Layout به هر جزئی از صفحه که
 * نیاز دارد (مثلاً نوارهای fixed پایین/بالای صفحه که باید هم‌عرضِ ستونِ
 * محتوا بمانند و با toggle سایدبار جابه‌جا شوند) می‌رساند.
 *
 * چرا Context؟ چون Layout به‌صورت `<Layout>{children}</Layout>` صدا زده
 * می‌شود و صفحاتِ داخلش (مثل ArticleGeneratePage → DesktopArticleThread)
 * پراپ مستقیم از Layout نمی‌گیرند؛ Context تنها راهِ تمیز برای پخش‌کردنِ
 * این یک مقدار به هر عمقی از درخت است، بدون prop-drilling دستی.
 */
const SidebarLayoutContext = createContext<boolean>(true);

export const SidebarLayoutProvider: React.FC<{ open: boolean; children: React.ReactNode }> = ({
  open,
  children,
}) => <SidebarLayoutContext.Provider value={open}>{children}</SidebarLayoutContext.Provider>;

/** آیا سایدبارِ دسکتاپ در حال حاضر باز است؟ خارج از Layout مقدار پیش‌فرض
 *  true برمی‌گردد (یعنی رفتار قبلی/ایمن، هم‌ارزِ همیشه‌باز). */
export const useDesktopSidebarOpen = (): boolean => useContext(SidebarLayoutContext);