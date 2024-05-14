import AxiosClient from '@/apis/AxiosClient';
import { ALL } from '@/config/theme';

export const appService = {
    // getKiotviet: async () => {
    //     return AxiosClient.get('/admin/kiotviet');
    // },
    getCountNoti: async () => {
        return AxiosClient.get('/notifications/count-noti');
    },
};

export const selectAll = {
    label: 'Tất cả',
    value: '',
};
