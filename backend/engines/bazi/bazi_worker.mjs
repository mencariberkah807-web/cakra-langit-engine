import { Solar } from 'lunar-javascript'

const input = JSON.parse(process.argv[2])

const solar = Solar.fromYmdHms(
  input.year,
  input.month,
  input.day,
  input.hour ?? 0,
  input.minute ?? 0,
  input.second ?? 0,
)

const lunar = solar.getLunar()

const result = {
  input: {
    date: `${input.year}-${String(input.month).padStart(2, '0')}-${String(input.day).padStart(2, '0')}`,
    time: `${String(input.hour ?? 0).padStart(2, '0')}:${String(input.minute ?? 0).padStart(2, '0')}:${String(input.second ?? 0).padStart(2, '0')}`,
  },

  year: {
    gan: lunar.getYearGan(),
    zhi: lunar.getYearZhi(),
    ganzhi: lunar.getYearInGanZhi(),
    exact: lunar.getYearInGanZhiExact(),
  },

  month: {
    ganzhi: lunar.getMonthInGanZhi(),
    exact: lunar.getMonthInGanZhiExact(),
  },

  day: {
    ganzhi: lunar.getDayInGanZhi(),
    exact: lunar.getDayInGanZhiExact(),
    exact2: lunar.getDayInGanZhiExact2(),
  },

  hour: {
    gan: lunar.getTimeGan(),
    zhi: lunar.getTimeZhi(),
    ganzhi: lunar.getTimeInGanZhi(),
  },

  eightChar: lunar.getEightChar().toString(),
}

process.stdout.write(JSON.stringify(result))
