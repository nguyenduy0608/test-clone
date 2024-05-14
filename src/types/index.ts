export enum IStatus {
    activate = 1,
    unActive = 0,
}
export enum IRole {
    main = 1,
    stall = 2,
}
export enum IStatusVoucher {
    activate = 1,
    unActive = 0,
}

export interface IFilter {
    search?: any;
    areaId?: string;
    status?: IStatus | null;
    createFrom?: string | null;
    createTo?: string | null;
    accountId?: IRole | null;
    type?: string;
    startDate?: string;
    endDate?: string;
    storageCategoryId?: string;
    flowerId?: any;
    unitId?: any;
    seasonId?: any;
    harvestId?: any;
    gardenId?: number | string;
    season_status?: any;
    time_type?: string | number;
}
