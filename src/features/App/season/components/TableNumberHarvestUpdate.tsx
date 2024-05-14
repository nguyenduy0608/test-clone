import React, { useState } from 'react';
import { Table, Input, Button, DatePicker, Pagination, Tag, Row, Modal } from 'antd';
import moment, { Moment } from 'moment';
import TableComponent from '@/components/TableComponent';
import { STATUS_SEASON } from '@/contants';
import IconAntd from '@/components/IconAntd';
import { seasonsService } from '../services';
import { Notification } from '@/utils';

interface Record {
    id: number;
    expectedHarvestStartDates: any;
}

interface IProps {
    numberOfHarvests: number;
    setTimeHarvest: any;
    dataTime: any;
    actualStart: any;
    dataSeason: any;
    refetch: any;
    id: number | string;
}

const TableNumberHarvestUpdate = (props: IProps) => {
    const { numberOfHarvests, setTimeHarvest, dataTime, actualStart, dataSeason, id, refetch } = props;
    const [data, setData] = useState<Record[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(12);
    const handlePageChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
    };
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentItems = data?.slice(startIndex, endIndex);
    // const [page, setPage] = React.useState(1);

    React.useEffect(() => {
        setTimeHarvest(dataTime);
    }, []);

    React.useEffect(() => {
        const defaultValue: any = [];
        //     const datas = [...data]
        //   const timeToday = moment().format('DD/MM/YYYY');

        for (let i = 0; i < numberOfHarvests; i++) {
            defaultValue.push({
                id: i + 1,
                expectedHarvestStartDates: dataTime[i] || moment().format('YYYY-MM-DD'),
                harvests: dataSeason?.harvests[i],
            });
        }
        setData(defaultValue);
        setTimeHarvest(defaultValue);
    }, [numberOfHarvests]);

    const handleBirthdayChange = (record: Record, date: Moment | null) => {
        const newData = [...data];
        const updatedRecord = {
            ...record,
            expectedHarvestStartDates: date ? moment(date) : '',
        };
        const index = newData.findIndex((item) => item.id === record.id);
        newData.splice(index, 1, updatedRecord);
        setData(newData);
        setTimeHarvest(newData);
    };

    // React.useEffect(() => {

    // }, [data])

    const columns: any = [
        {
            title: 'Đợt',
            dataIndex: 'id',
            align: 'center',
            key: 'id',
        },
        {
            title: 'Ngày dự kiến thu hoạch',
            dataIndex: 'expectedHarvestStartDates',
            key: 'expectedHarvestStartDates',
            align: 'center',
            render: (text: string, record: Record) => (
                <DatePicker
                    format="DD/MM/YYYY"
                    allowClear={false}
                    value={moment(text)}
                    onChange={(date) => handleBirthdayChange(record, date)}
                    disabledDate={(current: any) => {
                        if (actualStart) {
                            return current < moment(actualStart).startOf('day');
                        }
                        return current && current < moment(actualStart).startOf('day');
                    }}
                />
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'harvests',
            key: 'harvests',
            align: 'center',
            render: (value: any, record: any) => {
                return value?.status === STATUS_SEASON.InProgress && value?.turns.length > 0 ? (
                    <Tag color="green">Đang thu hoạch</Tag>
                ) : value?.status === STATUS_SEASON.Completed && value?.turns.length > 0 ? (
                    <Tag color="blue">Hoàn thành</Tag>
                ) : (
                    <>---</>
                );
            },
        },
        {
            title: 'Thao tác',
            dataIndex: '',
            key: '',
            align: 'center',
            render: (_: any, record: any) =>
                (record?.harvests?.status === STATUS_SEASON.InProgress && record?.harvests?.turns.length) ||
                (record?.harvests?.status === STATUS_SEASON.Completed && record?.harvests?.turns.length > 0) ? (
                    <></>
                ) : (
                    <Button
                        onClick={() => {
                            Modal.confirm({
                                title: 'Xóa vụ mùa',
                                content: 'Bạn có chắc chắn muốn xoá đợt thu hoạch này?',
                                onOk: async () => {
                                    await seasonsService
                                        .deleteHarvestStartDate({
                                            seasonId: Number(id),
                                            harvestDateIndex: Number(record?.id - 1),
                                        })
                                        .then((res) => {
                                            if (res?.status) {
                                                refetch();
                                                Notification('success', 'Xoá đợt thu hoạch thành công');
                                            }
                                        });
                                },
                            });
                        }}
                        type="link"
                        icon={<IconAntd icon="DeleteOutlined" />}
                    />
                ),
        },
    ];

    return (
        <>
            <TableComponent
                dataSource={currentItems || []}
                // bordered
                columns={columns}
                rowSelect={false}
                page={currentPage}
                onChangePage={(_page) => setCurrentPage(_page)}
                total={data?.length}
            />
            {/* <Pagination
                            current={currentPage}
                            // pageSize={pageSize}
                            total={data?.length}
                            onChange={handlePageChange}
                        /> */}
        </>
    );
};

export default TableNumberHarvestUpdate;
