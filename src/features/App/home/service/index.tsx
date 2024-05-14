import AxiosClient from '@/apis/AxiosClient';
import { RECORD_SIZE } from '@/config/theme';
import { handleObjectEmpty } from '@/utils';
interface IQuery {
    page: number;
}
export const homeService = {
    get: (params: IQuery) => {
        const url = `/tasks`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, {
            params: { ...handleParams, limit: RECORD_SIZE, sortBy: 'created_at', sortOrder: 'desc' },
        });
    },

    getDetail: (id: any) => {},
};
