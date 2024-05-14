import AxiosClient from '@/apis/AxiosClient';
import { RECORD_SIZE } from '@/config/theme';
import { handleObjectEmpty } from '@/utils';

export interface IQuery {
    page: number;
}

export interface plant {
    plantbedId?: any;
    sid: string;
    name: string;
    id?: any;
    index: number;
}

export interface areas {
    id?: any;
    areaId?: any;
    sid: string;
    name: string;
    acreage: number;
    plantbeds: plant[];
    index: number;
}
export interface DataType {
    address?: string;
    name?: string;
    sid?: string;
    workId?: number;
    content?: string;
    gardenId?: number;
    flowerId?: number;
    areaIds?: any;
    plantbedIds?: any;
    seasonId?: number;
    documentId?: number;
    expectedStartTime?: any;
    expectedEndTime?: any;
    userIds?: any;
    repeatType?: any;
    daysOfWeek?: any;
    exactDates?: any;
    lastDate?: any;
    taskId?: number;

    reasonForCancellation?: any;
}

export const workService = {
    get: (params: IQuery) => {
        const url = `/tasks`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, {
            params: { ...handleParams, limit: RECORD_SIZE, sortBy: 'created_at', sortOrder: 'desc' },
        });
    },
    create: (data: DataType) => {
        const url = `/tasks/web/create-one`;
        return AxiosClient.post(url, data);
    },
    update: (data: DataType) => {
        const url = `/tasks/web/update-one`;
        return AxiosClient.put(url, data);
    },
    detail: (id: number, params?: any) => {
        const url = `/gardens/${id}`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams } });
    },
    detailPlantbeds: (id: number, params: IQuery) => {
        const url = `/gardens/plantbeds/${id}`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams, limit: RECORD_SIZE } });
    },
    detailWork: (id: number, params: IQuery) => {
        const url = `/tasks/${id}`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams, limit: RECORD_SIZE } });
    },
    detailUser: (id: number, params: IQuery) => {
        const url = `/tasks/${id}/assignees`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams, limit: RECORD_SIZE } });
    },
    close: (data: any) => {
        const url = `/tasks/close`;
        return AxiosClient.patch(url, data);
    },
    cancel: (data: any) => {
        const url = `/tasks/cancel`;
        return AxiosClient.patch(url, data);
    },

    lock: (id: number) => {
        const url = `/gardens/deactivate`;
        return AxiosClient.patch(url, { gardenId: id });
    },

    //note
    note: (data: { gardenId: number; content: string }) => {
        const url = `/gardens/note`;
        return AxiosClient.patch(url, data);
    },
};
