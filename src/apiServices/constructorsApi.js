import axios from "axios";
import { BASE_URL } from "./config";

const teamsApi = `${BASE_URL}/current/constructorStandings.json`;
const driversApi = `${BASE_URL}/current/driverStandings.json`;
const teamsA = `${BASE_URL}/current/constructors`;

const getDriversByConstructor = async (constructorId) => {
  try {
    const response = await axios.get(driversApi);
    const drivers =
      response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    return drivers.filter((driver) =>
      driver.Constructors.some(
        (constructor) => constructor.constructorId === constructorId
      )
    );
  } catch (error) {
    console.error("Error fetching drivers by constructor:", error);
    throw error;
  }
};

const teamsService = {
  getAll() {
    return axios.get(teamsApi).then((res) => res.data);
  },

  getbyId(id) {
    return axios.get(`${teamsA}/${id}.json`).then((res) => res.data);
  },

  getDriversByConstructor,
};

export default teamsService;
