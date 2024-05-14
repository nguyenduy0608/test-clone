import { RECORD_SIZE } from '@/config/theme';
import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';

export const columns = (page: number): ColumnsType<any> => [
    {
        title: 'STT',
        dataIndex: 'id',
        align: 'center',
        width: 60,
        render: (row, record, index) => (page === 1 ? ++index : (page - 1) * RECORD_SIZE + ++index),
    },
    {
        title: <Tooltip title="Tên khách hàng">Tên khách hàng</Tooltip>,
        dataIndex: 'code',
        align: 'center',
    },
    {
        title: <Tooltip title="Số điện thoại">Số điện thoại</Tooltip>,
        dataIndex: 'user',
        align: 'center',
    },
    {
        title: <Tooltip title="Loại tài khoản">Loại tài khoản</Tooltip>,
        dataIndex: 'user',
        align: 'center',
    },
    {
        title: <Tooltip title="Doanh số">Doanh số</Tooltip>,
        dataIndex: 'user',
        align: 'center',
    },
    {
        title: <Tooltip title="Lợi nhuận">Lợi nhuận</Tooltip>,
        dataIndex: 'user',
        align: 'center',
    },
    {
        title: <Tooltip title="Số lượng đơn hàng">Số lượng đơn hàng</Tooltip>,
        dataIndex: 'user',
        align: 'center',
    },
    {
        title: (
            <Tooltip title="Tổng tiền thưởng trực tiếp trên đơn hàng">Tổng tiền thưởng trực tiếp trên đơn hàng</Tooltip>
        ),
        dataIndex: 'user',
        align: 'center',
    },
    {
        title: <Tooltip title="Số lượng thưởng">Số lượng thưởng</Tooltip>,
        dataIndex: 'user',
        align: 'center',
    },
];
