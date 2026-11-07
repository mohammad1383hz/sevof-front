# نحوه‌ی وصل‌کردن صفحات جدید

## ۱. اضافه‌کردن Route ها
به فایلی که Route های اپ رو تعریف می‌کنه (مثلاً `App.tsx` یا `router.tsx`) این ۴ خط رو اضافه کن:

```tsx
import KeywordsPage from "./pages/KeywordsPage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import ArticlesWrittenPage from "./pages/ArticlesWrittenPage";
import ArticlesPublishedPage from "./pages/ArticlesPublishedPage";

// ...

<Route path="/sites/:siteId/keywords" element={<KeywordsPage />} />
<Route path="/sites/:siteId/opportunities" element={<OpportunitiesPage />} />
<Route path="/sites/:siteId/articles-written" element={<ArticlesWrittenPage />} />
<Route path="/sites/:siteId/articles-published" element={<ArticlesPublishedPage />} />
```

## ۲. وصل‌کردن کلیک کارت‌ها به ناوبری
هر جا `AgentStatusCard` رندر می‌شه (احتمالاً صفحه‌ی داشبورد سایت)، پراپ `onStatClick`
رو اضافه کن:

```tsx
import { useNavigate } from "react-router-dom";
import AgentStatusCard, { PerformanceStatKey } from "./components/dashboard/AgentStatusCard";

const navigate = useNavigate();

const handleStatClick = (statKey: PerformanceStatKey) => {
  const routes: Record<PerformanceStatKey, string> = {
    keywords: `/sites/${siteId}/keywords`,
    opportunities: `/sites/${siteId}/opportunities`,
    articles_written: `/sites/${siteId}/articles-written`,
    articles_published: `/sites/${siteId}/articles-published`,
  };
  navigate(routes[statKey]);
};

// ...

<AgentStatusCard
  agent={agent}
  onToggleAutoPilot={handleToggle}
  onUpdateSettings={handleUpdateSettings}
  onStatClick={handleStatClick}
/>
```

## ۳. وصل‌کردن داده‌ی واقعی
داخل هر صفحه (`KeywordsPage.tsx`, `OpportunitiesPage.tsx`,
`ArticlesWrittenPage.tsx`, `ArticlesPublishedPage.tsx`) دنبال کامنت‌های
`TODO` بگرد — هرکدوم دقیقاً نشون می‌ده کجا باید `MOCK_*` رو با فراخوانی
سرویس واقعی (`services/api`) جایگزین کنی. ساختار state (`rows`, `loading`)
از قبل آماده‌ست، فقط منبع داده عوض می‌شه.

## نکته درباره‌ی مسیر import ها
فایل‌ها با فرض این ساختار پوشه نوشته شدن:
```
src/
  components/
    Layout.tsx
    dashboard/AgentStatusCard.tsx   <-- همون فایلی که قبلاً ویرایش کردیم
    stats/StatListPage.tsx          <-- کامپوننت جدید
  pages/
    KeywordsPage.tsx
    OpportunitiesPage.tsx
    ArticlesWrittenPage.tsx
    ArticlesPublishedPage.tsx
```
اگه ساختار پوشه‌های واقعی پروژه‌ت فرق داره، فقط مسیرهای `import` بالای هر
فایل رو (مثلاً `../components/Layout`) با مسیر درست خودت جایگزین کن.
