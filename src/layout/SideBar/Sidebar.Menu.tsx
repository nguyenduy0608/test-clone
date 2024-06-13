import IconAntd from '@/components/IconAntd';
import { BsCashCoin, BsFlower3 } from 'react-icons/bs';

export const itemsAdmin: any = [
    // {
    //     label: 'Trang chủ',
    //     key: '',
    //     icon: <IconAntd icon="HomeOutlined" />,
    // },
    {
        label: 'Báo cáo',
        // key: '/',
        icon: <IconAntd icon="AreaChartOutlined" />,
        children: [
            {
                label: 'Báo cáo doanh thu',
                key: 'reportuseland',
            },
            {
                label: 'Báo cáo khách hàng',
                key: 'reportcost',
            },
        ],
    },

    {
        label: 'Khách hàng',
        key: 'customer',
        icon: <IconAntd icon="UsergroupDeleteOutlined" />,
    },
    {
        label: 'Tác giả',
        key: 'author',
        icon: <IconAntd icon="UsergroupDeleteOutlined" />,
    },
    {
        label: 'Sản phẩm',
        key: 'product',
        icon: <IconAntd icon="ReadOutlined" />,
    },
    {
        label: 'Tài khoản',
        key: 'account',
        icon: <IconAntd icon="UserOutlined" />,
    },
];

export const itemAccountants = [];

export const itemsNews = [];

export const itemStorage = [];
export const itemPolicy = [];
