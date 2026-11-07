
export function ScoreRow({
  label,
  data,
  extra,
}: {
  label: string;
  data: { score: number; max: number; reason: string };
  extra?: string | null;
}) {
  const pct = data.max > 0 ? Math.round((data.score / data.max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] font-bold text-[#000000] mb-1">
        <span>{label}{extra ? ` (${extra})` : ""}</span>
        <span>{data.score}/{data.max}</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#DAD5C7] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r rtl:bg-gradient-to-l from-[#1B6F63] to-[#14564C] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {data.reason && <p className="text-[11px] text-[#000000]/60 mt-1 leading-4">{data.reason}</p>}
    </div>
  );
}

export function scoreTone(score: number) {
  if (score >= 70) return { text: "text-[#14564C]", bg: "bg-[#DCEFEA]", border: "border-[#BFE0D8]" };
  if (score >= 45) return { text: "text-[#8A6A2F]", bg: "bg-[#EDE3CF]", border: "border-[#DDD0AE]" };
  return { text: "text-[#B3453A]", bg: "bg-[#F7EEEA]", border: "border-[#E3C4BC]" };
}
