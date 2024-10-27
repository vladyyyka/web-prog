// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/weather', async (req, res) => {
  const { city, unit } = req.body;
  const apiKey = process.env.API_KEY;

  try {

    console.log("Запрашиваем единицы:", unit);

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&lang=ru&appid=${apiKey}`
    );

    // Проверка ответа от API
    console.log("Ответ от API:", response.data);

    const weatherData = {
      city: response.data.name,
      temperature: response.data.main.temp,  
      sunrise: response.data.sys.sunrise,     
      sunset: response.data.sys.sunset,      
      humidity: response.data.main.humidity, 
      wind: response.data.wind.speed,         
      overcast: response.data.weather[0].description, 
      timestamp: Date.now(),
    };

    res.json(weatherData);
  } catch (error) {
    console.error("Ошибка получения данных от API:", error);
    res.status(500).json({ message: 'Ошибка получения данных о погоде' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
