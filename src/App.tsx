// src/App.tsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AnalyzePage from "./pages/AnalyzePage";
import KeywordAnalysisPage from "./pages/KeywordAnalysisPage";
import ArticlesDashboardPage from "./pages/ArticlesDashboardPage";
import PastArticlesPage from "./pages/PastArticlesPage";
import ReferralPage from "./pages/ReferralPage";
import ShopifyConnectPage, { pendingShopifyPath, rememberPendingShop } from "./pages/ShopifyConnectPage";
import { authService } from "./services/api";
import SubscriptionPage from "./pages/SubscriptionPage";
import PaymentResultPage from "./pages/PaymentResultPage";
import KeywordsPage from "./pages/KeywordsPage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import ArticlesWrittenPage from "./pages/ArticlesWrittenPage";
import ArticlesPublishedPage from "./pages/ArticlesPublishedPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import TicketsPage from "./pages/TicketsPage"; // ⬅️ جدید
import TicketDetailPage from "./pages/TicketDetailPage"; // ⬅️ جدید
import ApiKeysPage from "./pages/ApiKeysPage"; // ⬅️ جدید: مدیریت کلیدهای API
import ApiDocsPage from "./pages/ApiDocsPage"; // ⬅️ جدید: مستندات API برای توسعه‌دهنده
import ImpersonatePage from "./pages/ImpersonatePage";
import ProductSeoPage from "./pages/ProductSeoPage"; // ⬅️ جدید: سئوی محصولات
import PageProductSeoPage from "./pages/PageProductSeoPage"; // ⬅️ جدید: بهینه‌سازی سئوی صفحه‌ی محصول
import EduWordpressPage from "./pages/EduWordpressPage"; // ⬅️ جدید: ویدیوی آموزش اتصال وردپرس

/** لینک‌های قدیمی مقاله را به صفحه‌ی واحد Chat Session منتقل می‌کند. */
/** Remember the store from the Shopify link, then sign in; the login route sends the user back here. */
const ShopifyLoginRedirect: React.FC = () => {
  rememberPendingShop(new URLSearchParams(window.location.search).get("shop"));
  return <Navigate to="/login" replace />;
};

const LegacyArticleRoute: React.FC = () => {
  const { siteId, ideaId, articleId } = useParams();
  if (!siteId) return <Navigate to="/dashboard" replace />;
  const query = articleId ? `article=${articleId}` : `idea=${ideaId}`;
  return <Navigate to={`/dashboard?site=${siteId}&${query}`} replace state={{ openArticle: true }} />;
};

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState(authService.isAuthenticated());

  const handleLogin = (_token: string) => {
    setIsAuth(true);
  };

  const handleLogout = () => {
    setIsAuth(false);
    authService.logout();
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* ورود اصلی سایت: اگر لاگین نکرده بره login، اگر لاگین کرده بره داشبورد */}
        <Route
          path="/"
          element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />}
        />

        <Route
          path="/login"
          element={
            isAuth ? <Navigate to={pendingShopifyPath() ?? "/dashboard"} replace /> : <LoginPage onLogin={handleLogin} />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuth ? <AnalyzePage onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/admin-login"
          element={
            isAuth ? <Navigate to="/dashboard" replace /> : <AdminLoginPage onLogin={handleLogin} />
          }
        />
        <Route
          path="/impersonate"
          element={<ImpersonatePage onLogin={handleLogin} />}
        />
        {/* صفحه‌ی تحلیل دامنه‌ی جدید — همون AnalyzePage ولی در حالت "شروع تازه" */}
        <Route
          path="/analyze"
          element={
            isAuth ? <AnalyzePage onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        {/* سئوی محصولات: ایده‌های محتوا بر اساس محصولات فروشگاه + گفتگوهای kind=product */}
        <Route
          path="/product-seo"
          element={isAuth ? <ProductSeoPage /> : <Navigate to="/login" replace />}
        />

        {/* بهینه‌سازی سئوی صفحه‌ی محصول: تشخیص نقص، تکمیل توضیحات/مشخصات، تأیید و ذخیره در ووکامرس */}
        <Route
          path="/sites/:siteId/page-product-seo"
          element={isAuth ? <PageProductSeoPage /> : <Navigate to="/login" replace />}
        />

        {/* پلن‌ها و فعال‌سازی اشتراک */}
        <Route
          path="/subscription"
          element={isAuth ? <SubscriptionPage /> : <Navigate to="/login" replace />}
        />

        {/* back from Stripe Checkout: /payment/result?session_id=... or ?status=cancelled */}
        <Route
          path="/payment/result"
          element={isAuth ? <PaymentResultPage /> : <Navigate to="/login" replace />}
        />

        {/* پشتیبانی: لیست تیکت‌ها و جزئیات یک تیکت */}
        <Route
          path="/support"
          element={isAuth ? <TicketsPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/support/:ticketId"
          element={isAuth ? <TicketDetailPage /> : <Navigate to="/login" replace />}
        />

        {/* ویدیوی آموزش اتصال وردپرس — لینک «ویدیو آموزش» در WordPressConnectionCard به اینجا می‌آید */}
        <Route
          path="/edu-wordpress"
          element={isAuth ? <EduWordpressPage /> : <Navigate to="/login" replace />}
        />

        {/* توسعه‌دهنده: مدیریت کلیدهای API و مستندات — سطح حساب کاربر، مستقل از سایت خاص */}
        <Route
          path="/developer/api-keys"
          element={isAuth ? <ApiKeysPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/developer/api-docs"
          element={isAuth ? <ApiDocsPage /> : <Navigate to="/login" replace />}
        />

        {/* کسب درآمد با معرفی: فرم درخواست همکاری */}
        <Route path="/referral" element={isAuth ? <ReferralPage /> : <Navigate to="/login" replace />} />

        {/* Install started from Shopify: pick which site the store belongs to (resumes after sign-in) */}
        <Route path="/shopify/connect" element={isAuth ? <ShopifyConnectPage /> : <ShopifyLoginRedirect />} />

        {/* آپدیت مقاله‌های گذشته: پست‌های قدیمی خود سایت */}
        <Route
          path="/sites/:siteId/past-articles"
          element={isAuth ? <PastArticlesPage /> : <Navigate to="/login" replace />}
        />

        {/* داشبورد مقالات: وضعیت Agent، فرصت‌ها، آمار، تایم‌لاین */}
        <Route
          path="/sites/:siteId/dashboard"
          element={isAuth ? <ArticlesDashboardPage /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/sites/:siteId/keywords"
          element={
            isAuth ? <KeywordAnalysisPage onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        {/* صفحات آمار Agent: کلمات کلیدی، فرصت‌ها، مقالات نوشته‌شده/منتشرشده */}
        <Route
          path="/sites/:siteId/keywords-stats"
          element={isAuth ? <KeywordsPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/sites/:siteId/opportunities"
          element={isAuth ? <OpportunitiesPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/sites/:siteId/articles-written"
          element={isAuth ? <ArticlesWrittenPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/sites/:siteId/articles-published"
          element={isAuth ? <ArticlesPublishedPage /> : <Navigate to="/login" replace />}
        />
        <Route path="/sites/dashboard" element={<ArticlesDashboardPage />} />
        {/* شروع تولید مقاله از روی یک ایده */}
        <Route
          path="/sites/:siteId/ideas/:ideaId/article"
          element={isAuth ? <LegacyArticleRoute /> : <Navigate to="/login" replace />}
        />
        {/* باز کردن مقاله‌ای که قبلاً ساخته شده */}
        <Route
          path="/sites/:siteId/articles/:articleId"
          element={isAuth ? <LegacyArticleRoute /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;