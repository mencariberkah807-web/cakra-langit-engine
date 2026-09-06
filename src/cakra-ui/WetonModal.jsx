import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const labelCls =
  "text-[10px] font-bold uppercase tracking-[0.08em] text-[#94A3B8]";

function NeptuBox({ label, name, value, highlight, testid }) {
  return (
    <div
      data-testid={testid}
      className={`flex-1 rounded-lg border p-3 text-center ${
        highlight
          ? "border-[#0F172A] bg-[#0F172A] text-white"
          : "border-[#E2E8F0] bg-[#F8FAFC]"
      }`}
    >
      <p className={highlight ? "text-[10px] font-bold uppercase tracking-[0.08em] text-[#CBD5E1]" : labelCls}>
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold leading-tight">{name}</p>
      <p className={`mt-0.5 font-mono text-lg font-semibold tabular-nums ${highlight ? "" : "text-[#2563EB]"}`}>
        {value}
      </p>
    </div>
  );
}

export default function WetonModal({ open, onOpenChange, data }) {
  const jawa = data?.calendars?.find((c) => c.id === "jawa");
  const det = jawa?.detail;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="weton-modal"
        className="border-[#E2E8F0] sm:max-w-[540px]"
      >
        {det && (
          <>
            <DialogHeader>
              <p className={labelCls}>
                Kalender Jawa · {data.date_info.date_long}
              </p>
              <DialogTitle className="font-display text-2xl font-bold tracking-[-0.02em]">
                {jawa.sub}
              </DialogTitle>
              <p className="text-xs text-[#475569]">
                {det.jawa_date} · Tahun {det.tahun} · Windu {det.windu}
              </p>
            </DialogHeader>

            <div className="mt-2 flex items-stretch gap-2">
              <NeptuBox label="Dino" name={det.dino.name} value={det.dino.neptu} testid="weton-dino-box" />
              <span className="self-center font-mono text-lg text-[#94A3B8]">+</span>
              <NeptuBox label="Pasaran" name={det.pasaran.name} value={det.pasaran.neptu} testid="weton-pasaran-box" />
              <span className="self-center font-mono text-lg text-[#94A3B8]">=</span>
              <NeptuBox label="Neptu" name="Total" value={det.neptu_total} highlight testid="weton-neptu-total" />
            </div>

            <div
              data-testid="weton-watak"
              className="mt-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4"
            >
              <p className={labelCls}>Watak Neptu</p>
              <p className="mt-1 text-sm font-semibold">{det.watak.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                {det.watak.desc}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2" data-testid="weton-wuku-grid">
              <div className="rounded-lg border border-[#E2E8F0] p-3">
                <p className={labelCls}>Wuku</p>
                <p className="mt-1 text-sm font-semibold">{det.wuku.name}</p>
                <p className="mt-0.5 text-[11px] text-[#475569]">
                  Pekan {det.wuku.index} / 30
                </p>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] p-3">
                <p className={labelCls}>Hari Wuku</p>
                <p className="mt-1 font-mono text-sm font-semibold tabular-nums">
                  ke-{det.wuku.day_in_wuku}
                </p>
                <p className="mt-0.5 text-[11px] text-[#475569]">dari 7 hari</p>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] p-3">
                <p className={labelCls}>Pawukon</p>
                <p className="mt-1 font-mono text-sm font-semibold tabular-nums">
                  {det.wuku.pawukon_day}
                </p>
                <p className="mt-0.5 text-[11px] text-[#475569]">dari 210 hari</p>
              </div>
            </div>

            <p className="mt-3 text-[10px] leading-snug text-[#94A3B8]">
              Penafsiran watak bersifat tradisional, disajikan sebagai referensi
              budaya Jawa.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
