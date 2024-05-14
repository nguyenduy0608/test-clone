import { RECORD_SIZE } from '@/config/theme';
import { NEWS_STATUS } from '@/contants';
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
        title: 'Tên tiêu đề',
        dataIndex: 'title',
    },
    {
        title: 'Tài liệu',
        dataIndex: 'type',
        render: (value, record, index) =>
            record?.type === 'technical' ? (
                <Tag icon={<FileTextOutlined />} color="#696aad">
                    Tài liệu kỹ thuật
                </Tag>
            ) : (
                <Tag icon={<FilePptOutlined />} color="#6f795c">
                    Hướng dẫn công việc
                </Tag>
            ),
    },
    {
        title: 'Tên cây trồng',
        dataIndex: ['flower', 'name'],
        render: (value) => value || '---',
    },

    {
        title: 'Vườn',
        dataIndex: 'gardens',
        width: '300px',
        render: (value, record: any, index) => {
            return record?.assignedToAllGardens ? (
                <Tag key={index} color="#038fde">
                    Tất cả
                </Tag>
            ) : record?.gardens.length > 0 ? (
                record?.gardens?.map((item: any) => (
                    <Tag key={index} color="#25b238">
                        {item?.name}
                    </Tag>
                ))
            ) : (
                '---'
            );
        },
    },
    {
        title: 'Thời gian chỉnh sửa',
        dataIndex: 'updatedAt',
        align: 'center',
        render: (value, record, index) => moment(value).format('HH:mm DD/MM/YYYY'),
    },
    {
        title: 'Người chỉnh sửa',
        dataIndex: ['createdByUser', 'fullName'],
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        align: 'center',
        render: (value, record, index) =>
            record?.status === NEWS_STATUS.POST ? (
                <Tag color="#038fde">Đăng bài</Tag>
            ) : (
                <Tag color="#696aad">Lưu nháp</Tag>
            ),
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        align: 'center',
        render: (value, record, index) => moment(value).format('HH:mm DD/MM/YYYY'),
    },
];
