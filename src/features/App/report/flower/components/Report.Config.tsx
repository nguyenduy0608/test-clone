import { RECORD_SIZE } from '@/config/theme';
import { STATUS_SEASON, STATUS_WORK } from '@/contants';
import { currencyFormat } from '@/utils';
import { Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    LoadingOutlined,
    CloseCircleOutlined,
    HddOutlined,
} from '@ant-design/icons';

export const renderUnitTag = (value: any) => {
    let displayNames: JSX.Element[] = [];

    // Tạo một Set để lưu trữ các giá trị duy nhất của item.name
    const uniqueNames = new Set(value?.map((item: any) => item?.name));

    // Chuyển Set thành một mảng để có thể lặp qua và hiển thị
    const uniqueNamesArray = Array.from(uniqueNames) as string[];

    // Lấy 2 phần tử duy nhất đầu tiên
    const slicedUniqueNames = uniqueNamesArray?.slice(0, 2);

    displayNames = slicedUniqueNames?.map((name: string, index: number) => (
        <React.Fragment key={index}>
            <Tag>{name}</Tag>
        </React.Fragment>
    ));

    return displayNames;
};
export const renderAreaTag = (value: any) => {
    let displayNames: JSX.Element[] = [];

    // Tạo một Set để lưu trữ các giá trị duy nhất của item.name
    const uniqueNames = new Set(value?.map((item: any) => item?.name));

    // Chuyển Set thành một mảng để có thể lặp qua và hiển thị
    const uniqueNamesArray = Array.from(uniqueNames) as string[];

    // Lấy 2 phần tử duy nhất đầu tiên
    const slicedUniqueNames = uniqueNamesArray?.slice(0, 2);

    displayNames = slicedUniqueNames?.map((name: string, index: number) => (
        <React.Fragment key={index}>
            <Tag color="rgb(175 90 17)">{name}</Tag>
        </React.Fragment>
    ));

    return displayNames;
};
export const renderUnitTagCost = (value: any) => {
    let displayNames: JSX.Element[] = [];

    // Tạo một Set để lưu trữ các giá trị duy nhất của item.name
    const uniqueNames = new Set(value?.map((item: any) => item?.unit?.name));

    // Chuyển Set thành một mảng để có thể lặp qua và hiển thị
    const uniqueNamesArray = Array.from(uniqueNames) as string[];

    // Lấy 2 phần tử duy nhất đầu tiên
    const slicedUniqueNames = uniqueNamesArray?.slice(0, 2);

    displayNames = slicedUniqueNames?.map((name: string, index: number) => (
        <React.Fragment key={index}>
            <Tag>{name}</Tag>
        </React.Fragment>
    ));

    return displayNames;
};

export const renderTooltipContentCost = (value: any) => {
    // Tạo một Set để lưu trữ các giá trị duy nhất của item.unit.name
    const uniqueUnitNames = new Set<string>();

    // Lặp qua mảng value để thêm các item.unit.name vào Set
    value.forEach((item: any) => {
        if (item) {
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

export const renderTooltipContent = (value: any) => {
    // Tạo một Set để lưu trữ các giá trị duy nhất của item.unit.name
    const uniqueUnitNames = new Set<string>();

    // Lặp qua mảng value để thêm các item.unit.name vào Set
    value?.forEach((item: any) => {
        if (item) {
            uniqueUnitNames.add(item?.name);
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

export const columns = (page: number, filter?: any): ColumnsType<any> => [
    {
        title: 'STT',
        dataIndex: 'id',
        align: 'center',
        render: (row, record, index) => (page === 1 ? ++index : (page - 1) * RECORD_SIZE + ++index),
    },
    {
        title: 'Vụ mùa',
        dataIndex: 'name',
    },
    {
        title: 'Vườn',
        dataIndex: 'garden',
        align: 'center',

        render: (value, record, index) => value?.name,
    },
    {
        title: 'Loại cây trồng',
        dataIndex: ['flower', 'name'],
    },
    {
        title: 'Khu vực',
        dataIndex: 'areas',
        align: 'center',
        render: (value, record, index) => (
            <span>
                <Tooltip title={renderTooltipContent(value)} placement="bottom">
                    <span>{renderAreaTag(value)}</span>
                </Tooltip>
            </span>
        ),
    },
    {
        title: 'Tổng luống',
        dataIndex: 'plantbeds',
        align: 'center',
        render: (value, record: any, index) => record?.plantbeds?.length,
    },

    {
        title: 'Trạng thái',
        dataIndex: 'status',
        align: 'center',
        render: (value, record: any, index) => {
            let tagContent: any = '';

            switch (value) {
                case STATUS_WORK.InProgress:
                    tagContent =
                        record?.flower?.type === 'grown_one' ? (
                            <Tag color="success" icon={<LoadingOutlined />}>
                                Đang trồng
                            </Tag>
                        ) : (
                            <Tag color="gold" icon={<ClockCircleOutlined />}>
                                Thu hoạch đợt {record?.harvests[record?.harvests?.length - 1]?.periodNumber}
                            </Tag>
                        );
                    break;
                case STATUS_SEASON.Completed:
                    tagContent = (
                        <Tag color="blue" icon={<CheckCircleOutlined />}>
                            Hoàn thành
                        </Tag>
                    );
                    break;
                default:
                    tagContent = (
                        <Tag color="magenta" icon={<CloseCircleOutlined />}>
                            Dừng trồng
                        </Tag>
                    );
            }

            return tagContent;
        },
    },
    {
        title: 'Tổng diện tích trồng (M2)',
        dataIndex: 'usableArea',
        align: 'center',
        render: (value) => currencyFormat(value),
    },
    {
        title: 'Sản lượng dự kiến',
        dataIndex: 'expectedQuantity',
        align: 'center',
        render: (value) => currencyFormat(value),
    },
    {
        title: 'Đơn vị',
        dataIndex: 'units',
        align: 'center',
        render: (value, record, index) => (
            <span>
                <Tooltip title={renderTooltipContent(value)} placement="bottom">
                    <span>{renderUnitTag(value)}</span>
                </Tooltip>
            </span>
        ),
    },
    {
        title: 'Ngày thu hoạch dự kiến',
        dataIndex: 'expectedHarvestStartDates',
        align: 'center',
        render: (value, record, index) => {
            const sortedDateArray = value?.sort((a: string, b: string) => {
                const dateA: any = moment(a, 'YYYY-MM-DD');
                const dateB: any = moment(b, 'YYYY-MM-DD');

                return dateA - dateB;
            });
            return (
                <span>
                    {sortedDateArray[record?.harvests[record?.harvests?.length - 1]?.periodNumber - 1] &&
                        moment(
                            sortedDateArray[record?.harvests[record?.harvests?.length - 1]?.periodNumber - 1]
                        ).format('DD-MM-YYYY')}
                </span>
            );
        },
    },
];

export const columnPlantbeds = (page: number): ColumnsType<any> => [
    {
        title: 'Khu vực',
        dataIndex: 'name',
        width: 150, // Độ rộng 150px
    },
    {
        title: 'Mã luống',
        dataIndex: 'plantbedId',
        align: 'center',
        width: 100, // Độ rộng 100px
    },
    {
        title: 'Tên luống',
        dataIndex: 'plantbedName',
        width: 150, // Độ rộng 200px
    },
    {
        title: 'Trạng thái',
        align: 'center',
        dataIndex: 'status',
        render: (value) => (value === 'in_progress' ? <Tag color="#87d068">Đang trồng</Tag> : <Tag>Dừng trồng</Tag>),
        width: 120, // Độ rộng 120px
    },
    {
        title: 'Lý do',
        dataIndex: 'reason',
        width: 300, // Độ rộng 250px
    },
];
