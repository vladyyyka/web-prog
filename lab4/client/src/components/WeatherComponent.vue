<template>
  <div class="weather-app container mt-5">
    <h1 class="text-center mb-4">Погода в городе</h1>

    <div class="favorites-section mb-4">
      <h3>Избранные города</h3>
      <ul class="list-group">
        <li
          v-for="(favorite, index) in favorites"
          :key="index"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <button @click="fetchFavoriteWeather(favorite)" class="btn btn-link">
            <i class="fas fa-city"></i> {{ favorite }}
          </button>
          <button @click="removeFromFavorites(index)" class="btn btn-danger btn-sm remove-btn">
            <i class="fas fa-trash-alt"></i>
          </button>
        </li>
      </ul>
    </div>

    <div v-if="weather" class="weather-info card text-center p-4 mb-4 animated fadeIn">
      <h2 class="city-name">{{ weather.city }}</h2>
      <i
        class="fas fa-star position-absolute star-icon"
        :class="{ 'star-filled': isFavorite(weather.city) }"
        @click="toggleFavorite(weather.city)"
        style="cursor: pointer;"
      ></i>
      <div class="weather-content d-flex justify-content-center align-items-center">
        <div class="left-info">
          <p class="temperature">
            Температура: <span class="font-weight-bold">{{ weather.temperature }} °{{ unit === 'metric' ? 'C' : 'F' }}</span>
          </p>
          <p class="description">Описание: {{ weather.overcast }}</p>
          <p class="humidity">Влажность: {{ weather.humidity }}%</p>
          <p class="wind">Скорость ветра: {{ weather.wind }} м/с</p>
        </div>

        <div class="icon-container mx-3">
          <img :src="weatherIcon" alt="Weather icon" class="weather-icon" />
        </div>

        <div class="right-info">
          <p class="sunrise">Время восхода: {{ new Date(weather.sunrise * 1000).toLocaleTimeString() }}</p>
          <p class="sunset">Время заката: {{ new Date(weather.sunset * 1000).toLocaleTimeString() }}</p>
          <p class="timestamp">Время получения: {{ new Date(weather.timestamp).toLocaleString() }}</p>
        </div>
      </div>
    </div>

    <div class="search-container text-center mb-4">
      <form @submit.prevent="fetchWeather" class="d-flex justify-content-center align-items-center">
        <input
          type="text"
          v-model="city"
          placeholder="Введите город"
          required
          class="form-control city-input"
        />
        <div class="unit-toggle d-flex align-items-center mx-2">
          <button type="button" 
                  :class="['btn', { active: unit === 'metric' }]" 
                  @click="unit = 'metric'">°C</button>
          <button type="button" 
                  :class="['btn', { active: unit === 'imperial' }]" 
                  @click="unit = 'imperial'">°F</button>
        </div>
        <button type="submit" class="btn btn-primary search-button">
          <i class="fas fa-search"></i>
        </button>
        <button type="button" class="btn btn-secondary ml-2" @click="refreshWeather">
          <i class="fas fa-sync"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import axios from 'axios';
import sunny from '../assets/weather-icons/sunny.png';
import cloudy from '../assets/weather-icons/cloudy.png';
import rainy from '../assets/weather-icons/rainy.png';
import snow from '../assets/weather-icons/snow.png';
import fog from '../assets/weather-icons/fog.png';
import unknown from '../assets/weather-icons/unknown.png';

export default {
  name: "WeatherComponent",
  data() {
    return {
      city: '',
      weather: null,
      unit: 'metric',
      weatherIcons: {
        'ясно': sunny,
        'облачно': cloudy,
        'пасмурно': cloudy,
        'дождь': rainy,
        'ливень': rainy,
        'снег': snow,
        'туман': fog,
      },
      favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    };
  },
  computed: {
    weatherIcon() {
      return this.weather ? this.weatherIcons[this.weather.overcast] || unknown : null;
    }
  },
  methods: {
    async fetchWeather() {
      try {
        const response = await axios.post('http://localhost:5000/weather', {
          city: this.city,
          unit: this.unit,
        });
        this.weather = response.data;
      } catch (error) {
        console.error('Ошибка получения погоды:', error);
      }
    },
    async fetchFavoriteWeather(favorite) {
      this.city = favorite;
      await this.fetchWeather();
    },
    refreshWeather() {
      this.fetchWeather();
    },
    toggleFavorite(city) {
      const index = this.favorites.indexOf(city);
      if (index === -1) {
        this.favorites.push(city);
      } else {
        this.favorites.splice(index, 1);
      }
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
    isFavorite(city) {
      return this.favorites.includes(city);
    },
    removeFromFavorites(index) {
      this.favorites.splice(index, 1);
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
  },
};
</script>

<style>
body {
  background: #e8f5e9;
}

.weather-app {
  background-color: rgba(255, 255, 255, 0.9); 
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.favorites-section h3 {
  margin-bottom: 15px;
  color: #007bff;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.list-group-item:hover {
  background-color: #e1f5fe;
}

.weather-info {
  position: relative;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.city-name {
  font-size: 2rem; 
  margin: 0;
  color: #333;
}

.star-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
}

.star-filled {
  color: gold;
}

.unit-toggle {
  margin-left: 10px;
}

.weather-icon {
  width: 120px; 
  height: auto;
}

.weather-content {
  justify-content: center;
}

.search-container {
  margin-top: 20px;
}

.search-container .form-control {
  width: 250px; 
  border-radius: 20px;
  border: 1px solid #007bff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-container .btn {
  border-radius: 20px;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #0056b3; 
}

.btn-secondary {
  background-color: #6c757d;
  transition: background-color 0.3s;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.active {
  background-color: #007bff !important;
  color: white !important;
}

.remove-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: red;
}
</style>
