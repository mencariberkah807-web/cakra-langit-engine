import { getResultsByGroup } from "../core/resultRegistry.js";
import { adaptSun } from "../adapters/sun.adapter.js";

const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function buildDashboardData(context, language = "en") {
  const apiData = context.apiData;
  const naturalResults = getResultsByGroup("natural", context);
  const calendarResults = getResultsByGroup("calendar", context);
  const sunResult = naturalResults.find((result) => result.id === "sun") || null;
  const moonResult = naturalResults.find((result) => result.id === "moon") || null;
  const selectedSun = adaptSun({
    ...context,
    sunTime: context.selectedTime,
    time: { ...context.time, instant: context.selectedDate },
  });
  const sunData = selectedSun?.data || selectedSun?.value || selectedSun || {};
  const sun = {
    ...sunData,
    sunrise: sunData.sunrise ?? null,
    sunset: sunData.sunset ?? null,
    dawn: sunData.dawn ?? null,
    noon: sunData.noon ?? null,
    dusk: sunData.dusk ?? null,
    golden_hour: sunData.golden_hour ?? null,
    altitude: sunData.altitude ?? null,
    selectedTime: sunData.selectedTime ?? context.selectedTime,
  };
  const sunEvents = Array.isArray(selectedSun?.events) ? selectedSun.events : [];
  const schedule = sunEvents.map((event) => ({
    time: event.time,
    title: event.title,
    cat: event.type,
    sub: event.sub || (event.type === "SOLAR" ? "Sun" : "Sky"),
  }));
  const eclipseResult = naturalResults.find((result) => result.id === "eclipse") || null;
  const eclipseData = eclipseResult?.data || eclipseResult?.value || eclipseResult || {};
  const moonData = moonResult?.data || moonResult?.value || moonResult || {};
  const skyResult = naturalResults.find((result) => result.id === "sky") || null;
  const earthResult = naturalResults.find((result) => result.id === "earth-space") || null;
  const skyData = apiData?.natural?.sky || {
    ...skyResult,
    context: skyResult?.context || skyResult?.primary || null,
    skyState: skyResult?.skyState || skyResult?.primary || null,
    bortle: skyResult?.bortle || skyResult?.details?.find((item) => item.label === "Bortle")?.value || null,
  };
  const earthApiData = apiData?.natural?.earth || {};
  const earthData = {
    ...earthResult,
    ...earthApiData,
    primary:
      earthApiData.primary ||
      earthResult?.primary ||
      (earthApiData.dayOfYear || earthApiData.day_of_year || earthResult?.dayOfYear || earthResult?.day_of_year
        ? `Day ${earthApiData.dayOfYear ?? earthApiData.day_of_year ?? earthResult?.dayOfYear ?? earthResult?.day_of_year}`
        : null),
    secondary:
      earthApiData.secondary ||
      earthResult?.secondary ||
      (earthApiData.annual_pct ?? earthApiData.progress ?? earthResult?.annual_pct ?? earthResult?.progress) != null
        ? `${earthApiData.annual_pct ?? earthApiData.progress ?? earthResult?.annual_pct ?? earthResult?.progress}% of annual cycle`
        : null,
    context:
      earthApiData.context ||
      earthResult?.context ||
      earthApiData.primary ||
      earthResult?.primary ||
      null,
  };
  const ticker = Array.isArray(apiData?.ticker)
    ? apiData.ticker.map((item) =>
        typeof item === "string" && item.toLowerCase().startsWith("moon ")
          ? `Moon ${moonData.phase ?? "—"} · ${moonData.illumination ?? "—"}%`
          : item
      )
    : [];

  return {
    ...context,
    ...(apiData || {}),
    location: apiData?.location
      ? {
          ...context.location,
          ...apiData.location,
          timezoneLabel:
            apiData.location.timezoneLabel ||
            context.location?.timezoneLabel ||
            null,
        }
      : context.location,
    date_info:
      apiData?.date_info ||
      {
        date_long: context.selectedDate
          ? new Intl.DateTimeFormat(
              language === "id" ? "id-ID" : "en-US",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: context.location?.timezone,
              }
            ).format(context.selectedDate)
          : null,
      },
    natural: {
      ...(apiData?.natural || context.natural || {}),
      sun,
      moon: moonResult?.data || moonResult || null,
      eclipse:
        naturalResults.find((r) => r.id === "eclipse")?.data ||
        naturalResults.find((r) => r.id === "eclipse") ||
        null,
      sky: skyData,
      earth: earthData,
      tide:
        apiData?.natural?.tide ||
        naturalResults.find((r) => r.id === "tide")?.data ||
        naturalResults.find((r) => r.id === "tide") ||
        null,
    },
    schedule: apiData?.schedule || schedule,
    quick_jumps:
      apiData?.quick_jumps || {
        today:
          context.mode === "live" && context.selectedDate
            ? iso(context.selectedDate)
            : null,
        next_full_moon: moonResult?.nextFullMoon ?? null,
        next_eclipse: eclipseData.next ?? null,
      },
    calendars: calendarResults
      .filter((result) => result.id !== "gregorian")
      .map((result) => ({
        ...result,
        name: result.name || result.title || result.id,
        headline: result.headline ?? result.primary ?? null,
        sub: result.sub ?? result.secondary ?? null,
        fields: Array.isArray(result.fields)
          ? result.fields
          : Array.isArray(result.details)
            ? result.details.map((field, index) => ({
                k: field.k ?? field.label ?? `Field ${index + 1}`,
                v: field.v ?? field.value ?? null,
              }))
            : [],
        future: Boolean(result.future),
      })),
    ticker,
  };
}
