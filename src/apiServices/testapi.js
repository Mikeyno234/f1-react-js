import axios from "axios";
import { BASE_URL } from "./config";

const driversService = {
  getDriverStandings() {
    return axios
      .get(`${BASE_URL}/current/driverStandings.json`)
      .then((res) => res.data);
  },

  getbyId(id) {
    return axios
      .get(`${BASE_URL}/current/drivers/${id}.json`)
      .then((res) => res.data);
  },
};

export default driversService;
