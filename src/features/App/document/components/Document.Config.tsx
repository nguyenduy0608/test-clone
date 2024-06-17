import { RECORD_SIZE } from '@/config/theme';
import { NEWS_STATUS } from '@/contants';
import { currencyFormat } from '@/utils';
import { FilePptOutlined, FileTextOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';

export const columns = (page: number): ColumnsType<any> => [
    {
        title: 'STT',
        dataIndex: 'id',
        align: 'center',
        width: '80px',
        render: (row, record, index) => (page === 1 ? ++index : (page - 1) * RECORD_SIZE + ++index),
    },

    {
        title: 'Tên giỏ hàng',
        dataIndex: 'id',
        align: 'center',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'isPaid',
        align: 'center',
    },
    {
        title: 'Giá gốc',
        dataIndex: 'originalTotalPrice',
        align: 'center',
        render: (value) => currencyFormat(value),
    },
    {
        title: 'Giá cần trả',
        dataIndex: 'totalPrice',
        align: 'center',
        render: (value) => currencyFormat(value),
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'paidDate',
        align: 'center',
        render: (value, record, index) => moment(value).format('DD/MM/YYYY'),
    },
];
