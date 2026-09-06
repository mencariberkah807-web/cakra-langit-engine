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

process.stdout.write(
  JSON.stringify({
    year: lunar.getYear(),
    yearName: lunar.getYearInChinese(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
    isLeapMonth: lunar.getMonth() < 0,
  }),
)
