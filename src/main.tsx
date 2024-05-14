import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './features/Error/ErrorBoundary';
import { BrowserRouter } from 'react-router-dom';
import { ContextProvider } from './context/store';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
// import * as moment from 'moment-timezone';
// import css
import store from './store'
import 'antd/dist/antd.min.css';
import './overiseStyle/style.min.css';
import { Provider } from 'react-redux';
// moment.tz.setDefault('Etc/UTC');

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false, // disable retry,
            refetchOnWindowFocus: false, // disable refetch on window focus,
            keepPreviousData: true, // keep previous data if query
            staleTime: 10000, // time cache data fetching,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
     <Provider store={store}>
        <ContextProvider>
            <ErrorBoundary>
                <QueryClientProvider client={queryClient}>
                    <App />
                    <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
                </QueryClientProvider>
            </ErrorBoundary>
        </ContextProvider>
        </Provider>
    </BrowserRouter>
);
