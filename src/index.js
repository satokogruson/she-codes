function convertToCelsius() {
  if (currentTemperatureCelsius !== null) {
    let temperatureElement = document.querySelector("#current-temperature");
    temperatureElement.innerHTML = `${currentTemperatureCelsius}`;
    convertForecastToCelsius();
    toggleButtons(true);
  }
}

function convertToFahrenheit() {
  let temperatureElement = document.querySelector("#current-temperature");
  let temperature = parseInt(temperatureElement.innerHTML, 10);

  let fahrenheit = Math.round((temperature * 9 / 5) + 32);
  temperatureElement.innerHTML = `${fahrenheit}`;
  convertForecastToFahrenheit();
  toggleButtons(false);
}

function toggleButtons(isCelsius) {
  let celsiusButton = document.querySelector("#convert-to-celsius");
  let fahrenheitButton = document.querySelector("#convert-to-fahrenheit");
  celsiusButton.disabled = isCelsius;
  fahrenheitButton.disabled = !isCelsius;
}

function displayWeather(response) {
  let temperatureElement = document.querySelector("#current-temperature");
  currentTemperatureCelsius = Math.round(response.data.temperature.current);
  temperatureElement.innerHTML = `${currentTemperatureCelsius}`;
  toggleButtons(true);

  let cityElement = document.querySelector("#current-city");
  let weatherIconElement = document.querySelector("#weather-icon");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let weatherConditionElement = document.querySelector("#weather-condition");
  let currentDateElement = document.querySelector("#current-date");

  cityElement.innerHTML = response.data.city;
  weatherIconElement.src = response.data.condition.icon_url;
  weatherIconElement.alt = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed} km/h`;
  weatherConditionElement.innerHTML = response.data.condition.description;
  currentDateElement.innerHTML = formatDate(response.data.time);
}
function convertForecastToFahrenheit() {
  document.querySelectorAll(".weather-forecast-temperature-max, .weather-forecast-temperature-min").forEach((elem, index) => {
    let isMax = elem.classList.contains("weather-forecast-temperature-max");
    let tempCelsius = isMax ? forecastTemperaturesCelsius[Math.floor(index / 2)].max : forecastTemperaturesCelsius[Math.floor(index / 2)].min;
    let tempFahrenheit = Math.round((tempCelsius * 9 / 5) + 32);
    elem.innerHTML = `<strong>${tempFahrenheit}°</strong>`;
  });
}

function convertForecastToCelsius() {
  document.querySelectorAll(".weather-forecast-temperature-max, .weather-forecast-temperature-min").forEach((elem, index) => {
    let isMax = elem.classList.contains("weather-forecast-temperature-max");
    let tempCelsius = isMax ? forecastTemperaturesCelsius[Math.floor(index / 2)].max : forecastTemperaturesCelsius[Math.floor(index / 2)].min;
    elem.innerHTML = `<strong>${tempCelsius}°</strong>`;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  let searchForm = document.querySelector("#search-form");
  searchForm.addEventListener("submit", search);
});

function loadDefaultCityWeather(defaultCity) {
  let apiKey = "10b545o25teaa28dd38fd076fc778f2c";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${defaultCity}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather).catch(error => {
    console.error("Failed to fetch weather data:", error);
  });
}

function search(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#search-input");
  let city = searchInputElement.value.trim();
  if (!city) {
    console.log("No city entered");
    return;
  }
  let apiKey = "10b545o25teaa28dd38fd076fc778f2c";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(response => {
    displayWeather(response);
    getForecast(city);
  }).catch(error => {
    console.error("Failed to fetch weather data:", error);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  let searchForm = document.querySelector("#search-form");
  searchForm.addEventListener("submit", search);

  let currentDateElement = document.querySelector("#current-date");
  let currentDate = new Date();
  currentDateElement.innerHTML = formatDate(currentDate);
});

function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let dayOfWeek = daysOfWeek[date.getDay()];

  minutes = minutes < 10 ? `0${minutes}` : minutes;
  hours = hours < 10 ? `0${hours}` : hours;

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return `${dayOfWeek}, ${monthNames[month]} ${day}, ${year} ${hours}:${minutes}`;
}

function formatShortDate(time) {
  let date = new Date(time * 1000);
  let shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return shortDays[date.getDay()];
}

function getForecast(city) {
  let apiKey = "10b545o25teaa28dd38fd076fc778f2c";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(displayForecast);
}


function displayForecast(response) {
  console.log(response.data);


  let forecastHtml = "";
  forecastTemperaturesCelsius = response.data.daily.map(day => ({
    max: Math.round(day.temperature.maximum),
    min: Math.round(day.temperature.minimum)
  }));

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml = forecastHtml +
        `<div class="container text-center">
              <div class="col">
                <div class="weather-forecast-date">${formatShortDate(day.time)}</div>
                <img
                  class="weather-icon"
                  id="weather-icon"
                  srcset="
                 ${day.condition.icon_url}
                  "
                  alt="sml weather-icon"
                />
                <div class="weather-forecast-temperature">
                  <div class="weather-forecast-temperature-max"><strong>${Math.round(day.temperature.maximum)
        }°</strong></div>
                  <div class="weather-forecast-temperature-min">${Math.round(day.temperature.minimum)}°</div>
                </div>
              </div>
          </div>`
        ;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}


loadDefaultCityWeather("Munich");
getForecast("Munich");