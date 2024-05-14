import { RECORD_SIZE } from '@/config/theme';
import { STATUS_SEASON } from '@/contants';
import { currencyFormat } from '@/utils';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';

export interface IlLandProps {
    seasons: any;
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
        dataIndex: 'area',
        render: (value) => value?.garden?.name,
    },
    {
        title: 'Tổng số lượng',
        dataIndex: 'area',
        align: 'center',
        render: (value) => <Tag color="#f50">{currencyFormat(value) || 0}</Tag>,
    },

    {
        title: 'Phân loại',
        dataIndex: 'sid',
        align: 'center',
        render: (value) => value,
    },
    {
        title: 'Tác giả',
        dataIndex: 'name',
        align: 'center',
        render: (value) => value,
    },
    {
        title: 'Tổng tiền bán được',
        dataIndex: 'usedDayCount',
        align: 'center',
        render: (value) => <Tag color="success">{currencyFormat(value) || 0}</Tag>,
    },
    {
        title: 'Giá nhập',
        dataIndex: 'emptyDayCount',
        align: 'center',
        render: (value) => <Tag color="#f50">{currencyFormat(value) || 0}</Tag>,
    },
    {
        title: 'Giá bán',
        dataIndex: 'emptyDayRatio',
        align: 'center',
        render: (value) => <Tag color="#f50">{currencyFormat(value) || 0}</Tag>,
    },
    {
        title: 'Tổng doanh thu',
        dataIndex: 'emptyDayRatio',
        align: 'center',
        render: (value) => <Tag color="#f50">{currencyFormat(value) || 0}</Tag>,
    },
];
export const columnLand = (page: number, filterQuery: any): ColumnsType<any> => [
    {
        title: 'STT',
        dataIndex: 'id',
        align: 'center',
        width: '100px',
        render: (row, record, index) => (page === 1 ? ++index : (page - 1) * RECORD_SIZE + ++index),
    },
    {
        title: 'Vụ mùa',
        dataIndex: 'name',
    },
    {
        title: 'Cây trồng',
        dataIndex: 'flower',
        align: 'center',
        render: (value) => value?.name,
    },
    {
        title: 'Trạng thái',
        align: 'center',
        dataIndex: 'status',
        render: (value) =>
            value === STATUS_SEASON.InProgress ? (
                <Tag icon={<SyncOutlined spin />} color="success">
                    Đang trồng
                </Tag>
            ) : value === STATUS_SEASON.Completed ? (
                <Tag icon={<CheckCircleOutlined />} color="processing">
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
        title: 'Trạng thái luống',
        dataIndex: 'seasonsPlantbeds',
        align: 'center',
        render: (value, record, index) =>
            value.status === STATUS_SEASON.InProgress ? (
                <Tag icon={<SyncOutlined spin />} color="success">
                    Đang trồng
                </Tag>
            ) : value.status === STATUS_SEASON.Completed ? (
                <Tag icon={<CheckCircleOutlined />} color="processing">
                    Hoàn thành
                </Tag>
            ) : value.status === STATUS_SEASON.InActive ? (
                <Tag icon={<CloseCircleOutlined />} color="error">
                    Dừng trồng
                </Tag>
            ) : (
                ''
            ),
    },

    {
        title: 'Ngày bắt đầu',
        dataIndex: 'seasonsPlantbeds',
        align: 'center',
        render: (value, record, index) =>
            value?.startPlantingDate ? moment(value?.startPlantingDate).format('DD/MM/YYYY') : '---',
    },
    {
        title: 'Ngày kết thúc',
        dataIndex: 'seasonsPlantbeds',
        align: 'center',
        render: (value, record, index) => {
            return record?.status === STATUS_SEASON.Completed
                ? moment(record.actualEnd).format('DD/MM/YYYY')
                : record?.status === STATUS_SEASON.InActive
                ? moment(value?.inactiveDate).format('DD/MM/YYYY')
                : '---';
        },
    },
    {
        title: 'Ngày dừng trồng',
        dataIndex: 'seasonsPlantbeds',
        align: 'center',
        render: (value, record, index) =>
            value?.status === STATUS_SEASON.InActive && record.status === STATUS_SEASON.InActive
                ? '---'
                : value?.inactiveDate
                ? moment(value?.inactiveDate).format('DD/MM/YYYY')
                : '---',
    },
    {
        title: 'Số ngày canh tác',
        dataIndex: 'seasonsPlantbeds',
        align: 'center',
        render: (value, record, index) => {
            const startDate = moment(value?.startPlantingDate).format('YYYY-MM-DD');

            const daysOfInprogressWork = value?.inactiveDate
                ? compareDates(filterQuery?.endDate, startDate)
                    ? 0
                    : compareDates(filterQuery?.startDate, startDate) && compareDates(startDate, filterQuery?.endDate)
                    ? compareDates(filterQuery?.endDate, moment(value?.inactiveDate))
                        ? totalDaysBetweenMoments(startDate, moment(filterQuery?.endDate)) + 1
                        : totalDaysBetweenMoments(startDate, moment(value?.inactiveDate)) + 1
                    : compareDates(startDate, filterQuery?.startDate)
                    ? compareDates(filterQuery?.endDate, moment(value?.inactiveDate))
                        ? totalDaysBetweenMoments(filterQuery?.startDate, filterQuery?.endDate) + 1
                        : compareDates(filterQuery?.startDate, moment(value?.inactiveDate)) &&
                          compareDates(moment(value?.inactiveDate), filterQuery?.endDate)
                        ? totalDaysBetweenMoments(moment(filterQuery?.startDate), moment(value?.inactiveDate)) + 1
                        : 0
                    : 0
                : compareDates(filterQuery?.endDate, startDate)
                ? 0
                : compareDates(filterQuery?.startDate, startDate) && compareDates(startDate, filterQuery?.endDate)
                ? compareDates(filterQuery?.endDate, moment())
                    ? totalDaysBetweenMoments(startDate, filterQuery?.endDate) + 1
                    : totalDaysBetweenMoments(moment(startDate), moment()) + 1
                : compareDates(startDate, filterQuery?.startDate)
                ? compareDates(filterQuery?.endDate, moment())
                    ? totalDaysBetweenMoments(filterQuery?.startDate, filterQuery?.endDate) + 1
                    : compareDates(moment(), filterQuery?.startDate)
                    ? 0
                    : totalDaysBetweenMoments(filterQuery?.startDate, moment()) + 1
                : 0;

            const daysOfInactiveWork = compareDates(filterQuery?.endDate, startDate)
                ? 0
                : compareDates(filterQuery?.startDate, startDate) && compareDates(startDate, filterQuery?.endDate)
                ? compareDates(filterQuery?.endDate, moment(value?.inactiveDate))
                    ? totalDaysBetweenMoments(startDate, filterQuery?.endDate) + 1
                    : totalDaysBetweenMoments(startDate, moment(value?.inactiveDate)) + 1
                : compareDates(startDate, filterQuery?.startDate)
                ? compareDates(filterQuery?.endDate, moment(value?.inactiveDate))
                    ? totalDaysBetweenMoments(filterQuery?.startDate, filterQuery?.endDate) + 1
                    : compareDates(filterQuery?.startDate, moment(value?.inactiveDate)) &&
                      compareDates(moment(value?.inactiveDate), filterQuery?.endDate)
                    ? totalDaysBetweenMoments(filterQuery?.startDate, moment(value?.inactiveDate)) + 1
                    : 0
                : compareDates(filterQuery?.endDate, moment(value?.inactiveDate))
                ? totalDaysBetweenMoments(filterQuery?.startDate, filterQuery?.endDate) + 1
                : compareDates(filterQuery?.startDate, moment(value?.inactiveDate)) &&
                  compareDates(moment(value?.inactiveDate), filterQuery?.endDate)
                ? totalDaysBetweenMoments(filterQuery?.startDate, moment(value?.inactiveDate)) + 1
                : 0;

            const daysOfCompleteWork = compareDates(filterQuery?.endDate, startDate)
                ? 0
                : compareDates(filterQuery?.startDate, startDate) && compareDates(startDate, filterQuery?.endDate)
                ? compareDates(filterQuery?.endDate, moment(record.actualEnd))
                    ? totalDaysBetweenMoments(startDate, filterQuery?.endDate) + 1
                    : totalDaysBetweenMoments(startDate, moment(record.actualEnd)) + 1
                : compareDates(startDate, filterQuery?.startDate)
                ? compareDates(filterQuery?.endDate, moment(record.actualEnd))
                    ? totalDaysBetweenMoments(filterQuery?.startDate, filterQuery?.endDate) + 1
                    : compareDates(filterQuery?.startDate, moment(record.actualEnd)) &&
                      compareDates(moment(record.actualEnd), filterQuery?.endDate)
                    ? totalDaysBetweenMoments(filterQuery?.startDate, moment(record.actualEnd)) + 1
                    : 0
                : 0;
            return record?.status === STATUS_SEASON.Completed
                ? daysOfCompleteWork
                : record?.status === STATUS_SEASON.InActive
                ? daysOfInactiveWork
                : daysOfInprogressWork;
        },
    },
];
export const totalDaysBetweenMoments = (moment1: any, moment2: any) => {
    const daysDifference = moment(moment2)?.diff(moment(moment1), 'days');
    return daysDifference;
};
const compareDates = (date1: any, date2: any) => {
    return moment(date1).isBefore(date2);
};
