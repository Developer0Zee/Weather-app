document.querySelector(".locationButton").addEventListener("click", fetchLocation);

function fetchLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = '127ff9ec9daad07b74af1c099891827f';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const foreCastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => displayData(data))
        .catch(err => console.error("Error while fetching the weather data:", err));

    fetch(foreCastUrl)
        .then(response => response.json())
        .then(data => displayForecastData(data))
        .catch(err => console.error("Error while fetching the forecast data:", err));
}

function showError(error) {
    alert(`Error: ${error.message}`);
}

document.querySelector(".searchButton").addEventListener("click", fetchWeather);
document.querySelector("#searchBar").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        fetchWeather();
    }
});

function fetchWeather() {
    const city = document.querySelector("#searchBar").value.trim();
    if (!city) {
        alert("Please enter a city name");
        return;
    }

    const apiKey = '127ff9ec9daad07b74af1c099891827f';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const foreCastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => displayData(data))
        .catch(err => console.error("Error while fetching the weather data:", err));

    fetch(foreCastUrl)
        .then(response => response.json())
        .then(data => displayForecastData(data))
        .catch(err => console.error("Error while fetching the forecast data:", err));
}

function displayData(data) {
    if (data.cod != 200) {
        document.querySelector(".cityContainer").innerHTML = `<p>Error: ${data.message}</p>`;
        return;
    }

    document.querySelector(".cityContainer").innerHTML = `
        <h2>${data.name} (${new Date().toISOString().split("T")[0]})</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Wind: ${data.wind.speed} M/S</p>
        <p>Humidity: ${data.main.humidity}%</p>
    `;
}

function displayForecastData(data) {
    if (data.cod != "200") {
        document.querySelector(".foreCastContainer").innerHTML = `<p>Error: ${data.message}</p>`;
        return;
    }

    document.querySelector(".foreCastContainer").innerHTML = "";

    const dailyForecast = {};
    data.list.forEach(entry => {
        const date = entry.dt_txt.split(" ")[0];
        if (!dailyForecast[date]) {
            dailyForecast[date] = entry;
        }
    });

    Object.values(dailyForecast).slice(0, 5).forEach(entry => {
        document.querySelector(".foreCastContainer").innerHTML += `
            <div class="bg-gray-700 text-white p-4 rounded-lg shadow-md">
                <p class="font-bold">(${entry.dt_txt.split(" ")[0]})</p>
                <p>Temperature: ${entry.main.temp}°C</p>
                <p>Wind: ${entry.wind.speed} M/S</p>
                <p>Humidity: ${entry.main.humidity}%</p>
            </div>
        `;
    });
}
