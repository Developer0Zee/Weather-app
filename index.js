document.querySelector(".locationButton").addEventListener("click", fetchLocation);

document.querySelector(".searchButton").addEventListener("click", fetchWeather);
document.querySelector("#searchBar").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        fetchWeather();
    }
});

document.getElementById("recentSearchToggle").addEventListener("click", function () {
    document.getElementById("recentSearchList").classList.toggle("hidden");
});

const apiKey = '127ff9ec9daad07b74af1c099891827f';

function fetchLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    fetchWeatherData(`lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
}

function fetchWeather() {
    const city = document.querySelector("#searchBar").value.trim();
    if (!city) {
        alert("Please enter a city name");
        return;
    }
    fetchWeatherData(`q=${city}`, city);
}

function fetchWeatherData(query, city = "") {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${apiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod != 200) {
                alert(`Error: ${data.message}`);
                return;
            }
            displayData(data);
            if (city) saveSearchCity(city);
        })
        .catch(err => alert("Failed to fetch weather data. Check your internet connection."));

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod != "200") {
                alert(`Error: ${data.message}`);
                return;
            }
            displayForecastData(data);
        })
        .catch(err => alert("Failed to fetch forecast data. Check your internet connection."));
}

function displayData(data) {
    document.querySelector(".cityContainer").innerHTML = `
        <h2>${data.name} (${new Date().toISOString().split("T")[0]})</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Wind: ${data.wind.speed} M/S</p>
        <p>Humidity: ${data.main.humidity}%</p>
    `;
}

function displayForecastData(data) {
    document.querySelector(".foreCastContainer").innerHTML = "";
    const dailyForecast = {};
    data.list.forEach(entry => {
        const date = entry.dt_txt.split(" ")[0];
        if (!dailyForecast[date]) {
            dailyForecast[date] = entry;
        }
    });

    Object.values(dailyForecast).slice(0, 5).forEach(entry => {
        const iconCode = entry.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        
        document.querySelector(".foreCastContainer").innerHTML += `
            <div class="bg-gray-700 text-white p-4 rounded-lg shadow-md">
                <p class="font-bold">(${entry.dt_txt.split(" ")[0]})</p>
                <img src="${iconUrl}" alt="Weather Icon" class="inline-block">
                <p>Temperature: ${entry.main.temp}°C</p>
                <p>Wind: ${entry.wind.speed} M/S</p>
                <p>Humidity: ${entry.main.humidity}%</p>
            </div>
        `;
    });
}

function showError(error) {
    alert(`Error: ${error.message}`);
}

function saveSearchCity(city) {
    let cities = JSON.parse(localStorage.getItem("recentCities")) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        if (cities.length > 5) cities.shift();
        localStorage.setItem("recentCities", JSON.stringify(cities));
    }
    updateRecentSearchDropdown();
}

function updateRecentSearchDropdown() {
    const cities = JSON.parse(localStorage.getItem("recentCities")) || [];
    const dropDown = document.getElementById("recentSearchList");
    dropDown.innerHTML = "";
    
    document.getElementById("recentSearchContainer").classList.toggle("hidden", cities.length === 0);
    
    cities.forEach(city => {
        const li = document.createElement("li");
        li.className = "p-2 hover:bg-blue-600 cursor-pointer border rounded-md shadow-md";
        li.textContent = city;
        li.addEventListener("click", function () {
            document.getElementById("searchBar").value = city;
            fetchWeather();
        });
        dropDown.appendChild(li);
    });
}

updateRecentSearchDropdown();
