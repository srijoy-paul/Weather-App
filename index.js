const API_key = "76cbcdfffbc0360b58e49191bb4ee752";

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

function loadHourlyWeatherData(data) {
  let innerhtmlText = "";

  for (let hours in data.list) {
    innerhtmlText += `<article>
      <h3 class="time">${data.list[hours].dt_txt.split(" ")[1]}</h3>
      <img class="icon" src="${createIconURL(
        data.list[hours].weather[0].icon
      )}" alt="" />
      <p class="hourly-temp">${data.list[hours].main.temp.toFixed(
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

document.addEventListener("DOMContentLoaded", async () => {
  let city = "Dhanbad"; //prompt("Add city")
  const data = await getWeatherData(city);
  const hourlyData = await getHourlyWeatherData(city);
  loadWeatherData(data, hourlyData);
  loadHourlyWeatherData(hourlyData);
  loadFeelsLikeData(data);
  loadHumidityData(data);
});
