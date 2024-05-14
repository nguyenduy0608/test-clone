import { RECORD_SIZE } from '@/config/theme';
import { STATUS_SEASON, STATUS_WORK, TYPE_FLOWER } from '@/contants';
import { currencyFormat } from '@/utils';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';

export const renderUnitTag = (value: any) => {
    let displayNames: JSX.Element[] = [];

    // Tạo một Set để lưu trữ các giá trị duy nhất của item.name
    const uniqueNames = new Set(value?.map((item: any) => item?.unit?.name));

    // Chuyển Set thành một mảng để có thể lặp qua và hiển thị
    const uniqueNamesArray = Array.from(uniqueNames) as string[];

    // Lấy 2 phần tử duy nhất đầu tiên
    const slicedUniqueNames = uniqueNamesArray.slice(0, 2);

    displayNames = slicedUniqueNames?.map((name: string, index: number) => (
        <React.Fragment key={index}>
            <Tag>{name}</Tag>
        </React.Fragment>
    ));

    return displayNames;
};
const formatDate = (value: any) => {
    const originalDate = new Date(value);

    const day = originalDate.getDate();
    const month = originalDate.getMonth() + 1; // Lưu ý: Tháng trong JavaScript đếm từ 0
    const year = originalDate.getFullYear();

    // Chuyển đổi sang chuỗi định dạng "DD/MM/YYYY"
    return `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
};
export const renderDayTags = (value: any) => {
    let displayDates;
    const slicedDates = value?.slice(0, 2);

    displayDates = slicedDates?.map((item: any, index: number) => (
        <React.Fragment key={item?.id}>
            <Tag>{formatDate(item)}</Tag>
        </React.Fragment>
    ));

    return displayDates;
};

export const renderTooltipUnitContent = (value: any) => {
    // Tạo một Set để lưu trữ các giá trị duy nhất của item.unit.name
    const uniqueUnitNames = new Set<string>();

    // Lặp qua mảng value để thêm các item.unit.name vào Set
    value.forEach((item: any) => {
        if (item?.unit && item?.unit?.name) {
            uniqueUnitNames.add(item?.unit?.name);
        }
    });

    // Chuyển Set thành một mảng để có thể lặp qua và hiển thị
    const uniqueUnitNamesArray = Array.from(uniqueUnitNames);

    return (
        <div>
            {uniqueUnitNamesArray?.map((name: string, index: number) => (
                <div key={index}>{name}</div>
            ))}
        </div>
    );
};
export const columns = (page: number): ColumnsType<any> => [
    {
        title: 'STT',
        dataIndex: 'id',
        align: 'center',
        render: (row, record, index) => (page === 1 ? ++index : (page - 1) * RECORD_SIZE + ++index),
    },
    {
        title: 'Cây trồng',
        dataIndex: 'season',
        render: (value) => value?.flower?.name,
    },
    {
        title: 'Loại cây',
        dataIndex: 'season',
        align: 'center',
        render: (value, record, index) =>
            value?.flower?.type === TYPE_FLOWER.GROWN_MANY_TIMES
                ? 'Thu nhiều lần'
                : value?.flower?.type === TYPE_FLOWER.GROW_ONE
                ? 'Thu một lần'
                : 'Lâu năm',
    },
    {
        title: 'Vườn',
        dataIndex: 'season',
        align: 'center',
        render: (value) => value?.garden?.name,
    },
    {
        title: 'Vụ mùa',
        dataIndex: 'season',
        render: (value) => value?.name,
    },

    {
        title: 'Diện tích(M2)',
        dataIndex: 'season',
        align: 'center',
        render: (value) => currencyFormat(value?.usableArea),
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        align: 'center',
        render: (value, record: any, index) => {
            let tagContent: any = '';
            let tagColor = '';

            switch (value) {
                case STATUS_WORK.Completed:
                    tagContent =
                        record?.season?.flower?.type === TYPE_FLOWER.GROW_ONE ? (
                            <Tag color="blue" icon={<CheckCircleOutlined />}>
                                Hoàn thành
                            </Tag>
                        ) : (
                            <Tag color="gold" icon={<ClockCircleOutlined />}>
                                Thu hoạch đợt {record?.periodNumber}
                            </Tag>
                        );
                    break;
                case STATUS_SEASON.InActive:
                    tagContent = (
                        <Tag color="magenta" icon={<CloseCircleOutlined />}>
                            Dừng trồng
                        </Tag>
                    );
                    break;
                default:
                    tagContent = null;
            }

            return tagContent;
        },
    },

    {
        title: 'Ngày bắt đầu',
        dataIndex: 'plantingStartDate',
        align: 'center',
        render: (value) => <Tag color="green">{formatDate(value)}</Tag>,
    },
    {
        title: 'Ngày bắt đầu thu hoạch thực tế',
        dataIndex: 'harvestingStartDate',
        align: 'center',
        render: (value) => <Tag color="success">{formatDate(value)}</Tag>,
    },
    {
        title: 'Tổng lượng thu hoạch',
        dataIndex: 'turns',
        align: 'center',
        render: (value, record) => {
            const totalQuantity = value?.reduce((total: number, cycle: any) => {
                return total + cycle?.quantity;
            }, 0);

            // Hiển thị tổng quantity trong cột
            return <span>{currencyFormat(totalQuantity)}</span>;
        },
    },
    {
        title: 'Đơn vị',
        dataIndex: 'turns',
        align: 'center',
        render: (value, record, index) => (
            <span>
                <Tooltip title={renderTooltipUnitContent(value)} placement="bottom">
                    <span>{renderUnitTag(value)}</span>
                </Tooltip>
            </span>
        ),
    },
    {
        title: 'Chi phí',
        dataIndex: 'expenses',
        align: 'center',
        render: (value, record) => {
            const totalQuantity = value?.reduce((total: number, cycle: any) => {
                return total + cycle?.unitPrice * cycle?.amount;
            }, 0);

            // Hiển thị tổng quantity trong cột
            return <span>{currencyFormat(totalQuantity)}</span>;
        },
    },
    {
        title: 'Lợi nhuận',
        dataIndex: 'turns',
        align: 'center',
        render: (value, record) => {
            const totalQuantity = value?.reduce((total: number, cycle: any) => {
                return total + cycle?.quantity * cycle?.price;
            }, 0);
            const totalExpenses = record?.expenses?.reduce((total: number, cycle: any) => {
                return total + cycle?.unitPrice * cycle?.amount;
            }, 0);
            // Hiển thị tổng quantity trong cột
            return <span>{currencyFormat(totalQuantity - totalExpenses)}</span>;
        },
    },
    {
        title: 'Tổng ngày',
        dataIndex: 'totalDays',
        align: 'center',
        render: (value) => currencyFormat(value),
    },
];
