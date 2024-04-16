function displayWeather(response) {
  console.log(response);
  let temperatureElement = document.querySelector("#current-temperature");
  console.log("Temperature element:", temperatureElement);
  let weatherIconElement = document.querySelector("#weather-icon");
  let temperature = Math.round(response.data.temperature.current);
  let cityElement = document.querySelector("#current-city");
  console.log("City element:", cityElement);

  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let weatherConditionElement = document.querySelector("#weather-condition");
  let currentDateElement = document.querySelector("#current-date");

  cityElement.innerHTML = response.data.city;
  temperatureElement.innerHTML = `${temperature}°C`;
  weatherIconElement.src = response.data.condition.icon_url;
  weatherIconElement.alt = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed} km/h`;
  weatherConditionElement.innerHTML = response.data.condition.description;
  currentDateElement.innerHTML = formatDate(response.data.time);
  getForecast(response.data.city);
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
  let city = searchInputElement.value;
  let apiKey = "10b545o25teaa28dd38fd076fc778f2c";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios(apiUrl).then(displayWeather);
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

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return `${dayOfWeek}, ${monthNames[month]} ${day}, ${year} ${hours}:${minutes}`;

}

function formatShortDate (time) {
  let date = new Date(time*1000);
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

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml = forecastHtml +
        `<div class="container text-center">
              <div class="col">
                <div class="weather-forecast-date">${formatShortDate(day.time)}</div>
                <img
                  class="card-img"
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
