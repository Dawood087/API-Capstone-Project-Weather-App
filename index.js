// Imports
import express from "express";
import axios from "axios";

// Express Server + Port
const app = express();
const port = 3000;

// Static für CSS- Styling
app.use(express.static("public"));

// Middleware um Formulardaten zu lesen
app.use(express.urlencoded({ extended: true }));

// Homepage rendern
app.get("/", (req, res) => {
  const today = new Date();
  res.render("index.ejs", {
    city: "",
    temp: "",
    condition: "",
    icon: "",
    temp1min: "",
    temp1max: "",
    temp2min: "",
    temp2max: "",
    temp3min: "",
    temp3max: "",
    temp4min: "",
    temp4max: "",
    dateToday: weekdays[today.getDay()],
    date1: weekdays[(today.getDay() + 1) % 7],
    date2: weekdays[(today.getDay() + 2) % 7],
    date3: weekdays[(today.getDay() + 3) % 7],
    date4: weekdays[(today.getDay() + 4) % 7],
    icon1: "",
    icon2: "",
    icon3: "",
    icon4: "",
    fullDate: today.toLocaleDateString("de-DE"),
    error: req.query.error || null,
  });
});

const weatherCodes = {
  0: "Klar",
  1: "Überwiegend klar",
  2: "Teilweise bewölkt",
  3: "Bewölkt",
  45: "Nebel",
  48: "Reifnebel",
  51: "Leichter Nieselregen",
  53: "Mäßiger Nieselregen",
  55: "Starker Nieselregen",
  56: "Leichter gefrierender Nieselregen",
  57: "Starker gefrierender Nieselregen",
  61: "Leichter Regen",
  63: "Mäßiger Regen",
  65: "Starker Regen",
  66: "Leichter gefrierender Regen",
  67: "Starker gefrierender Regen",
  71: "Leichter Schneefall",
  73: "Mäßiger Schneefall",
  75: "Starker Schneefall",
  77: "Schneekörner",
  80: "Leichte Regenschauer",
  81: "Mäßige Regenschauer",
  82: "Heftige Regenschauer",
  85: "Leichte Schneeschauer",
  86: "Starke Schneeschauer",
  95: "Gewitter",
  96: "Gewitter mit leichtem Hagel",
  99: "Gewitter mit starkem Hagel",
};

const weatherIcons = {
  0: "☀️", // Klar
  1: "🌤️", // Überwiegend klar
  2: "⛅", // Teilweise bewölkt
  3: "☁️", // Bewölkt
  45: "🌫️", // Nebel
  48: "🌫️", // Reifnebel
  51: "🌦️", // Leichter Nieselregen
  53: "🌦️", // Mäßiger Nieselregen
  55: "🌧️", // Starker Nieselregen
  56: "🌧️", // Leichter gefrierender Nieselregen
  57: "🌧️", // Starker gefrierender Nieselregen
  61: "🌦️", // Leichter Regen
  63: "🌧️", // Mäßiger Regen
  65: "🌧️", // Starker Regen
  66: "🌧️", // Leichter gefrierender Regen
  67: "🌧️", // Starker gefrierender Regen
  71: "🌨️", // Leichter Schneefall
  73: "🌨️", // Mäßiger Schneefall
  75: "❄️", // Starker Schneefall
  77: "❄️", // Schneekörner
  80: "🌦️", // Leichte Regenschauer
  81: "🌧️", // Mäßige Regenschauer
  82: "🌧️", // Heftige Regenschauer
  85: "🌨️", // Leichte Schneeschauer
  86: "🌨️", // Starke Schneeschauer
  95: "⛈️", // Gewitter
  96: "⛈️", // Gewitter mit leichtem Hagel
  99: "⛈️", // Gewitter mit starkem Hagel
};

// Bestimmung der Wochentage

const weekdays = [
  "Sonntag", // 0
  "Montag", // 1
  "Dienstag", // 2
  "Mittwoch", // 3
  "Donnerstag", // 4
  "Freitag", // 5
  "Samstag", // 6
];
var today = new Date();

app.post("/", async (req, res) => {
  const city = req.body.location; // "location" kommt vom <input name="location">
  try {
    const response = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=de&format=json`
    );
    const result = response.data;
    const lat = result.results[0].latitude;
    const lon = result.results[0].longitude;
    const cityName = result.results[0].name;
    console.log(lat);
    console.log(lon);

    // Forecast-API direkt hier aufrufen
    const forecastResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&current_weather=true&timezone=auto`
    );
    const forecast = forecastResponse.data;
    console.log(forecast);

    const weatherText = weatherCodes[forecast.current_weather.weathercode];
    const weatherIcon = weatherIcons[forecast.current_weather.weathercode];
    res.render("index.ejs", {
      temp: forecast.current_weather.temperature,
      condition: weatherText,
      city: cityName,
      icon: weatherIcon,
      // Temperaturen der nächsten 4 Tage
      temp1min: forecast.daily.temperature_2m_min[1],
      temp1max: forecast.daily.temperature_2m_max[1],
      temp2min: forecast.daily.temperature_2m_min[2],
      temp2max: forecast.daily.temperature_2m_max[2],
      temp3min: forecast.daily.temperature_2m_min[3],
      temp3max: forecast.daily.temperature_2m_max[3],
      temp4min: forecast.daily.temperature_2m_min[4],
      temp4max: forecast.daily.temperature_2m_max[4],
      dateToday: weekdays[today.getDay()],
      date1: weekdays[(today.getDay() + 1) % 7],
      date2: weekdays[(today.getDay() + 2) % 7],
      date3: weekdays[(today.getDay() + 3) % 7],
      date4: weekdays[(today.getDay() + 4) % 7],
      icon1: weatherIcons[forecast.daily.weathercode[1]],
      icon2: weatherIcons[forecast.daily.weathercode[2]],
      icon3: weatherIcons[forecast.daily.weathercode[3]],
      icon4: weatherIcons[forecast.daily.weathercode[4]],
      fullDate: today.toLocaleDateString("de-DE"),
      error: null,
    });
  } catch (error) {
    console.log(error.response.data);
    res.redirect("/?error=1");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
