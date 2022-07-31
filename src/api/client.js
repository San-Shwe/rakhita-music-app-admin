import axios from "axios";

const client = axios.create({
  baseURL: "https://rakhita-music-app.herokuapp.com/api",
});

export default client;
