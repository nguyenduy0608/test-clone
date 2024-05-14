import { RECORD_SIZE } from '@/config/theme';
import { ROLE } from '@/contants';
import { momentToStringDate } from '@/utils';
import { Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
export interface DataTypeAccount {
    id?: number;
    status?: any;
    fullName: string;
    email: string;
    phoneNumber?: string;
    createdAt: string;
    updatedAt: string;
    password?: string;
    avatar?: string;
    type?: any;
    dateOfBirth?: any;
    gardenId?: any;
    garden?: any;
    gender?: string;
    address?: string;
    confirmPassword?: string;
    userId?: number;
}

export const columns = (page: number): ColumnsType<DataTypeAccount> => [
    {
        title: 'STT',
        dataIndex: 'id',
        align: 'center',
        render: (row, record, index) => (page === 1 ? ++index : (page - 1) * RECORD_SIZE + ++index),
    },
    {
        title: 'Họ tên',
        dataIndex: 'fullName',
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'phoneNumber',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        render: (value) => value || '---',
    },
    // {
    //     title: 'Loại tài khoản',
    //     dataIndex: 'type',
    //     render: (value, record, index) =>
    //         value === ROLE.ROOT_ADMIN ? (
    //             <div>Admin</div>
    //         ) : value === ROLE.MANAGER ? (
    //             <div>Quản lí</div>
    //         ) : value === ROLE.TECHNICIAN ? (
    //             <div>Kỹ thuật viên</div>
    //         ) : value === ROLE.CARETAKER ? (
    //             <div>Nhân viên vườn</div>
    //         ) : value === ROLE.MANAGER_TECHNICIAN ? (
    //             <div>Quản lí kiêm ktv</div>
    //         ) : (
    //             '---'
    //         ),
    // },

    {
        title: 'Trạng thái',
        dataIndex: 'status',
        align: 'center',
        render: (value, record, index) =>
            value ? (
                <Tag icon={<LoadingOutlined />} color="blue">
                    Đang hoạt động
                </Tag>
            ) : (
                <Tag icon={<CloseCircleOutlined />} color="red">
                    Ngừng hoạt động
                </Tag>
            ),
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        align: 'center',
        render: (value, record, index) => momentToStringDate(value) || '---',
    },
];
