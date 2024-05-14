import AxiosClient from '@/apis/AxiosClient';

interface IDataLogin {
    phone_number: string;
    password: string;
}

interface IChangePassword {
    current_password: string;
    new_password: string;
}

export const authService = {
    login: (data: IDataLogin) => {
        return AxiosClient.post('/auth/login', data);
    },
    info: () => {
        return AxiosClient.get('/users/me');
        // return AxiosClient.get('/admin/session/me')
        
    },
    changePassword: (data: IChangePassword) => {
        const url = `/auth/change_password`;
        return AxiosClient.post(url, data);
    },
};
