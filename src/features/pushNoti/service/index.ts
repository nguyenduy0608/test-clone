import AxiosClient from '@/apis/AxiosClient';

export const pushNotiService = {
    get: (page = 1) => {
        return AxiosClient.get(`/notifications`, {
            params: {
                page: page,
                limit: 20,
                sortBy: 'created_at',
                sortOrder: 'desc',
            },
        });
    },
    read: (id: number) => {
        return AxiosClient.patch(`/notifications/checked/${id}`);
    },
    readAll: () => {
        return AxiosClient.patch('/notifications/set-read-all');
    },
};
