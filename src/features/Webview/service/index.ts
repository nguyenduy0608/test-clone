import AxiosClient from "@/apis/AxiosClient";

export interface IDataRetrieval {
    id: number;
    forgot_password_code: string;
    confirm_password: string;
    password: string
}


export const forgotPassword = {
    retrieval: (data: IDataRetrieval) => {
        return AxiosClient.post('/user-session/forgot/password/verify', data);
    },
}

export const removeAccount = {
    remove: (data: any) => {
        return AxiosClient.delete('/users/fake/remove-account', {data});
    },
}