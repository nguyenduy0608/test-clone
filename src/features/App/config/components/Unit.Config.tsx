import { RECORD_SIZE } from '@/config/theme';
import { ColumnsType } from 'antd/lib/table';

export const columns = (page: number): ColumnsType<any> => [
    {
        title: 'STT',
        dataIndex: 'id',
        align: 'center',
        width: 80,
        render: (row, record, index) => (page === 1 ? ++index : (page - 1) * RECORD_SIZE + ++index),
    },
    // {
    //     title: 'Mã đơn ',
    //     dataIndex: 'code',
    //     align: 'center',
    // },
    {
        title: 'Đơn vị',
        dataIndex: 'name',
        align: 'center',
    },
];
