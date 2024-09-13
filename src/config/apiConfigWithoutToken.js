import axios from "axios";
import axiosInterceptor from "./axiosInterceptorw";
import { environment } from "./environment";

// const wampServer = environment.URL + '/api/';
const wampServer = 'http://cogitate-001-site18.gtempurl.com/api/';

const axiosApiWithout = axios.create({
  baseURL: wampServer,
});
axiosInterceptor.setupInterceptorsw(axiosApiWithout, false, false);
export default axiosApiWithout;
