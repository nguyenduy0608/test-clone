import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { requestCountMessageNotRead } from '../service/ChatService'

const initialState: any = {
    isLoading: true,
    dialogLoading: false,
    listTopicMessageNotRead: [],
    chatingUserInfo: {},
    listNotReadMsgIds: [],
}

export const getMessageNotReadAction = createAsyncThunk('message/not-read', async (payload, thunkApi) => {
    const res = await requestCountMessageNotRead()
    return res.data
})

export const messageNotReadSlice = createSlice({
    name: 'message_not_read',
    initialState,
    reducers: {
        readATopicMessage: (state, action) => {
            const newListTopicMessageNotRead = state.listTopicMessageNotRead.filter(
                (item: any) => item.topic_message_id !== Number(action.payload.topic_message_id)
            )
            state.listTopicMessageNotRead = newListTopicMessageNotRead
        },
        setChattingUser: (state, action) => {
            state.chatingUserInfo = action.payload
        },
        setNotReadMesssageListIds: (state, action) => {
            state.listNotReadMsgIds = action.payload
        },
    },
    extraReducers: builder => {
        builder.addCase(getMessageNotReadAction.pending, (state, action) => {
            state.isLoading = true
            return state
        })
        builder.addCase(getMessageNotReadAction.fulfilled, (state, action) => {
            state.listTopicMessageNotRead = action.payload
            state.isLoading = false
            return state
        })
        builder.addCase(getMessageNotReadAction.rejected, (state, action) => {
            state.isLoading = false
            state.listTopicMessageNotRead = []
            return state
        })
    },
})

export const { readATopicMessage, setChattingUser, setNotReadMesssageListIds } = messageNotReadSlice.actions
export default messageNotReadSlice.reducer
