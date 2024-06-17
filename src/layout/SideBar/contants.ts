import { ROLE } from '@/contants';
import { itemAccountants, itemPolicy, itemStorage, itemsAdmin, itemsCus, itemsNews } from './Sidebar.Menu';

export const switchSidebar = (group: string) => {
    switch (group) {
        case ROLE.ROOT_ADMIN:
            return itemsAdmin;
        case ROLE.CUS:
            return itemsCus;
        // case ROLE.ADMIN:
        //     return itemsNews;
        // case ROLE.ACCOUNTANT:
        //     return itemAccountants;
        // case ROLE.STORAGE_MANAGER:
        //     return itemStorage;
        // case ROLE.PRICE_POLICY_MANAGER:
        //     return itemPolicy;
        default:
            return [];
    }
};
