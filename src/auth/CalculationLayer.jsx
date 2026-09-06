import { TodayProvider } from '../core/TodayContext'
import CalculationDashboard from './CalculationDashboard'

export default function CalculationLayer() {
  return (
    <TodayProvider>
      <CalculationDashboard />
    </TodayProvider>
  )
}
