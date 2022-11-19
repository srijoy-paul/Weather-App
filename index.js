const API_key = "76cbcdfffbc0360b58e49191bb4ee752";

const DAY_OF_THE_WEEK = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
let lat_lon = [];
let selectedCityText;
let selectedCity;

function createIconURL(iconValue) {
  const iconURL = `https://openweathermap.org/img/wn/${iconValue}@2x.png`;
  // console.log(iconURL);
  return iconURL;
}

async function getWeatherData(city_det) {
  console.log("this" + city_det);

  let response;
  if (city_det[0] && city_det[1]) {
    response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${city_det[0]}&lon=${city_det[1]}&appid=${API_key}&units=metric`
    );
  } else {
    response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city_det[2]}&appid=${API_key}&units=metric`
    );
  }

  // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city_det[0]}&lon=${city_det[1]}&appid=${API_key}&units=metric`);
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
  console.log("cn"+city_name);
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city_name[0]}&lon=${city_name[1]}&appid=${API_key}&units=metric`);
  let data = await response.json();
  console.log(data);
  return data;
}

function loadHourlyWeatherData(currentWeatherData, data) {
  // console.log("loadHD"+data,hourlyData);
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

function debounce(func) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, 500);
  };
}

async function getCities(inputtext) {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${inputtext}&limit=5&appid=${API_key}`
  );
  const data = await response.json();
  // console.log(data);
  return data;
}

let loadCities = async (e) => {
  let innerhtmlText = "";
  let hasCity = new Set();
  if(e.target.value){
    selectedCity=null;
    selectedCityText="";
  }
  if(e.target.value && (selectedCityText !== e.target.value)){

    let citiesAcqrInput = await getCities(e.target.value);
    console.log(citiesAcqrInput);
    for (let searchRes of citiesAcqrInput) {
      console.log(searchRes.name + searchRes.state + searchRes.country);
      if (hasCity.has(searchRes.name + searchRes.state + searchRes.country)) {
        continue;
      } else {
        hasCity.add(searchRes.name + searchRes.state + searchRes.country);
        innerhtmlText += `<option city-data-lat="${searchRes.lat}" city-data-lon="${searchRes.lon}" city-name="${searchRes.name}" value="${searchRes.name}, ${searchRes.state}, ${searchRes.country}"></option>`;
      }
  }
  // console.log(e);
  document.getElementById("cities").innerHTML = innerhtmlText;
  }
};

let debounceSearch = debounce((e) => {
  loadCities(e);
});

async function loadData() {
  const data = await getWeatherData(lat_lon);
  const hourlyData = await getHourlyWeatherData(lat_lon);
  loadWeatherData(data, hourlyData);
  loadHourlyWeatherData(data, hourlyData);
  loadFeelsLikeData(data);
  loadHumidityData(data);
  loadFiveDaysData(hourlyData);
}

let handleSelectedCity = (e) => {
  console.log(e.target.value);
  selectedCityText=e.target.value;
  lat_lon=[];
  // console.log(document.querySelectorAll("#cities>option"));
  let options=document.querySelectorAll("#cities>option");
  if(options.length){
  for (let findOption of document.querySelectorAll("#cities>option")) {
    if (findOption.getAttribute("value") === selectedCityText) {
      console.log("hanle" + findOption.getAttribute("city-name"));
      lat_lon.push(findOption.getAttribute("city-data-lat"));
      lat_lon.push(findOption.getAttribute("city-data-lon"));
      lat_lon.push(findOption.getAttribute("city-name"));
    }
  }
}
  // if(options?.length){
  //   let selectedOption= Array.from(options).find(opt=>opt.value===selectedCityText);
  //   selectedCity=JSON.parse(selectedOption);
  // }
  console.log(lat_lon);
  loadData();
};

function loadIniForecast(){
  lat_lon=[];
  navigator.geolocation.getCurrentPosition(({coords})=>{
    console.log(coords);
    lat_lon.push(coords.latitude);
    lat_lon.push(coords.longitude);
    loadData();

  },error=> console.log(error)); 
}

document.addEventListener("DOMContentLoaded", async () => {
  loadIniForecast();
  document
    .getElementById("searchbar")
    .addEventListener("input", debounceSearch);
  document
    .getElementById("searchbar")
    .addEventListener("change", handleSelectedCity);

  // let city = "Dhanbad"; //prompt("Add city")
  // const data = await getWeatherData(city);
  // const hourlyData = await getHourlyWeatherData(city);
  // loadWeatherData(data, hourlyData);
  // loadHourlyWeatherData(data, hourlyData);
  // loadFeelsLikeData(data);
  // loadHumidityData(data);
  // loadFiveDaysData(hourlyData);
  // loadCities();
});
