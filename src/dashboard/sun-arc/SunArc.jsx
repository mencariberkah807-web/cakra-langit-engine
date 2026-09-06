export default function SunArc({ result }) {
  const sunrise = result?.details?.sunrise ?? result?.sunrise ?? null;
  const sunset = result?.details?.sunset ?? result?.sunset ?? null;

  return (
    <section className="sun-arc-panel">
      <div className="sun-arc-heading">
        <div>
          <span className="eyebrow">SUN PATH</span>
          <h2>Sun Arc</h2>
        </div>
        <span className="sun-arc-status">V1 OBSERVATION</span>
      </div>

      <div className="sun-arc-visual" aria-hidden="true">
        <svg viewBox="0 0 800 190" preserveAspectRatio="none">
          <path
            className="sun-arc-track"
            d="M40 155 Q400 12 760 155"
          />
          <path
            className="sun-arc-horizon"
            d="M40 155 H760"
          />
        </svg>
        <div className="sun-arc-sun" />
      </div>

      <div className="sun-arc-times">
        <div>
          <span>TERBIT</span>
          <strong>{sunrise || "—"}</strong>
        </div>

        <div className="sun-arc-center">
          <span>PATH</span>
          <strong>Sunrise → Sunset</strong>
        </div>

        <div>
          <span>SURUP</span>
          <strong>{sunset || "—"}</strong>
        </div>
      </div>
    </section>
  );
}
