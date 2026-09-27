const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const locateBtn = document.getElementById('locate-btn');
const content = document.getElementById('content');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) loadWeather({ city });
});

locateBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser.');
    return;
  }
  content.innerHTML = '<p class="hint">Getting your location...</p>';
  navigator.geolocation.getCurrentPosition(
    (pos) => loadWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
    () => showError('Could not get your location. Please allow location access or search a city instead.')
  );
});

function showError(message) {
  content.innerHTML = `<div class="error-box">${message}</div>`;
}

function buildQuery(params) {
  const qs = new URLSearchParams(params).toString();
  return `?${qs}`;
}

async function loadWeather(params) {
  content.innerHTML = '<p class="hint">Loading weather...</p>';
  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`/api/weather/current${buildQuery(params)}`),
      fetch(`/api/weather/forecast${buildQuery(params)}`),
    ]);
    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    if (!currentRes.ok) {
      showError(current.error || 'City not found. Please check the spelling and try again.');
      return;
    }

    renderWeather(current, forecast.list || []);
  } catch (err) {
    showError('Something went wrong. Please try again.');
  }
}

function renderWeather(current, forecastList) {
  const iconUrl = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;

  // Pick roughly one forecast entry per day (closest to 12:00) for a simple 5-day view
  const dailyMap = {};
  forecastList.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    const hour = item.dt_txt.split(' ')[1];
    if (!dailyMap[date] || hour === '12:00:00') {
      dailyMap[date] = item;
    }
  });
  const dailyForecast = Object.values(dailyMap).slice(0, 5);

  const forecastHtml = dailyForecast.map((item) => {
    const date = new Date(item.dt * 1000);
    const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
    const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
    return `
      <div class="forecast-card">
        <div class="day">${dayName}</div>
        <img src="${icon}" alt="${item.weather[0].description}" width="40" />
        <div class="temp">${Math.round(item.main.temp)}°C</div>
        <div class="desc">${item.weather[0].description}</div>
      </div>`;
  }).join('');

  content.innerHTML = `
    <div class="current-card">
      <h2>${current.name}${current.sys?.country ? ', ' + current.sys.country : ''}</h2>
      <div class="country">${new Date().toLocaleString()}</div>
      <img src="${iconUrl}" alt="${current.weather[0].description}" width="90" />
      <div class="current-temp">${Math.round(current.main.temp)}°C</div>
      <div class="current-desc">${current.weather[0].description}</div>
      <div class="current-details">
        <div class="detail-item"><div class="label">Feels like</div><div class="value">${Math.round(current.main.feels_like)}°C</div></div>
        <div class="detail-item"><div class="label">Humidity</div><div class="value">${current.main.humidity}%</div></div>
        <div class="detail-item"><div class="label">Wind</div><div class="value">${current.wind.speed} m/s</div></div>
      </div>
    </div>
    ${dailyForecast.length ? `
      <div class="forecast-section">
        <h3>5-Day Forecast</h3>
        <div class="forecast-scroll">${forecastHtml}</div>
      </div>` : ''}
  `;
}
