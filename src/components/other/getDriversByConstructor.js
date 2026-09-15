import axios from "axios";
import { BASE_URL } from "../../apiServices/config";

const driversA = `${BASE_URL}/current/driverStandings.json`;

const getDriversByConstructor = async (constructorId) => {
  try {
    const response = await axios.get(driversA);
    const drivers =
      response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    // Filtrar los pilotos por constructorId
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

export default getDriversByConstructor;
