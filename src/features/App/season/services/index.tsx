import AxiosClient from '@/apis/AxiosClient';
import { RECORD_SIZE } from '@/config/theme';
import { handleObjectEmpty } from '@/utils';

export interface IQuery {
    page?: number;
    seasonId?: number;
}
export interface DataType {
    name: string;
    usableArea: number;
    gardenId: any;
    flowerId: any;
    areaIds: number[];
    plantbedIds: number[];
    actualStart: any;
    expectedHarvestStartDates: any;
    expectedQuantity: number;
    unitIds: any[];
    numberOfSeedlings: number;
    seasonId?: any;
    plantingDistance: string;
    numberOfHarvests?: number;
    cuttingLength?: any;
}

export interface Expense {
    expenseId?: number;
    type: string;
    costs: number;
    content?: string;
    createdAt?: any;
}

export interface Harvest {
    harvestId?: number;
    turnId?: number;
    harvestDate: string;
    quantity: number;
    unitId: string;
    price: number;
}

export interface SeasonData {
    seasonId?: number;
    harvestId?: number;
    landRents: Expense[];
    laborCosts: Expense[];
    pakagingCosts: Expense[];
    cultivarsCosts: Expense[];
    pesticidesCosts: Expense[];
    fertilizersCosts: Expense[];
    anotherCosts: Expense[];
    // [key: string]: Expense[] | number | undefined;
}
export interface DataUploadDiary {
    diaryId?: number;
    seasonId: number;
    content: string;
    images: string;
    video: string;
    areaIds: string[];
    plantbedIds: string[];
    taskId: any;
}
export const seasonsService = {
    get: (params: IQuery) => {
        const url = `/seasons`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, {
            params: { ...handleParams, limit: RECORD_SIZE, sortBy: 'created_at', sortOrder: 'desc' },
        });
    },
    create: (data: DataType) => {
        const url = `/seasons`;
        return AxiosClient.post(url, data);
    },
    update: (data: DataType) => {
        const url = `/seasons/informations`;
        return AxiosClient.put(url, data);
    },
    updateProposes: (id: number) => {
        const url = `/harvests/propose/processed/${id}`;
        return AxiosClient.put(url);
    },
    detail: (id: number, params?: any) => {
        const url = `/seasons/${id}`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams } });
    },
    detailPlantbeds: (id: number, include: string, params: IQuery) => {
        const url = `/seasons/more-infor/${id}/${include}`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams, limit: RECORD_SIZE } });
    },
    delete: (data: any) => {
        const url = `/seasons/soft-delete`;
        return AxiosClient.delete(url, { data });
    },
    deleteHarvestStartDate: (data: any) => {
        const url = `/seasons/expected_harvest_start_date`;
        return AxiosClient.delete(url, { data });
    },
    unlock: (id: number) => {
        const url = `/seasons/activate`;
        return AxiosClient.patch(url, { gardenId: id });
    },
    lock: (id: number) => {
        const url = `/seasons/deactivate`;
        return AxiosClient.patch(url, { gardenId: id });
    },

    //chi phí
    getExpenses: (params?: IQuery) => {
        const url = `/expenses`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams, limit: RECORD_SIZE } });
    },
    getExpensesAll: (id: number, params?: IQuery) => {
        const url = `/expenses/season/${id}`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams, limit: RECORD_SIZE } });
    },
    updateExpenses: (data: SeasonData) => {
        const url = `/expenses`;
        return AxiosClient.put(url, data);
    },
    deleteExpenses: (id: number) => {
        const url = `/expenses/${id}`;
        return AxiosClient.delete(url);
    },
    //thu hoạch
    getHarvest: (id: number, params?: IQuery) => {
        const url = `/harvests/${id}`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams, limit: RECORD_SIZE } });
    },
    updateHarvest: (data: any) => {
        const url = `/harvests`;
        return AxiosClient.put(url, data);
    },
    deleteHarvest: (id: number) => {
        const url = `/harvests/${id}`;
        return AxiosClient.delete(url);
    },
    //hoàn thành vụ mùa theo đợt
    setComplete: (data: any) => {
        const url = `/seasons/set-complete`;
        return AxiosClient.patch(url, data);
    },

    //hoàn thành vụ mùa
    harvestComplete: (data: any) => {
        const url = `/harvests`;
        return AxiosClient.post(url, data);
    },

    //Dừng canh tác
    harvestInActive: (data: any) => {
        const url = `/seasons/set-inactive`;
        return AxiosClient.patch(url, data);
    },
    //Dừng trồng
    plantbedInActive: (data: any) => {
        const url = `/seasons/plantbed/in_active`;
        return AxiosClient.patch(url, data);
    },
    //nhật lý vụ mùa
    getDiaryHarvest: (params: IQuery, id: number) => {
        const url = `/diaries`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, {
            params: { ...handleParams, seasonId: id, limit: RECORD_SIZE, sortBy: 'created_at', sortOrder: 'desc' },
        });
    },

    createDiaryHarvest: (data: DataUploadDiary) => {
        const url = `/diaries`;
        return AxiosClient.post(url, data);
    },
    updateDiaryHarvest: (data: DataUploadDiary) => {
        const url = `/diaries`;
        return AxiosClient.put(url, data);
    },
    deleteDiary: (data: any) => {
        const url = `/diaries/soft-delete`;
        return AxiosClient.delete(url, { data });
    },
    //lịch sử chỉnh sửa luống
    getHistory: (id: number) => {
        const url = `/seasons/plantbed-histories/${id}`;
        return AxiosClient.get(url);
    },
};
