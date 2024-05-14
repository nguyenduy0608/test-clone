import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './features/rootReducer'

export default configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
})
