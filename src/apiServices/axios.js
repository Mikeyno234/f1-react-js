import Axios from "axios";
import { BASE_URL } from "./config";

export const ergastAxios = Axios.create({
  baseURL: BASE_URL,
});
