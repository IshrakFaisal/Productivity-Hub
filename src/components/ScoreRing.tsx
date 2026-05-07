export function ScoreRing({ value, label }: { value: number; label?: string }) {
  const degrees = Math.max(0, Math.min(10, value)) * 36;
  return (
    <div className="grid h-16 w-16 place-items-center rounded-full" style={{ background: `conic-gradient(#d9f99d ${degrees}deg, rgba(255,255,255,0.1) 0)` }}>
      <div className="grid h-12 w-12 place-items-center rounded-full bg-[#101116] text-center">
        <span className="text-sm font-semibold text-white">{value}</span>
        {label ? <span className="-mt-2 text-[9px] text-neutral-500">{label}</span> : null}
      </div>
    </div>
  );
}
