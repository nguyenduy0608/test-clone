import AxiosClient from '@/apis/AxiosClient';

export const getDataListMessage = (payload: any) => AxiosClient.get('/conversations', { params: payload });
export const getDataMember = (id: any) => AxiosClient.get(`/conversations/members/${id}`);
export const getDataListMessageUnread = (payload: any) => AxiosClient.get('/conversations/unread', { params: payload });
export const getDataListMessageGarden = (payload: any) => AxiosClient.get('/conversations/garden', payload);

export const getDataMessageDetail = (topic_message_id: any, payload?: any) =>
    AxiosClient.get(`/conversations/messages/${topic_message_id}`, {
        params: { sortBy: 'created_at', sortOrder: 'desc', page: payload },
    });

export const requestSendMessage = (payload: any) => AxiosClient.post(`/conversations`, payload);

export const getDetail = (topic_message_id: number) =>
    AxiosClient.get(`/conversations/${topic_message_id}`, {
        params: { sortBy: 'created_at', sortOrder: 'desc' },
    });
export const requestSendMessageToNewUser = (payload: any) => AxiosClient.post(`/message/new_topic`, payload);

export const requestReadAMessage = (topic_message_id: number, message_id: number) =>
    AxiosClient.put(`message/${topic_message_id}/read/${message_id}/message`);

export const requestCountMessageNotRead = () => AxiosClient.get(`/message/message_not_read`);
export const requestGetListMessage = (topic_message_id: string, payload: any) =>
    AxiosClient.get(`/message/${topic_message_id}`, payload);
