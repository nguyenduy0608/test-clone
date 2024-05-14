import { RECORD_SIZE } from '@/config/theme';
import { ROLE, STATUS_SEASON } from '@/contants';
import { currencyFormat, momentToStringDate, uuid } from '@/utils';
import { CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
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

export const columns = (page: number): ColumnsType<DataType> => [
    {
        title: 'STT',
        dataIndex: 'id',
        align: 'center',
        width: '100px',
        render: (row, record, index) => (page === 1 ? ++index : (page - 1) * RECORD_SIZE + ++index),
    },
    {
        title: 'Tên vườn',
        dataIndex: 'name',
    },
    {
        title: 'Mã vườn',
        dataIndex: 'sid',
        align: 'center',
    },
    {
        title: 'Diện tích',
        dataIndex: 'acreage',
        align: 'center',
        render: (value, record, index) => currencyFormat(value),
    },
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
        title: 'Địa chỉ',
        dataIndex: 'address',
        align: 'center',
        render: (value, record, index) => (value ? value : '---'),
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
        width: '100px',
        render: (row, record, index) => (page === 1 ? ++index : (page - 1) * RECORD_SIZE + ++index),
    },
    {
        title: 'Khu vực',
        dataIndex: 'name',
        align: 'center',
    },
    {
        title: 'Diện tích',
        dataIndex: 'acreage',
        align: 'center',
        render: (value, record, index) => currencyFormat(value),
    },
    {
        title: 'Mã luống',
        dataIndex: 'plantbeds',
        align: 'center',
        render: (value, record, index) => {
            const plantbeds = record?.plantbeds?.map((item: any, idx: number, array: any[]) => (
                <p key={item?.id} style={{ marginBottom: idx === array.length - 1 ? 0 : 14 }}>
                    {item?.sid}
                </p>
            ));
            return plantbeds;
        },
    },
    {
        title: 'Tên luống',
        dataIndex: 'plantbeds',
        align: 'center',
        render: (value, record, index) => {
            const plantbeds = record?.plantbeds?.map((item: any, idx: number, array: any[]) => (
                <p key={item?.id} style={{ marginBottom: idx === array.length - 1 ? 0 : 14 }}>
                    {item?.name}
                </p>
            ));
            return plantbeds;
        },
    },
    {
        title: 'Loại cây trồng',
        dataIndex: 'plantbeds',
        align: 'center',
        render: (value, record, index) => {
            const flowerNames = record?.plantbeds?.map((item: any, idx: number, array: any[]) => {
                const season: Array<any> = item?.seasons;
                if (
                    season?.[season.length - 1]?.status === STATUS_SEASON.InProgress &&
                    season?.[season.length - 1]?.seasonsPlantbeds?.status !== STATUS_SEASON.InActive
                ) {
                    return (
                        <p key={uuid()} style={{ marginBottom: idx === array.length - 1 ? 0 : 14 }}>
                            {season?.[season.length - 1]?.flower?.name}
                        </p>
                    );
                }
                return (
                    <p key={uuid()} style={{ marginBottom: idx === array.length - 1 ? 0 : 14 }}>
                        ---
                    </p>
                );
            });
            return flowerNames;
        },
    },
];

export const columnsUser = (page: number): ColumnsType<any> => [
    {
        title: 'STT',
        dataIndex: 'id',
        align: 'center',
        width: '100px',
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
        title: 'Chức vụ',
        dataIndex: 'type',
        render: (value, record, index) =>
            value === ROLE.ROOT_ADMIN ? (
                <div>Admin</div>
            ) : value === ROLE.MANAGER ? (
                <div>Quản lí</div>
            ) : value === ROLE.TECHNICIAN ? (
                <div>Kỹ thuật viên</div>
            ) : value === ROLE.CARETAKER ? (
                <div>Nhân viên vườn</div>
            ) : value === ROLE.MANAGER_TECHNICIAN ? (
                <div>Quản lí kiêm ktv</div>
            ) : (
                ''
            ),
    },
];
