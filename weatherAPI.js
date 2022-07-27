const wrapperDiv = document.querySelector(".wrapper");
const inputPart = wrapperDiv.querySelector(".input-part");
const Message = inputPart.querySelector(".info-txt");
const searchInput = wrapperDiv.querySelector("input");
const CurrentLocation = inputPart.querySelector("button");
let weatherIcon = document.getElementById("weather-img");
let backArrow = wrapperDiv.querySelector("header i");
let api;

searchInput.addEventListener("keyup", e => {
    // user press the ENTER button while having a filled input
    if (e.key = "Enter" && searchInput.value != "") {
        reqAPI(searchInput.value);
    }
})
// get the current location of the user
CurrentLocation.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    else {
        alert(" Geolocalization is unsupported by your browser ");
    }
})
// fetch the api using user coordinates
onSuccess = (position) => {
    const { latitude, longitude } = position.coords; // retrieve lat and long of the user device
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apikey}`;
    fetchUserData(api)
}
fetchUserData = (api) => {
    Message.textContent = "Fetching Details 🕙 .."
    Message.classList.add("pending");
    // receiving the api response as an object and passing it into the weatherDetails method
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}
onError = (error) => {
    Message.textContent = "Error getting your location 🛑";
    Message.classList.add("error");
}

let apikey = '5d9b5587c4c47085eda34820894d8b0b';

reqAPI = (city) => {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`;
    Message.textContent = "Fetching Details 🕙 .."
    Message.classList.add("pending");
    // receiving the api response as an object and passing it into the weatherDetails method
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}
function weatherDetails(result) {
    if (result.cod == "404") {
        Message.classList.replace("pending", "error");
        Message.textContent = `${searchInput.value} is not a Valid City !`;
    }
    else {
        // retrieve the required main object properties
        const city = result.name;
        const country = result.sys.country;
        const { description, id } = result.weather[0];
        const { feels_like, humidity, temp } = result.main;

        // display icon according to the id
        if (id == 800) {
            weatherIcon.src = "icons/clear.svg";
        }
        else if (id >= 200 && id <= 232) {
            weatherIcon.src = "icons/storm.svg";
        }
        else if (id >= 600 && id <= 622) {
            weatherIcon.src = "icons/snow.svg";
        }
        else if (id >= 701 && id <= 781) {
            weatherIcon.src = "icons/haze.svg";
        }
        else if (id >= 801 && id <= 804) {
            weatherIcon.src = "icons/cloud.svg";
        }
        else if (id >= 300 && id <= 321 || id >= 500 && id <= 531) {
            weatherIcon.src = "icons/rain.svg";
        }

        //rendering the data as HTML
        wrapperDiv.querySelector(".temp .numb").textContent = Math.floor(temp);
        wrapperDiv.querySelector(".weather").textContent = description;
        wrapperDiv.querySelector(".temp .numb-2").textContent = Math.floor(`${feels_like}`);
        wrapperDiv.querySelector(".humidity span").textContent = `${humidity}%`;
        wrapperDiv.querySelector(".location span").textContent = `${city} , ${country}`;

        Message.classList.remove("pending", "error");
        wrapperDiv.classList.add("active");
    }
}

backArrow.addEventListener("click", () => {
    wrapperDiv.classList.remove("active");
});
