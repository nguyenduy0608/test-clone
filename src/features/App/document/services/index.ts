import AxiosClient from '@/apis/AxiosClient';
import { RECORD_SIZE } from '@/config/theme';
import { handleObjectEmpty } from '@/utils';

export interface IQuery {
    page: number;
}
export interface DataType {
    title: string;
    content: string;
    assignedToAllGardens: boolean;
    thumbnail: string;
    video: string;
    status: string;
    flowerId: any;
    gardenIds?: string[];
    documentId?: number;
}





export const documentService = {
    get: (params: IQuery) => {
        const url = `/documents`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams, limit: RECORD_SIZE, sortBy: 'created_at', sortOrder: 'desc' } });
    },
    create: (data: DataType) => {
        const url = `/documents`;
        return AxiosClient.post(url, data);
    },
    update: (data: DataType) => {
        const url = `/documents/update-document`;
        return AxiosClient.put(url, data);
    },
    detail: (id: number) => {
        const url = `/documents/${id}`;
        return AxiosClient.get(url);
    },
    delete: (data: any) => {
        const url = `/documents/soft-delete`;
        return AxiosClient.delete(url, { data });
    },
};
