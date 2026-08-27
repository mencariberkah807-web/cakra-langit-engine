import { useTodayContext } from '../../core/TodayContext'
import { getResultsByGroup } from '../../core/resultRegistry'

function NaturalCard({ result }) {
  return (
    <article className="almanac-card">
      <span className="card-kicker">NATURAL</span>

      <h3>{result.title}</h3>

      <p className="card-primary">
        {result.primary}
      </p>

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
    </article>
  )
}

export default function NaturalLayer() {
  const context = useTodayContext()

  const results = getResultsByGroup(
    'natural',
    context
  )

  return (
    <div className="card-grid">
      {results.map((result) => (
        <NaturalCard
          key={result.id}
          result={result}
        />
      ))}
    </div>
  )
}
