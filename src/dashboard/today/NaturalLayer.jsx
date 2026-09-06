import { useTodayContext } from "../../core/TodayContext";
import { getResultsByGroup } from "../../core/resultRegistry.js";

const ACCENTS = {
  sun: "natural-sun",
  moon: "natural-moon",
  eclipse: "natural-eclipse",
  sky: "natural-sky",
  "earth-space": "natural-earth",
  tide: "natural-tide",
};

export default function NaturalLayer() {
  const context = useTodayContext();
  const results = getResultsByGroup("natural", context);

  return (
    <div className="natural-layer cakra-natural-layer">
      {results.map((result) => (
        <article
          key={result.id}
          className={`natural-item cakra-natural-card ${ACCENTS[result.id] || ""}`}
        >
          <div className="natural-card-top">
            <span className="natural-card-label">
              {result.label || result.title || result.id}
            </span>
            <span className="natural-card-marker" aria-hidden="true" />
          </div>

          <div className="natural-card-primary">
            {result.primary || "—"}
          </div>

          {result.secondary && (
            <div className="natural-card-secondary">
              {result.secondary}
            </div>
          )}

          {result.meta && (
            <div className="natural-card-meta">
              {typeof result.meta === "string"
                ? result.meta
                : result.meta.label ||
                  result.meta.phase ||
                  result.meta.engine ||
                  result.meta.status ||
                  ""}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
