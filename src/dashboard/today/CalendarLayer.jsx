import { useTodayContext } from "../../core/TodayContext";
import { getCalendarLayerResults } from "../../core/resultRegistry";





function CalendarCard({ result, isSelected, onSelect }) {
  return (
    <article
      className={`almanac-card ${isSelected ? "almanac-card-selected" : ""}`}
      onClick={() => onSelect(result.id)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(result.id);
        }
      }}>
      <span className="card-kicker">CALENDAR</span>

      <h3>{result.title}</h3>

      <p className="card-primary">{result.primary}</p>

      {result.secondary && <p className="card-secondary">{result.secondary}</p>}

      {result.details?.length > 0 && (
        <div className="card-details">
          {result.details.map((detail) => (
            <div className="detail-row" key={detail.label}>
              <span>{detail.label}</span>

              <strong>{detail.value}</strong>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function KalacakraCard({ result, isSelected, onSelect }) {
  const meta = result.meta;

  const details = [
    {
      label: "Tanggal",
      value: meta.number,
    },

    {
      label: "Nama",
      value: meta.name,
    },

    {
      label: "Poe",
      value: meta.poe,
    },

    {
      label: "Uga",
      value: meta.uga,
    },

    {
      label: "Kala",
      value: meta.kala,
    },
  ];

  return (
    <article
      className={`almanac-card ${isSelected ? "almanac-card-selected" : ""}`}
      onClick={() => onSelect(result.id)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(result.id);
        }
      }}>
      <span className="card-kicker">KALACAKRA</span>

      <h3>{result.title}</h3>

      <p className="card-primary">{meta.indung}</p>

      <p className="card-secondary">Tanggal {meta.number} dari 33</p>

      <div className="card-details">
        {details.map((detail) => (
          <div className="detail-row" key={detail.label}>
            <span>{detail.label}</span>

            <strong>{detail.value}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function FutureCalendarCard({ title, description }) {
  return (
    <article className="almanac-card">
      <span className="card-kicker">CALENDAR</span>

      <h3>{title}</h3>

      <p className="card-secondary">{description}</p>
    </article>
  );
}

function CalendarLayer({ selectedResultId, onSelectResult }) {
  const context = useTodayContext();

  const calendars = getCalendarLayerResults(context);


  return (
    <section className="almanac-layer">
      <div className="calendar-layer-grid">
        {calendars.map((result) => {
          const isSelected = selectedResultId === result.id;

          if (result.id === "kalacakra") {
            return (
              <KalacakraCard
                key={result.id}
                result={result}
                isSelected={isSelected}
                onSelect={onSelectResult}
              />
            );
          }

          return (
            <CalendarCard
              key={result.id}
              result={result}
              isSelected={isSelected}
              onSelect={onSelectResult}
            />
          );
        })}

        <FutureCalendarCard title="Candra Kala" description="Future engine" />


      </div>
    </section>
  );
}

export default CalendarLayer;
