import axios from "axios";
import redisClient from "../config/redisClient.js";

// Kết nối Redis
(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    console.log("Redis Connected");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
})();

const fetchWeatherDataFromAPI = async (city) => {
  const apiKey = process.env.API_KEY;
  const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`;

  try {
    const response = await axios.get(apiUrl);
    // console.log(response.data.days[0]);
    return response.data.days[0];
  } catch (error) {
    console.error("Error fetching weather data from API:", error);
    throw new Error("Failed to fetch weather data from API");
  }
};

const getWeatherDataFromCache = async (city) => {
  try {
    const cachedData = await redisClient.get(city);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error("Error retrieving data from Redis cache:".error);
    throw new Error("Failed to retrieve data from Redis cache");
  }
};

const saveWeatherDataToCache = async (city, weatherData) => {
  try {
    // await redisClient.set(city, JSON.stringify(weatherData), "EX", 3600); // Khi sử dụng 'EX', bạn cung cấp thời gian tính bằng giây. Đây là thời gian hết hạn tính bằng giây (1 giờ = 3600 giây).
    await redisClient.setEx(city, 3600, JSON.stringify(weatherData));
  } catch (error) {
    console.error("Error saving data to Redis cache:", error);
    throw new Error("Failed to save data to Redis cache");
  }
};

const getWeather = async (city) => {
  try {
    console.log(`Fetching weather data for: ${city}`);
    const cachedData = await getWeatherDataFromCache(city);
    if (cachedData) {
      console.log(`Data for ${city} fetched from Redis cache.`);
      return { source: "cache", data: cachedData };
    }

    console.log(`Data for ${city} not in cache. Fetching from API...`);
    const weatherData = await fetchWeatherDataFromAPI(city);
    await saveWeatherDataToCache(city, weatherData);
    console.log(`Data for ${city} fetched from API and saved to Redis cache`);
    return { source: "api", data: weatherData };
  } catch (error) {
    console.error("Unable to get weather data:", error);
    throw new Error("Failed to get weather data");
  }
};

export default getWeather;
