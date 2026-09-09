import { motion } from "framer-motion";
import SunArc from "./SunArc";

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function SkyWorkspace({ data, loading }) {
  const sun = data?.natural?.sun || {};
  const moon = data?.natural?.moon || {};
  const activeTime = data?.selectedTime || data?.time?.local || "—";

  return (
    <motion.div variants={item} className="relative min-h-[430px] overflow-hidden rounded-[20px] border border-[#1B4E6A] bg-[radial-gradient(circle_at_50%_42%,rgba(56,189,248,0.1),transparent_27%),radial-gradient(circle_at_50%_72%,rgba(124,58,237,0.08),transparent_34%),linear-gradient(180deg,#061625_0%,#03101D_62%,#020A13_100%)]" aria-label="Celestial sky workspace">
      <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(rgba(126,154,174,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(126,154,174,0.1)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute inset-x-4 top-4 z-20 flex items-center justify-between text-[8px] font-bold uppercase tracking-[0.16em] text-[#527D95] sm:inset-x-5 sm:text-[9px]">
        <span>Cakra Langit Sky Workspace</span>
        <span>Live observation</span>
      </div>
      <div className="relative h-[430px] sm:h-[500px] lg:h-[530px]">
        {loading || !data ? (
          <div className="absolute inset-5 animate-pulse rounded-xl border border-[#1C4966] bg-[#082238]/50" />
        ) : (
          <SunArc sun={sun} moon={moon} time={activeTime} loading={false} embedded />
        )}
      </div>
    </motion.div>
  );
}
