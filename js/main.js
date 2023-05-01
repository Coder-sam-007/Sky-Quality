const submit_btn = document.querySelector("#submit-btn");
const country = document.querySelector("#country");
const state = document.querySelector("#state");
const AQI = document.querySelector("#AQI");
const statement = document.querySelector("#statement");
const scroll_btn = document.querySelector(".mouse-wrapper");

import { API_KEY } from "./apikey.js";

const fetch_coordinates = async (cityName) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${1}&appid=${API_KEY}`
    );

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    let city_data = {
      name: data[0].name,
      state: data[0].state,
      country: data[0].country,
    };

    let coordinates = {
      lat: data[0].lat,
      lon: data[0].lon,
    };

    return [city_data, coordinates];
  } catch (error) {
    console.log(error);
  }
};

const fetch_air_quality = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    return data.list[0].main;
  } catch (error) {
    console.log(error);
  }
};

const get_air_quality = async (cityName) => {
  try {
    const coordinates = await fetch_coordinates(cityName);
    const lat = coordinates[1].lat;
    const lon = coordinates[1].lon;

    console.log(coordinates[0]);
    console.log(coordinates[0].country);
    console.log(coordinates[0].state);
    country.textContent = coordinates[0].country;
    state.textContent = coordinates[0].state;

    const air_quality = await fetch_air_quality(lat, lon);
    return air_quality;
  } catch (error) {
    console.log(error);
  }
};

submit_btn.addEventListener("click", (e) => {
  e.preventDefault();
  let cityName = document.getElementById("cityName").value;
  console.log(cityName);

  get_air_quality(cityName).then((data) => {
    let air_quality_index = data.aqi;
    AQI.textContent = air_quality_index;
    switch (air_quality_index) {
      case 1:
        statement.textContent = "The air quality of your city is good.. (5/5)";
        break;

      case 2:
        statement.textContent = "The air quality of your city is fair.. (4/5)";
        break;

      case 3:
        statement.textContent =
          "The air quality of your city is moderate.. (3/5)";
        break;

      case 4:
        statement.textContent = "The air quality of your city is poor.. (2/5)";
        break;
      case 5:
        statement.textContent =
          "The air quality of your city is very poor.. (1/5)";
        break;

      default:
        statement.textContent =
          "Your air quality doesn't even rank on the index";
        break;
    }
  });
});

//header stuff

const header = document.querySelector("header");
const hambugerMenu = document.querySelector(".hamburger-menu");

hambugerMenu.addEventListener("click", () => {
  header.classList.toggle("active");
});

window.addEventListener("scroll", () => {
  document.body.scrollTop > 20 || document.documentElement.scrollTop > 20
    ? header.classList.add("sticky")
    : header.classList.remove("sticky");
});

const links = document.querySelectorAll(".menu-list>ul>*");

links.forEach((link) =>
  link.addEventListener("click", () => header.classList.remove("active"))
);


// scroll btn

const scroll = () => {
  window.scrollTo({
    top: window.innerHeight,
    behavior: "smooth",
  });
};

scroll_btn.addEventListener("click", () => scroll());
