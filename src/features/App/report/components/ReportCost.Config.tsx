import { RECORD_SIZE } from '@/config/theme';
import { STATUS_WORK, TYPE_FLOWER } from '@/contants';
import { currencyFormat, momentToStringDate } from '@/utils';
import { Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { renderTooltipContentCost, renderUnitTagCost } from '../flower/components/Report.Config';
import { ClockCircleOutlined, CheckCircleOutlined, StopOutlined, CloseCircleOutlined } from '@ant-design/icons';

export const columns = (page: number): ColumnsType<any> => [
    {
        title: 'STT',
        dataIndex: 'id',
        align: 'center',
        width: '100px',
        render: (row, record, index) => (page === 1 ? ++index : (page - 1) * RECORD_SIZE + ++index),
    },
    {
        title: 'Tên khách hàng',
        dataIndex: 'season',
        render: (value) => value?.name,
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'phoneNumber',
        align: 'center',
        render: (value) => value,
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'season',
        render: (value) => value,
    },
    {
        title: 'Số lần mua',
        dataIndex: 'season',
        align: 'center',
        render: (value) => currencyFormat(value?.usableArea),
    },

    {
        title: 'Tổng tiền mua',
        dataIndex: 'season',
        align: 'center',
        render: (value) => currencyFormat(value?.expectedQuantity),
    },

    {
        title: 'Ngày mua gần nhất',
        dataIndex: 'turns',
        align: 'center',
        render: (value, record) => {
            return momentToStringDate(value);
        },
    },
];
