import AuthReducer from './Auth/AuthSlice';
// import ConfigReducer from 'common/ConfigSlice'
// import StatusReducer from './admin/product_clone/StatusSlice'
// import GetDataSlice from './admin/config-clone/GetDataSlice'
// import MessageNotReadReducer from 'features/App/chat/slices/MessageNotReadSlice'
import MessageNotReadReducer from '../features/App/chat/slices/MessageNotReadSlice';
import notificationReducer from '@/redux/slice/NotificationSlice';
import harvestDataReducer from '@/redux/slice/DataHarvestSlice';
import ExpenseDataReducer from '@/redux/slice/DataExpensiveSlice';
// import CustomerSlice from './admin/customer-clone/CustomerSlice'
// import RefundOrderSlice from './admin/refund-order/services/RefundOrderSlice'
// import OrderSlice from './admin/order-clone/OrderSlice'
// import ProducSlice from './admin/product_clone/Products/ProductSlice'

const rootReducer = {
    authReducer: AuthReducer,
    notificationReducer: notificationReducer,
    // configReducer: ConfigReducer,
    // statusReducer: StatusReducer,
    // getDataReducer: GetDataSlice,
    // customerReducer: CustomerSlice,
    // refundOrderReducer: RefundOrderSlice,
    // orderReducer: OrderSlice,
    // productReducer: ProducSlice,
    messageNotReadReducer: MessageNotReadReducer,
    harvestDataReducer: harvestDataReducer,
    ExpenseDataReducer: ExpenseDataReducer,
};

export default rootReducer;
