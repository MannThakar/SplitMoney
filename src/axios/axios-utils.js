import axios from 'axios';
import {toast} from 'react-toastify';

const token = localStorage.getItem("Token");

const config = {
    baseURL: import.meta.env.VITE_API,
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
    },
};
const axiosClient = axios.create(config);

const setToken = (token) => {
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

if (localStorage.getItem("Token")) {
    setToken(localStorage.getItem("Token"));
}

axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

axiosClient.interceptors.request.use(
    function (request) {
        request.headers["Content-Type"] = "multipart/form-data";
        return request;
    },
    null,
    {synchronous:true}
)
axiosClient.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response.status === 401) {
            localStorage.clear();
            window.location.replace("/signin");
        } else if (error.response.status === 500) {
            toast.error(error.response.data.message);   
        } else {
            toast.error(error);
        }  
        return Promise.reject(error);
    }
)
export default axiosClient;
