import getWeather from "../service/weatherService.js";
import {
  sendWeatherResponse,
  sendErrorResponse,
} from "../views/responseView.js";

const getWeatherController = async (req, res) => {
  const city = req.params.city;

  if (!city) {
    return sendErrorResponse(res, "City is required");
  }

  try {
    const result = await getWeather(city);
    // console.log("Result from getWeather:", result);
    return sendWeatherResponse(res, result.data, result.source);
  } catch (error) {
    sendErrorResponse(res, error, error.message);
  }
};

export default getWeatherController;
