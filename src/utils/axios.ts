import axios from "axios";
import config from "../config";

const apiFetch = axios;

apiFetch.defaults.baseURL = config.apiBaseUrl;
apiFetch.defaults.withCredentials = true;

export default apiFetch;
