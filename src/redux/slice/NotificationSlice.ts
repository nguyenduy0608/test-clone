import { appService } from '@/service';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getListPersonalSupplies = createAsyncThunk('GetListPersonalSupplies', async () => {
    // - Gọi api -> lấy dữ liệu trả về -> cập nhật state
    // const res = await appService.getCountNoti();
    // return res?.data;
});

const checklistSlice = createSlice({
    name: 'notiState',
    initialState: {
        noti_count: 0,
    },
    reducers: {
        setNotiCount: (state: any, action) => {
            state.noti_count = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getListPersonalSupplies.pending, (state, action) => {
            return;
        });
        builder.addCase(getListPersonalSupplies.fulfilled, (state, action) => {
            state.noti_count = action.payload;
            return;
        });
        builder.addCase(getListPersonalSupplies.rejected, (state) => {
            return;
        });
    },
});

const { reducer: notificationReducer, actions } = checklistSlice;
export const { setNotiCount } = actions;

export default notificationReducer;
