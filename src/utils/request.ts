import axios, {AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig} from 'axios';
import { ElMessage } from 'element-plus';
import {getToken} from "./common";
import { useRouter } from 'vue-router';

const router = useRouter();
console.log('router',router)

const service:AxiosInstance = axios.create({
    baseURL: "http://api.evaluate.eyfs.club",
    timeout: 5000
});

service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        config.url = `${config.url}`;
        config.headers = {
            Authorization: getToken(),
        };
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        // if (response.status === 200) {
        //     return response;
        // } else {
        //     Promise.reject();
        // }
        
        const status_code = response.data.status_code || null
        if (status_code == 401) {
            ElMessage.error("登录失效！请重新登录！");
            localStorage.removeItem('ms_username');
            router.push('/login');
        } 
        // else if(status_code == 401){
        //     ElMessage.error(response.data.errors);
        // }
        else if(response.data.errors){
            ElMessage.error(response.data.message);
        }
        return Promise.resolve(response.data);
    },
    (error: AxiosError) => {
        console.log(error);
        // return Promise.reject();
        ElMessage.error("请求错误！");
        return Promise.reject(error);
    }
);

export default service;
