import { useTodayContext } from '../../core/TodayContext'
import { getDailyTimeline } from './timelineAggregator'

function TimelineItem({ item }) {
  const isAllDay = item.timing === 'ALL_DAY'

  return (
    <article className="timeline-item">
      <div className="timeline-time">
        {isAllDay ? 'ALL DAY' : item.time}
      </div>

      <div className="timeline-marker" />

      <div className="timeline-content">
        <div className="timeline-item-header">
          <h3>{item.title}</h3>

          <span className="timeline-type">
            {item.type}
          </span>
        </div>

        <p>
          {item.source}
        </p>
      </div>
    </article>
  )
}

export default function Timeline() {
  const context = useTodayContext()

  const items = getDailyTimeline(context)

  return (
    <section className="timeline-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            DAILY EVENTS
          </span>

          <h2>Today Event</h2>
        </div>

        <span className="section-status">
          {items.length} events
        </span>
      </div>

      <div className="timeline-list">
        {items.length > 0 ? (
          items.map((item) => (
            <TimelineItem
              key={item.id}
              item={item}
            />
          ))
        ) : (
          <div className="timeline-empty">
            No events for this date
          </div>
        )}
      </div>
    </section>
  )
}
