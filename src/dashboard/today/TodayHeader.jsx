import Header from "../../cakra-ui/Header";
import { useTodayContext } from "../../core/TodayContext";

export default function TodayHeader() {
  const {
    location,
    locations,
    selectedLocation,
    activeDate,
    mode,
    setLocationById,
    goLive,
  } = useTodayContext();

  const data = {
    location,
    date_info: {
      date_long: activeDate
        ? new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: location?.timezone,
          }).format(activeDate)
        : "—",
    },
  };

  const cakraLocations = locations.map((item) => ({
    ...item,
    name: item.city,
    region: item.province,
  }));

  return (
    <Header
      data={data}
      locations={cakraLocations}
      city={selectedLocation?.id || ""}
      onCityChange={setLocationById}
      isToday={mode === "live"}
    />
  );
}
