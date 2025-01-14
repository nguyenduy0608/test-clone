import { RECORD_SIZE } from '@/config/theme';
import { ROLE, STATUS_WORK, TYPE_OPTION } from '@/contants';
import { currencyFormat, momentToStringDate, removeSecondsFromTime, uuid } from '@/utils';
import { UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';
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
    assignees?: any;
    execution_date?: any;
    expectedStartTime?: any;
    expectedEndTime?: any;
    repeatType?: string;
    daysOfWeek: any;

    exactDates?: any;
}

export const columns = (page: number): ColumnsType<any> => [
    {
        title: 'STT',
        dataIndex: 'id',
        align: 'center',
        width: '100px',
        render: (row, record, index) => (page === 1 ? ++index : (page - 1) * RECORD_SIZE + ++index),
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'name',
    },
    {
        title: 'Danh mục',
        dataIndex: 'category',
        align: 'center',
    },
    {
        title: 'Phân loại',
        dataIndex: 'status',
        align: 'center',
        render: (value) => (value === '' ? <Tag color="success">Bán chạy</Tag> : <Tag color="red">Tồn kho</Tag>),
    },
    {
        title: 'Tên tác giả',
        dataIndex: 'name',
    },
    {
        title: 'Đơn giá',
        dataIndex: '',
        align: 'center',
    },
    {
        title: 'Số lượng',
        dataIndex: '',
        // align: 'center',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        align: 'center',
        render: (value) =>
            value === '' ? <Tag color="success">Đang hoạt động</Tag> : <Tag color="red">Ngừng hoạt động</Tag>,
    },
];
