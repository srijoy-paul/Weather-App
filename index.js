const API_key = "76cbcdfffbc0360b58e49191bb4ee752";

const DAY_OF_THE_WEEK = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function createIconURL(iconValue) {
  const iconURL = `http://openweathermap.org/img/wn/${iconValue}@2x.png`;
  // console.log(iconURL);
  return iconURL;
}

async function getWeatherData(city_name) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_key}&units=metric`
  );

  const data = await response.json();
  console.log(data);
  return data;
}

function loadWeatherData(data, hourlyData) {
  currentForecast = document.getElementById("current-forecast");
  document.getElementsByClassName("city")[0].innerText = `${data.name}`;
  document.getElementsByClassName(
    "population-data"
  )[0].innerText = `${hourlyData.city.population}`;
  document.getElementsByClassName(
    "temp"
  )[0].innerHTML = `${data.main.temp.toFixed(1)}&#176; C`;
  document.getElementsByClassName(
    "descp"
  )[0].innerText = `${data.weather[0].description}`;
  document.getElementsByClassName(
    "min-max"
  )[0].innerHTML = `H: ${data.main.temp_max.toFixed(
    1
  )}&#176; C <br> L: ${data.main.temp_min.toFixed(1)}&#176; C`;
}

async function getHourlyWeatherData(city_name) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city_name}&appid=${API_key}&units=metric`
  );
  let data = await response.json();
  console.log(data);
  return data;
}

function loadHourlyWeatherData(currentWeatherData, data) {
  let innerhtmlText = "";

  const timeFormatter = Intl.DateTimeFormat("en", {
    hour12: true,
    hour: "numeric",
  });
  let dataFor12Hours = data.list.slice(2, 14);
  console.log(dataFor12Hours);

  innerhtmlText += `<article>
  <h3 class="time">Now</h3>
  <img class="icon" src="${createIconURL(
    currentWeatherData.weather[0].icon
  )}" alt="" />
  <p class="hourly-temp">${currentWeatherData.main.temp.toFixed(1)}&#176; C</p>
</article>`;

  for (let hours in dataFor12Hours) {
    innerhtmlText += `<article>
      <h3 class="time">${timeFormatter.format(
        new Date(dataFor12Hours[hours].dt_txt)
      )}</h3>
      <img class="icon" src="${createIconURL(
        dataFor12Hours[hours].weather[0].icon
      )}" alt="" />
      <p class="hourly-temp">${dataFor12Hours[hours].main.temp.toFixed(
        1
      )}&#176; C</p>
    </article>`;
    // console.log(hours);
  }

  document.getElementsByClassName("hourly-container")[0].innerHTML =
    innerhtmlText;
}

function loadFeelsLikeData(data) {
  document.getElementsByClassName(
    "feels-temp"
  )[0].innerHTML = `${data.main.feels_like}&#176; C`;
}
function loadHumidityData(data) {
  document.getElementsByClassName(
    "humidity-val"
  )[0].innerText = `${data.main.humidity}%`;
}

function calculateDayWiseForecast(data) {
  let dayWiseForecast = new Map();
  for (let forecast of data.list) {
    let day_of_week =
      DAY_OF_THE_WEEK[new Date(forecast.dt_txt.split(" ")[0]).getDay()];

    if (dayWiseForecast.has(day_of_week)) {
      let foreCastFortheDay = dayWiseForecast.get(day_of_week);
      // console.log(foreCastFortheDay);
      foreCastFortheDay.push(forecast);
      dayWiseForecast.set(day_of_week, foreCastFortheDay);
    } else {
      dayWiseForecast.set(day_of_week, [forecast]);
    }
  }
  console.log(dayWiseForecast);
  return dayWiseForecast;
}

function loadFiveDaysData(hourlyData) {
  const dayWiseForecast = calculateDayWiseForecast(hourlyData);
  console.log(Array.from(dayWiseForecast.keys()).length);
  document.getElementsByClassName("days-forecast-title")[0].innerText =
    Array.from(dayWiseForecast.keys()).length + " day forecast";
  let innerhtmlText = "";
  for (let day of dayWiseForecast.keys()) {
    // console.log(day);
    let dayWiseData = dayWiseForecast.get(day);
    // console.log(dayWiseData[0].main.temp_min);
    let min_temp_day = dayWiseData[0].main.temp_min;
    let max_temp_day = dayWiseData[0].main.temp_max;

    for (let i = 1; i < dayWiseData.length; i++) {
      if (min_temp_day > dayWiseData[i].main.temp_min)
        min_temp_day = dayWiseData[i].main.temp_min;

      if (max_temp_day < dayWiseData[i].main.temp_max)
        max_temp_day = dayWiseData[i].main.temp_max;
    }
    // console.log("Min temp for " + day + " is " + min_temp_day);
    // console.log("Max temp for " + day + " is " + max_temp_day);
    innerhtmlText += `<article class="day-forecast">
    <h3>${day == Array.from(dayWiseForecast.keys())[0] ? "Today" : day}</h3>
    <img src="${createIconURL(dayWiseData[0].weather[0].icon)}"</p>
    <p class="min-temp">${min_temp_day.toFixed(1)}&#176; C</p>
    <p class="max-temp">${max_temp_day.toFixed(1)}&#176; C</p>
  </article>`;
  }
  document.getElementsByClassName("five-days-container")[0].innerHTML =
    innerhtmlText;
}

document.addEventListener("DOMContentLoaded", async () => {
  let city = "Dhanbad"; //prompt("Add city")
  const data = await getWeatherData(city);
  const hourlyData = await getHourlyWeatherData(city);
  loadWeatherData(data, hourlyData);
  loadHourlyWeatherData(data, hourlyData);
  loadFeelsLikeData(data);
  loadHumidityData(data);
  loadFiveDaysData(hourlyData);
});
