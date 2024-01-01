document.addEventListener("DOMContentLoaded", function () {
  const hourlyForecastWrapper = document.getElementById("temp-list"),
    sunriseTime = document.getElementById("sunriseTime"),
    sunsetTime = document.getElementById("sunsetTime"),
    chanceOfRain = document.getElementById("chanceOfRain"),
    Pressure = document.getElementById("Pressure"),
    Wind = document.getElementById("Wind"),
    UVIndex = document.getElementById("UVIndex"),
    FeelsLike = document.getElementById("FeelsLike"),
    Visibility = document.getElementById("Visibility"),
    search = document.getElementById("search"),
    celsiusFahrenheit = document.getElementById("celsius-fahrenheit");

  let previousContent, dataLoaded;
  const apiKey = "71ac65a6fdmshf408c19fd20cd34p161682jsnddf95b578a9e";
  const getCity = (city) => {
    const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${city}&days=1`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": `${apiKey}`,
        "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
      },
    };

    async function fetchData(url, options) {
      try {
        const response = await fetch(url, options);
        const result = await response.json();
        dataLoaded = true;
        previousContent = hourlyForecastWrapper.innerHTML;
        hourlyForecastWrapper.innerHTML = "";
        document.getElementById(
          "cityName"
        ).innerHTML = `${result.location.name}, ${result.location.country}`;
        document.getElementById("current_temp_icon").src =
          result.current.condition.icon;
        document.getElementById(
          "current-temp"
        ).innerHTML = `${result.current.temp_c} <sup>°</sup>`;
        const forecastDayOneELement = result.forecast.forecastday;
        const hourArray = forecastDayOneELement["0"];
        document.getElementById(
          "min-temp"
        ).innerHTML = `${hourArray.day.mintemp_c} <sup>°</sup>`;
        hourArray.hour.map(
          (element) => (
            (Time = element.time.split(" ")[1]),
            Time === "00:00" ? (Time = "12:00") : (Time = Time),
            (hourlyForecastWrapper.innerHTML += `
                        <div class="temp-item">
                  <h3 id="hourTime">${Time}</h3>
                  <img src="${element.condition.icon}" alt="temp_indicator" id="hourTempImg"/>
                  <h2 id="hourTemp" style="color: rgb(55 54 54);font-size: 16px;"  class="celsius">${element.temp_c} <sup>°</sup></h2>
                </div>
                        `)
          )
        );

        sunriseTime.innerHTML = hourArray.astro.sunrise.split(" ")[0];
        sunsetTime.innerHTML = hourArray.astro.sunset.split(" ")[0];
        chanceOfRain.innerHTML = `${hourArray.day.daily_will_it_rain}%`;
        Pressure.innerHTML = `${result.current.pressure_mb} mb`;
        Wind.innerHTML = `${result.current.wind_kph} km/h`;
        UVIndex.innerHTML = `${result.current.uv} of 10`;
        FeelsLike.innerHTML = `${result.current.feelslike_c} <sup>°</sup>`;
        Visibility.innerHTML = `${result.current.vis_km} km`;
      } catch (error) {
        console.error(error);
        alert("Please enter correct name of city....");
        hourlyForecastWrapper.innerHTML = previousContent;
        dataLoaded = false;
      }
    }

    // Call the asynchronous function
    fetchData(url, options);
  };

  document.getElementById("citySubmit").addEventListener("click", () => {
    getCity(search.value);
  });
  getCity("kathmandu");

  let debounceTimer;
  search.addEventListener("input", function () {
    clearTimeout(debounceTimer);

    const inputValue = search.value.trim();
    if (inputValue.length > 0) {
      debounceTimer = setTimeout(() => {
        const autocompleteUrl = `https://weatherapi-com.p.rapidapi.com/search.json?q=${inputValue}`;

        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": `${apiKey}`,
            "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
          },
        };
        fetch(autocompleteUrl, options)
          .then((response) => response.json())
          .then((data) => {
            displaySuggestions(data);
          })
          .catch((error) =>
            console.error("Error fetching autocomplete suggestions:", error)
          );
      }, 300);
    } else {
      clearSuggestions();
    }
  });

  function displaySuggestions(suggestions) {
    document.getElementById("autocompleteContainer").innerHTML = "";
    suggestions.forEach((suggestion) => {
      const suggestionElement = document.createElement("p");
      suggestionElement.textContent = `${suggestion["name"]}, ${suggestion["country"]}`;
      document
        .getElementById("autocompleteContainer")
        .appendChild(suggestionElement);
      suggestionElement.addEventListener("click", function () {
        search.value = `${suggestion["name"]}, ${suggestion["country"]}`;
        clearSuggestions();
      });
    });
    document.getElementById("autocompleteContainer").style.display = "block";
  }

  function clearSuggestions() {
    document.getElementById("autocompleteContainer").innerHTML = "";
    document.getElementById("autocompleteContainer").style.display = "none";
  }
  document.addEventListener("click", function (event) {
    if (!event.target.closest("#autocompleteContainer")) {
      clearSuggestions();
    }
  });

  function handleChange() {
    let celsius = document.getElementsByClassName("celsius");
    if (dataLoaded) {
      if (celsiusFahrenheit.innerHTML === "<sup>°</sup>F") {
        celsiusFahrenheit.innerHTML = "<sup>°</sup>C";
        for (const item of celsius) {
          let temp = item.textContent.split(" ")[0];
          let fTemp = (9 / 5) * temp + 32;
          item.innerHTML = `${fTemp.toFixed(0)} <sup>°</sup>`;
        }
      } else if (celsiusFahrenheit.innerHTML === "<sup>°</sup>C") {
        celsiusFahrenheit.innerHTML = "<sup>°</sup>F";
        for (const item of celsius) {
          let temp = item.textContent.split(" ")[0];
          let cTemp = (5 / 9) * (temp - 32);
          item.innerHTML = `${cTemp.toFixed(0)} <sup>°</sup>`;
        }
      }
    }else{
      console.log("there was some error fetching data");
    }
  }
  celsiusFahrenheit.addEventListener("click", handleChange);
});
