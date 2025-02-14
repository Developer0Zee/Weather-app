const click = document.querySelector(".searchButton");
click.addEventListener("click", fetchWeather);

const pressed = document.querySelector("#searchBar");
pressed.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        fetchWeather();
    }
});

function fetchWeather() {
    const city = document.querySelector("input").value.trim();

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
        .catch(err => console.log("Error while fetching the weather data:", err));

    fetch(foreCastUrl)
        .then(response => response.json())
        .then(data => displayForecastData(data))
        .catch(err => console.log("Error while fetching the forecast data:", err));
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
    document.querySelector(".foreCastContainer").innerHTML = "";

    const dailyForecast = {};
    data.list.forEach(entry => {
        const date = entry.dt_txt.split(" ")[0];
        if (!dailyForecast[date]) {
            dailyForecast[date] = entry; // Storing the first forecast for each day
        }
    });

    Object.values(dailyForecast).slice(0, 5).forEach(entry => {
        document.querySelector(".foreCastContainer").innerHTML += `
            <div class="forecast-card">
                <p>(${entry.dt_txt.split(" ")[0]})</p>
                <p>Temperature: ${entry.main.temp}°C</p>
                <p>Wind: ${entry.wind.speed} M/S</p>
                <p>Humidity: ${entry.main.humidity}%</p>
            </div>
        `;
    });
}
