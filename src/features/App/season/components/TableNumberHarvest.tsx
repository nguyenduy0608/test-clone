import React, { useState } from 'react';
import { Table, DatePicker } from 'antd';
import moment, { Moment } from 'moment';

interface Record {
    id: number;
    expectedHarvestStartDates: Moment | null;
}

interface IProps {
    numberOfHarvests: number;
    setTimeHarvest: any;
    actualStartDate: any;
}

const TableNumberHarvest = (props: IProps) => {
    const { numberOfHarvests, setTimeHarvest, actualStartDate } = props;
    const [selectedDates, setSelectedDates] = useState<Moment[]>([]);
    const [data, setData] = useState<Record[]>([]);

    React.useEffect(() => {
        const originData: Record[] = [];
        const timeToday = moment().format('YYYY-MM-DD');

        for (let i = 0; i < numberOfHarvests; i++) {
            originData.push({
                id: i + 1,
                expectedHarvestStartDates: moment(timeToday),
            });
        }
        setData(originData);
    }, [numberOfHarvests]);

    const handleDateChange = (record: Record, date: Moment | null) => {
        const newData = [...data];
        const updatedRecord: Record = {
            ...record,
            expectedHarvestStartDates: date ? moment(date) : null,
        };
        const index = newData.findIndex((item) => item.id === record.id);
        newData.splice(index, 1, updatedRecord);
        setData(newData);

        // Lưu trữ ngày được chọn cho đợt hiện tại
        const newSelectedDates = [...selectedDates];
        newSelectedDates[index] = date || moment(); // Nếu không có ngày được chọn, sử dụng ngày hiện tại
        setSelectedDates(newSelectedDates);
    };

    React.useEffect(() => {
        setTimeHarvest(data.filter((item) => item.expectedHarvestStartDates !== null));
    }, [data]);

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
            render: (text: string, record: Record, index: number) => {
                const val: any = moment(text).format('DD/MM/YYYY');
                return (
                    <DatePicker
                        format="DD/MM/YYYY"
                        allowClear={true}
                        value={record.expectedHarvestStartDates}
                        onChange={(date) => handleDateChange(record, date)}
                        disabledDate={(current: Moment | null) => {
                            if (!current) return false;
                            // Nếu là đợt 1, vô hiệu hóa từ ngày bắt đầu thực tế trở về trước
                            if (index === 0) {
                                return current.isBefore(moment(actualStartDate).startOf('day'));
                            }
                            // Ngược lại, vô hiệu hóa từ ngày được chọn trong đợt liền kề trước
                            const prevSelectedDate = selectedDates[index - 1];
                            return (
                                !!prevSelectedDate &&
                                (current.isBefore(moment(prevSelectedDate).add(1, 'days').startOf('day')) ||
                                    current.isBefore(moment(actualStartDate).startOf('day')))
                            );
                        }}
                    />
                );
            },
        },
    ];

    return (
        <Table
            dataSource={data}
            bordered
            columns={columns}
            pagination={{
                onChange: (page, pageSize) => {},
            }}
        />
    );
};

export default TableNumberHarvest;
