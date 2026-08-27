import { useTodayContext } from '../../core/TodayContext'

import { adaptGregorian } from '../../adapters/gregorian.adapter'
import { adaptJawaCalendar } from '../../adapters/jawa.adapter'
import { adaptSakaSunda } from '../../adapters/sakaSunda.adapter'

function CalendarCard({ result }) {
  return (
    <article
      className="almanac-card"
      style={{
        minWidth: 0,
        width: '100%',
      }}
    >
      <span className="card-kicker">
        CALENDAR
      </span>

      <h3>{result.title}</h3>

      <p className="card-primary">
        {result.primary}
      </p>

      {result.secondary && (
        <p className="card-secondary">
          {result.secondary}
        </p>
      )}

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
    </article>
  )
}

function FutureCalendarCard({ title, description }) {
  return (
    <article
      className="almanac-card"
      style={{
        minWidth: 0,
        width: '100%',
      }}
    >
      <span className="card-kicker">
        CALENDAR
      </span>

      <h3>{title}</h3>

      <p className="card-secondary">
        {description}
      </p>
    </article>
  )
}

function CalendarLayer() {
  const context = useTodayContext()

  const calendars = [
    adaptGregorian(context),
    adaptJawaCalendar(context),
    adaptSakaSunda(context),
  ]

  return (
    <section className="almanac-layer">
      <style>{`
        .calendar-layer-grid {
          display: grid !important;
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          gap: 12px !important;
          width: 100% !important;
          align-items: stretch !important;
        }

        .calendar-layer-grid .almanac-card {
          width: 100% !important;
          min-width: 0 !important;
        }

        @media (max-width: 1200px) {
          .calendar-layer-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 900px) {
          .calendar-layer-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 600px) {
          .calendar-layer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="layer-heading">
        <div>
          <span className="section-kicker">
            MULTI-CALENDAR
          </span>

          <h2>Calendar Layer</h2>
        </div>

        <span className="layer-status">
          Foundation
        </span>
      </div>

      <div className="calendar-layer-grid">
        {calendars.map((result) => (
          <CalendarCard
            key={result.id}
            result={result}
          />
        ))}

        <FutureCalendarCard
          title="Candra Kala"
          description="Future engine"
        />

        <FutureCalendarCard
          title="Bali"
          description="Future engine"
        />

        <FutureCalendarCard
          title="Chinese Lunar"
          description="Future engine"
        />

        <FutureCalendarCard
          title="Hijri"
          description="Future engine"
        />

        <FutureCalendarCard
          title="Kalacakra"
          description="Protected engine"
        />
      </div>
    </section>
  )
}

export default CalendarLayer
