import { WebSocket } from '@/apis/WebSocket';
import useCallContext from '@/hooks/useCallContext';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessageNotReadAction } from '../slices/MessageNotReadSlice';

export const useListMessageNotRead = () => {
    const dispatch = useDispatch();
    const { listTopicMessageNotRead } = useSelector((state: any) => state.messageNotReadReducer);

    const { userInfo: UserInstance } = useSelector((state: any) => state.authReducer);
    const { state } = useCallContext();

    const onUserHasNewMessage = () => {
        WebSocket.socketClient?.on(`new_message`, async (res: any) => {
            getCountMessageNotRead();
            console.log('🚀 ~ WebSocket.socketClient?.on ~ res:', res);
        });
    };
    // const onShopHasNewMessage = () => {
    //     WebSocket.socketClient?.on(`shop_id_${UserInstance.shop_id}`, async (res: any) => {
    //         getCountMessageNotRead();
    //     });
    // };

    const getCountMessageNotRead = () => {
        // dispatch(getMessageNotReadAction())
    };

    useEffect(() => {
        // getCountMessageNotRead();
        if (state?.info?.id) {
            onUserHasNewMessage();
        }
        // if (UserInstance?.shop_id) {
        //     onShopHasNewMessage();
        // }
    }, [state?.info]);
    return { listTopicMessageNotRead };
};
