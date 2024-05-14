import { RECORD_SIZE } from '@/config/theme';
import { ROLE, TYPE_FLOWER } from '@/contants';
import { momentToStringDate } from '@/utils';
import { Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { BsTreeFill } from 'react-icons/bs';
export interface DataType {
    id?: number;
    status?: any;
    fullName: string;
    email: string;
    phoneNumber?: string;
    phone_number?: string;
    createdAt: string;
    updatedAt: string;
    password?: string;
    avatar?: string;
    dfTypeUserId?: any;
    storageIds?: any;
    storageUser?: any;
}

export const columns = (page: number): ColumnsType<any> => [
    {
        title: 'STT',
        dataIndex: 'id',
        align: 'center',
        render: (row, record, index) => (page === 1 ? ++index : (page - 1) * RECORD_SIZE + ++index),
    },
    {
        title: 'Mã cây trồng',
        dataIndex: 'sid',
    },
    {
        title: 'Tên cây trồng',
        dataIndex: 'name',
        render: (value) => (
            <Tag icon={<BsTreeFill />} color="green">
                {' '}
                {value}
            </Tag>
        ),
    },
    {
        title: 'Loại cây',
        dataIndex: 'type',
        // align: 'center',
        render: (value, record, index) =>
            value === TYPE_FLOWER.GROWN_MANY_TIMES
                ? 'Thu nhiều lần'
                : value === TYPE_FLOWER.GROW_ONE
                ? 'Thu một lần'
                : 'Lâu năm',
    },

    {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        align: 'center',
        render: (value, record, index) => momentToStringDate(value),
    },
];

export const columnsGarden = (page: number): ColumnsType<any> => [
    {
        title: 'STT',
        dataIndex: 'id',
        align: 'center',
        render: (row, record, index) => (page === 1 ? ++index : (page - 1) * RECORD_SIZE + ++index),
    },
    {
        title: 'Mã vườn',
        dataIndex: 'sid',
    },
    {
        title: 'Tên vườn',
        dataIndex: 'name',
    },
];
