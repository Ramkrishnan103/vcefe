import axios from "axios";
import axiosInterceptor from "./axiosInterceptor";
import { environment } from "./environment";

// const wampServer = environment.URL + '/api/';
const wampServer = "http://cogitate-001-site18.gtempurl.com/api/";
//const wampServer = "http://localhost/VstorePosApi/api/";
const axiosApi = axios.create({
  baseURL: wampServer,
});

axiosInterceptor.setupInterceptors(axiosApi, true, false);
export default axiosApi;
