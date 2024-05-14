import { RECORD_SIZE } from '@/config/theme';
import { ROLE, STATUS_SEASON, TYPE_FLOWER } from '@/contants';
import { currencyFormat, momentToStringDate } from '@/utils';
import { Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
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
        width: '80px',
        render: (row, record, index) => (page === 1 ? ++index : (page - 1) * RECORD_SIZE + ++index),
    },
    {
        title: 'Tên vụ mùa',
        dataIndex: 'name',
    },
    {
        title: 'Vườn',
        dataIndex: ['garden', 'name'],
    },
    {
        title: 'Diện tích trồng(m2)',
        dataIndex: 'usableArea',
        align: 'center',
        render: (value) => currencyFormat(value),
    },
    {
        title: 'Cây trồng',
        dataIndex: ['flower', 'name'],
        render: (value) => (
            <Tag icon={<BsTreeFill />} color="green">
                {' '}
                {value}
            </Tag>
        ),
    },
    {
        title: 'Loại cây',
        dataIndex: ['flower', 'type'],
        align: 'center',
        render: (value, record, index) =>
            value === TYPE_FLOWER.GROWN_MANY_TIMES
                ? 'Thu nhiều lần'
                : value === TYPE_FLOWER.GROW_ONE
                ? 'Thu một lần'
                : 'Lâu năm',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        align: 'center',
        render: (value, record, index) =>
            value === STATUS_SEASON.InProgress ? (
                <Tag icon={<LoadingOutlined spin />} color="processing">
                    Đang trồng
                </Tag>
            ) : value === STATUS_SEASON.Completed ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                    Hoàn thành
                </Tag>
            ) : value === STATUS_SEASON.InActive ? (
                <Tag icon={<CloseCircleOutlined />} color="error">
                    Dừng canh tác
                </Tag>
            ) : (
                ''
            ),
    },

    {
        title: 'Người tạo',
        dataIndex: ['createdByUser', 'fullName'],
        align: 'center',
    },
    {
        title: 'Ngày bắt đầu',
        dataIndex: 'actualStart',
        align: 'center',
        render: (value, record, index) => momentToStringDate(value),
    },
    {
        title: 'Trạng thái thu hoạch',
        dataIndex: 'harvests',
        align: 'center',
        render: (value, record, index) => {
            const count = record?.harvests?.filter((obj: any) => obj.status === STATUS_SEASON.Completed)?.length;
            // let lengthNumber = record?.harvests?.length;
            return !count || record?.flower?.type === TYPE_FLOWER.GROW_ONE ? (
                <>---</>
            ) : (
                <div>Đợt thu hoạch lần {count}</div>
            );
        },
    },
    {
        title: 'Ngày hoàn thành',
        dataIndex: 'actualEnd',
        align: 'center',
        render: (value, record, index) => momentToStringDate(value) || '---',
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

export const columnsGeneral = (page: number): ColumnsType<any> => [
    {
        title: 'STT',
        dataIndex: 'id',
        align: 'center',
        render: (row, record, index) => (page === 1 ? ++index : (page - 1) * RECORD_SIZE + ++index),
    },
    {
        title: 'Khu vực',
        dataIndex: ['area', 'name'],
        // render:(value: any) => momentToStringDate(value)
    },

    {
        title: 'Mã luống',
        dataIndex: 'sid',
    },
    {
        title: 'Luống',
        dataIndex: 'name',
        align: 'center',
    },
    {
        title: 'Trạng thái',
        dataIndex: ['seasonsPlantbeds', 'status'],
        align: 'center',
        render: (value, record) => {
            return (
                <div>
                    {value === STATUS_SEASON.InActive ? (
                        <Tag color="red" icon={<CloseCircleOutlined />}>
                            Dừng trồng
                        </Tag>
                    ) : value === STATUS_SEASON.InProgress ? (
                        <Tag color="blue" icon={<LoadingOutlined />}>
                            Đang trồng
                        </Tag>
                    ) : (
                        <Tag color="success" icon={<CheckCircleOutlined />}>
                            Hoàn thành
                        </Tag>
                    )}
                </div>
            );
        },
    },
    {
        title: 'Lý do',
        dataIndex: ['seasonsPlantbeds', 'reasonForStopping'],
    },
];

export const columnsPlanting = (page: number): ColumnsType<any> => [
    {
        title: 'STT',
        dataIndex: 'id',
        align: 'center',
        render: (row, record, index) => (page === 1 ? ++index : (page - 1) * RECORD_SIZE + ++index),
    },
    {
        title: 'Ngày thu hoạch',
        dataIndex: 'harvestDate',
        render: (value: any) => momentToStringDate(value),
    },
    {
        title: 'Số lượng',
        dataIndex: 'quantity',
        render: (value: any) => currencyFormat(value),
    },
    {
        title: 'Đơn vị',
        dataIndex: ['unit', 'name'],
    },
    {
        title: 'Giá bán',
        dataIndex: 'price',
        render: (value: any) => currencyFormat(value),
    },
    {
        title: 'Thành tiền',
        dataIndex: 'totalPrice',
        render: (value: any, record: any) => currencyFormat(record?.quantity * record?.price),
    },
];

export const columnsExpense = (page: number): ColumnsType<any> => [
    {
        title: 'STT',
        dataIndex: 'id',
        align: 'center',
        render: (row, record, index) => (page === 1 ? ++index : (page - 1) * RECORD_SIZE + ++index),
    },
    {
        title: 'Loại chi phí',
        dataIndex: 'harvestDate',
        render: (value: any) => momentToStringDate(value),
    },

    {
        title: 'Đơn vị',
        dataIndex: 'price',
    },
    {
        title: 'Số lượng',
        dataIndex: 'quantity',
    },
    {
        title: 'Thành tiền',
        dataIndex: 'quantity',
    },
    {
        title: 'Thời gian',
        dataIndex: 'quantity',
    },
    {
        title: 'Nội dung',
        dataIndex: 'quantity',
    },
];

export const columnsPlantbeds = (page?: number): ColumnsType<any> => [
    {
        title: 'Khu vực',
        dataIndex: ['area', 'name'],
        // render:(value: any) => momentToStringDate(value)
    },

    {
        title: 'Mã luống',
        dataIndex: 'sid',
    },
    {
        title: 'Luống',
        dataIndex: 'name',
    },
    {
        title: 'Trạng thái',
        dataIndex: ['seasonsPlantbeds', 'status'],
        align: 'center',
        render: (value, record) => {
            return (
                <div>
                    {value === STATUS_SEASON.InActive
                        ? 'Dừng trồng'
                        : value === STATUS_SEASON.InProgress
                        ? 'Đang trồng'
                        : 'Hoàn thành'}
                </div>
            );
        },
    },
];
export const columnsTime = (page?: number): ColumnsType<any> => [
    {
        title: 'Đợt',
        dataIndex: '',
        align: 'center',
        render: (value, record, index) => ++index,
    },
    {
        title: 'Ngày dự kiến thu hoạch',
        dataIndex: 'name',
        align: 'center',
        render: (value, record, index) => (
            <>
                <div>{record}</div>
            </>
        ),
    },
];

export const columnsHistory = (page?: number): ColumnsType<any> => [
    {
        title: 'Thông tin cũ',
        dataIndex: 'oldInformation',
        align: 'center',
        width: 300,
    },
    {
        title: 'Thông tin mới',
        dataIndex: 'newInformation',
        align: 'center',
        width: 300,
    },
    {
        title: 'Người thực hiện',
        dataIndex: ['createdByUser', 'fullName'],
        align: 'center',
    },
    {
        title: 'Thời gian',
        dataIndex: 'createdAt',
        align: 'center',
        render: (value, record, index) => moment(value).format('HH:mm DD/MM/YYYY'),
    },
];
