import { Notification, wait } from '@/utils';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';
import LocalStorage from './LocalStorage';
const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = import.meta.env.REACT_APP_API_HOST;
const AxiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'x-platform': 'web',
        'content-type': 'application/json',
    },
});

// handle request to convert all api requests to snake_case
AxiosClient.interceptors.request.use(async (config: any) => {
    const token = LocalStorage.getToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        // config.headers.token = `${token}`;
    }

    if (config.headers && config.headers['Content-Type'] === 'multipart/form-data') return config;

    // convert request to snake_case
    if (config.params) {
        config.params = decamelizeKeys(config.params);
    }
    if (config.data) {
        config.data = decamelizeKeys(config.data);
    }

    return config;
});
let errorNotified = false;
// handle response to convert all api responses to camelCase
AxiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response && response.data) {
            if (
                !response.data.status ||
                response.data.code === 400 ||
                response.data.code === 403 ||
                response.data.code === 404 ||
                response.data.code === 500
            ) {
                switch (response.data.code) {
                    case 400:
                        if (response.data.details && response.data.details?.length > 0) {
                            const errMsg = response.data.details.map((error: { msg: string }, index: number) => (
                                <div key={index}>{error?.msg}</div>
                            ));
                            LocalStorage.removeToken();
                            window.location.reload();
                            Notification('error', errMsg);
                        } else {
                            Notification('error', response?.data?.msg);
                        }
                        break;
                    // case 500:
                    //     Notification('error', response?.data?.msg);
                    //     LocalStorage.removeToken();
                    //     window.location.reload();
                    //     break;
                    case 512:
                        // handle error
                        Notification('error', response?.data?.msg);
                        LocalStorage.removeToken();
                        window.location.reload();
                        break;
                    case 401:
                        // handle error
                        Notification('error', response?.data?.msg + '.Vui lòng dăng nhập lại');
                        LocalStorage.removeToken();
                        window.location.reload();
                        break;
                    default:
                        Notification('error', response?.data?.msg);
                        break;
                }
            }

            if (response.data.message === 'jwt malformed') {
                LocalStorage.removeToken();
                window.location.reload();
            }
            // cover response to camelCase
            return camelizeKeys(response.data);
        }
        return response;
    },
    (error) => {
        if (error?.response?.status === 409 && !errorNotified) {
            errorNotified = true;
            Notification('error', 'Tài khoản đã được đăng nhập ở nơi khác. Vui lòng đăng nhập lại!');
            wait(500).then(() => {
                LocalStorage.removeToken();
                window.location.reload();
            });
        }
        if (error?.response?.status != 200 && error?.response?.status != 409) {
            error?.response?.data?.msg && Notification('error', error?.response?.data?.msg);
        }
        // Handle errors
        return error;
    }
);

export default AxiosClient;
