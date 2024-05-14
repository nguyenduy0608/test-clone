import React, { useState } from 'react';
import { Table, Input, Button, DatePicker, InputNumber, Select, SelectProps, Collapse, Space } from 'antd';
import moment, { Moment } from 'moment';
import { useParams } from 'react-router-dom';
import useCallContext from '@/hooks/useCallContext';
import CardComponent from '@/components/CardComponent';
import { TYPE_FLOWER } from '@/contants';
import { seasonsService } from '../services';
import { uuid } from '@/utils';
const { Panel } = Collapse;
interface Record {
    id: number;
    expectedHarvestStartDates: string;
}


const HarvestTable = ({ form, datas, key, setDataHarvest }: any) => {
    const id = useParams();
    const { state } = useCallContext();
    // const { numberOfHarvests, setTimeHarvest } = props;
    const [data, setData] = useState<any[]>([]);
    const [dataTurns, setDataTurns] = useState<any[]>([]);
    const [optionData, setOptionData] = React.useState<any[]>([]);
    const listUnit = async () => {
        const options: SelectProps['options'] = [];
        // const data = await ConfigService.get({ page: 1, limit: 100 });
        for (let i = 0; i < state?.unit?.length; ++i) {
            options.push({
                value: state?.unit[i].id,
                label: state?.unit[i].name,
            });
        }
        setOptionData(options);
    };
    React.useEffect(() => {
        listUnit();
    }, [id]);
    const listHarvest = async () => {
        await seasonsService.getHarvest(Number(id?.id)).then((res) => {
            if (res.status) {
                const index = res?.data?.length;
                setData(res?.data);
                if (datas?.data?.flower?.type === TYPE_FLOWER.GROW_ONE) {
                    setDataTurns(res?.data?.[0]?.turns);
                } else {
                    setDataTurns(res?.data?.[index - 1]?.turns);
                }
            }
        });
    };
    React.useEffect(() => {
        listHarvest();
        const index = data?.length;
        if (datas?.data?.flower?.type === TYPE_FLOWER.GROW_ONE) {
            setDataTurns(data[0]?.turns);
        } else {
            setDataTurns(data[index - 1]?.turns);
        }
    }, [id, key]);
    const handleAddRecords = () => {
        const newTurn: any = {
            harvestDate: `${moment()}`,
            quantity: 0,
            unitId: null,
            price: 0,
            id: uuid(),
        };
        setDataTurns([...dataTurns, newTurn]);
        const newDataTable = [...data];
        const lastElement = newDataTable[newDataTable.length - 1];
        if (lastElement && lastElement.turns) {
            lastElement.turns.push(newTurn);
        }
        setDataTurns(newDataTable);
    };

    const handleBirthdayChange = (record: Record, date: Moment | null, idx: number) => {
        const newData = [...data];
        const updatedRecord = {
            ...record,
            harvestDate: date ? date.format('YYYY-MM-DD') : '',
        };
        const index = newData.findIndex((item) => item.id === record.id);
        newData.splice(index, 1, updatedRecord);
        setDataTurns(newData);
    };

    const handleQuantityChange = (record: Record, value: any,idx: number) => {
        const newData = [...data];
        const updatedRecord = {
            ...record,
            quantity: value,
        };
        const index = newData.findIndex((item) => item.id === record.id);
        newData.splice(index, 1, updatedRecord);
        setDataTurns(newData);
    };
    const handleUnitIdChange = (record: Record, value: any, idx: number) => {
        
        const newData = [...dataTurns];
        const updatedRecord = {
            ...record,
            unitId: value,
        };
        // const index = newData.findIndex((item) => item.id === record.id);
        const item = newData[idx];
            newData.splice(idx, 1, {
                ...item,
                ...record,
            });
            // setData(newData);
        newData.splice(idx, 1, updatedRecord);
        setDataTurns(newData);
    };
    const handlePriceChange = (record: Record, value: any, idx: number) => {
        const newData = [...dataTurns];
        const updatedRecord = {
            ...record,
            price: value,
        };
        // const index = newData.findIndex((item) => item.id === record.id);
        const item = newData[idx];
            newData.splice(idx, 1, {
                ...item,
                ...record,
            });
            // setDataTurns(newData);
        newData.splice(idx, 1, updatedRecord);
        setDataTurns(newData);
    };

    const columns: any = [
        {
            title: 'Ngày thu hoạch',
            dataIndex: 'harvestDate',
            key: 'harvestDate',
            align: 'center',
            render: (text: string, record: Record, index: number) => (
                <DatePicker
                    allowClear={false}
                    style={{width: '100%'}}
                    // defaultValue={text}
                    // value={text ? moment(text) : null}
                    onChange={(value) => handleBirthdayChange(record, value, index)}
                />
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            render: (text: string, record: Record,index: number) => (
                <InputNumber
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={(value: any) => (value ? value.replace(/[^0-9]/g, '') : '')}
                    defaultValue={text}
                    onChange={(value) => handleQuantityChange(record, value, index)}
                />
            ),
        },
        {
            title: 'Đơn vị',
            dataIndex: 'unitId',
            render: (value: any, record: any, index: number) => {
                return (
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Chọn đơn vị"
                        defaultValue={value}
                        options={optionData}
                        onChange={(value) => handleUnitIdChange(record, value, index)}
                    />
                );
            },
        },
        {
            title: 'Giá bán/Đơn vị',
            dataIndex: 'price',
            render: (text: string, record: Record, index: number) => (
                <InputNumber
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={(value: any) => (value ? value.replace(/[^0-9]/g, '') : '')}
                    defaultValue={text}
                    onChange={(value) => handlePriceChange(record, value, index)}
                />
            ),
        },
    ];
    const onChange = (key: string | string[]) => {};

    return (
        <CardComponent
            title="Cập nhật thu hoạch"
            extra={
                datas?.data?.flower?.type === TYPE_FLOWER.GROW_ONE ? (
                    <Space style={{ display: 'flex', justifyContent: 'end' }}>
                        <Button type="primary" style={{ marginBottom: 16 }}>
                            Lưu
                        </Button>
                    </Space>
                ) : (
                    <></>
                )
            }
        >
            {datas?.data?.flower?.type === TYPE_FLOWER.GROW_ONE ? (
                <>
                    <Table
                        // components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={dataTurns}
                        columns={columns}
                    />
                    <br />
                    <Button onClick={handleAddRecords} type="primary" style={{ marginBottom: 16 }}>
                        Thêm thu hoạch
                    </Button>
                </>
            ) : (
                <>
                    <Collapse onChange={onChange}>
                        {data?.map((item, index) => {
                            return (
                                <>
                                    <Panel
                                        header={`Thu hoạch đợt ${index + 1}`}
                                        key={index + 1}
                                        extra={
                                            <Space style={{ display: 'flex', justifyContent: 'end' }}>
                                                <Button type="primary" style={{ marginBottom: 16 }}>
                                                    Lưu
                                                </Button>
                                            </Space>
                                        }
                                    >
                                        {index === data.length - 1 ? (
                                            <>
                                                <Table
                                                    // components={components}
                                                    rowClassName={() => 'editable-row'}
                                                    bordered
                                                    pagination={false}
                                                    dataSource={dataTurns || []}
                                                    columns={columns}
                                                />
                                                <br />
                                                <Button
                                                    onClick={handleAddRecords}
                                                    type="primary"
                                                    style={{ marginBottom: 16 }}
                                                >
                                                    Thêm thu hoạch
                                                </Button>
                                            </>
                                        ) : (
                                            <Table
                                                // components={components}
                                                rowClassName={() => 'editable-row'}
                                                bordered
                                                pagination={false}
                                                dataSource={datas[index]?.turns || []}
                                                columns={columns}
                                            />
                                        )}
                                    </Panel>
                                </>
                            );
                        })}
                    </Collapse>
                </>
            )}
        </CardComponent>
    );
};

export default HarvestTable;
