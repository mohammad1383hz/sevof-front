import { useEffect, useMemo, useState } from "react";
import type { WebsiteEntity, SiteEntity } from "../../../types";
import { AiBubble } from "./AiBubble";
import { EntityCard } from "./EntityCard";
import { t } from "../../../i18n";

/** نمایش Entity‌ها */
export function EntitiesBubble({
  entity,
  loading,
  streaming,
}: {
  entity: WebsiteEntity | null;
  loading: boolean;
  streaming: boolean;
}) {
  const allEntities = useMemo(() => {
    if (!entity) return [];
    const list: { ent: SiteEntity; isPrimary: boolean }[] = [];
    if (entity.primary_entity) list.push({ ent: entity.primary_entity, isPrimary: true });
    entity.core_entities?.forEach((e) => list.push({ ent: e, isPrimary: false }));
    return list;
  }, [entity]);

  const [revealCount, setRevealCount] = useState(streaming ? 0 : allEntities.length);

  // اگه streaming نبود (مثلاً سایت از قبل تحلیل شده بود) همه رو یکجا نشون بده
  useEffect(() => {
    if (!streaming) setRevealCount(allEntities.length);
  }, [streaming, allEntities.length]);

  // وقتی entity تازه لود شد و streaming فعاله، از صفر شروع کن
  useEffect(() => {
    if (streaming) setRevealCount(0);
  }, [streaming, entity]);

  const visibleEntities = streaming ? allEntities.slice(0, revealCount + 1) : allEntities;

  return (
    <AiBubble
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="2.25 5.25 13.5 13.5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      }
      title={t("analyze.entities.title")}
    >
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 border-2 border-[#DAD5C7] border-t-[#1B6F63] rounded-full animate-spin" />
        </div>
      )}
      {!loading && !entity && (
        <p className="text-xs text-[#000000]/70 text-center py-6">{t("analyze.entities.empty")}</p>
      )}
      {!loading && entity && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {visibleEntities.map((item, i) => (
            <EntityCard
              key={i}
              entity={item.ent}
              isPrimary={item.isPrimary}
              streaming={streaming && i === revealCount}
              onDone={() => setRevealCount((c) => Math.max(c, i + 1))}
            />
          ))}
        </div>
      )}
    </AiBubble>
  );
}
