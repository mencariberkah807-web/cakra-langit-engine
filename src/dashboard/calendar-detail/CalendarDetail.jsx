import { getDetailDefinition } from './detailRegistry.js'

export default function CalendarDetail({ result }) {
  const definition = getDetailDefinition(result?.id)

  if (!result || !definition) {
    return (
      <section className="calendar-detail">
        <h2>Calendar Detail</h2>
        <p>No calendar detail selected.</p>
      </section>
    )
  }

  return (
    <section className="calendar-detail">
      <span className="card-kicker">
        {definition.group.toUpperCase()}
      </span>

      <h2>{definition.title}</h2>

      <p>{definition.description}</p>

      <div className="detail-primary">
        <strong>{result.primary}</strong>
      </div>

      <p>{result.secondary}</p>

      {result.details?.length > 0 && (
        <div className="card-details">
          {result.details.map((detail) => (
            <div
              className="detail-row"
              key={detail.label}
            >
              <span>{detail.label}</span>
              <strong>{detail.value}</strong>
            </div>
          ))}
        </div>
      )}

      {result.events?.length > 0 && (
        <div className="detail-events">
          <h3>Events</h3>

          {result.events.map((event, index) => (
            <p key={event.id || index}>
              {event.title || event}
            </p>
          ))}
        </div>
      )}
    </section>
  )
}
