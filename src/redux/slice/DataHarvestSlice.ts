import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const initialState = {
    items: [], // Mảng cần lưu trữ thông tin
};

const arraySlice = createSlice({
    name: 'arrayHarvest',
    initialState,
    reducers: {
        addArray: (state: any, action) => {
            const { newData, targetId } = action.payload;
            if (state.items?.length === 0) {
                state.items = newData;
            } else {
                const updateItem = newData?.find((item: any) => item?.id === targetId);
                updateItem?.turns?.forEach((turn: any) => {
                    for (const key in turn) {
                        if (moment.isMoment(turn[key])) {
                            turn[key] = turn[key].toISOString();
                        }
                    }
                });

                state.items = state.items?.map((defaultItem: any, index: number) => {
                    if (defaultItem.id === targetId) return updateItem;
                    return defaultItem;
                });
            }
        },
        addItem: (state: any, action: any) => {
            state.items.push(action.payload); // Thêm một phần tử mới vào mảng
        },
        removeItem: (state: any, action: any) => {
            state.items = state.items.filter((item: any) => item.id !== action.payload.id); // Xóa một phần tử khỏi mảng dựa trên ID hoặc một điều kiện khác
        },
        updateItem: (state: any, action: any) => {
            const index = state.items.findIndex((item: any) => item.id === action.payload.id); // Tìm chỉ mục của phần tử cần cập nhật trong mảng
            if (index !== -1) {
                state.items[index] = action.payload.updatedItem; // Cập nhật thông tin của phần tử tại chỉ mục tìm được
            }
        },
        clearItems: (state) => {
            state.items = []; // Xóa tất cả các phần tử trong mảng
        },
    },
});

const { reducer: harvestDataReducer, actions } = arraySlice;
export const { addItem, removeItem, updateItem, clearItems, addArray } = actions;

export default harvestDataReducer;
