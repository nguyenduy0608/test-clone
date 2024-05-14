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

export const reportcostServices = {
    get: (params: IQuery) => {
        const url = `/reports/seasons-expenses`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, {
            params: { ...handleParams, limit: RECORD_SIZE, sortBy: 'created_at', sortOrder: 'desc' },
        });
    },
    getCost: (params: IQuery) => {
        const url = `/reports/seasons-statistics`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, {
            params: { ...handleParams, limit: RECORD_SIZE, sortBy: 'created_at', sortOrder: 'desc' },
        });
    },
    getCostLine: (params: IQuery) => {
        const url = `/reports/seasons-statistics-line`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, {
            params: { ...handleParams },
        });
    },

    getExportCost: (params: IQuery) => {
        const url = `/reports/seasons-expenses/export`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, {
            params: { ...handleParams, limit: RECORD_SIZE },
        });
    },
};

export const reportSeasson = {
    get: (params: IQuery) => {
        const url = `/reports/seasons`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, {
            params: { ...handleParams, limit: RECORD_SIZE },
        });
    },
    getExport: (params: IQuery) => {
        const url = `/reports/seasons/export`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, {
            params: { ...handleParams, limit: RECORD_SIZE },
        });
    },

    detailPlantbeds: (id: number, params?: any) => {
        const url = `/reports/seasons-areas/${id}`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams, sortBy: 'created_at', sortOrder: 'desc' } });
    },
};
export const reportHarvesCycles = {
    get: (params: IQuery) => {
        const url = `/reports/harvest-cycles`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, {
            // params: { ...handleParams, limit: RECORD_SIZE, sortBy: 'created_at', sortOrder: 'desc' },
            params: { ...handleParams, limit: RECORD_SIZE },
        });
    },
    detailPlantbeds: (id: number, params?: any) => {
        const url = `/reports/seasons-areas/${id}`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams, sortBy: 'created_at', sortOrder: 'desc' } });
    },
    getExportHarvestCycles: (params: IQuery) => {
        const url = `/reports/harvest-cycles/export`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, {
            params: { ...handleParams, limit: RECORD_SIZE },
        });
    },
};
export const ReportUseLand = {
    get: (params: IQuery) => {
        const url = `/reports/land-general`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, {
            // params: { ...handleParams, limit: RECORD_SIZE, sortBy: 'created_at', sortOrder: 'desc' },
            params: { ...handleParams, limit: RECORD_SIZE },
        });
    },
    getChart: (params: IQuery) => {
        const url = `/reports/land-charts`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, {
            params: { ...handleParams, limit: RECORD_SIZE },
        });
    },
};
