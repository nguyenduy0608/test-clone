import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], // Mảng cần lưu trữ thông tin
};

const arraySlice = createSlice({
    name: 'arrayExpense',
    initialState,
    reducers: {
        addArray: (state: any, action) => {
            const { newData, targetId } = action.payload;
            if (state.items?.length === 0) {
                state.items = newData;
            } else {
                const updateItem = newData?.find((item: any, index: number) => {
                    return item?.expenses?.[0]?.harvestId === targetId;
                });
                state.items = state.items?.map((defaultItem: any, index: number) => {
                    if (defaultItem?.expenses?.[0]?.harvestId === targetId) return updateItem;
                    return defaultItem;
                });
            }
        },
    },
});

const { reducer: ExpenseDataReducer, actions } = arraySlice;
export const { addArray } = actions;

export default ExpenseDataReducer;
