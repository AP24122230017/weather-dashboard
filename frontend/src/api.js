import axios from "axios";

export const api = axios.create({
  baseURL: "https://weather-dashboard-9iaw.onrender.com/api/weather",
});