import CardComponent from '@/components/CardComponent';
import IconAntd from '@/components/IconAntd';
import TableComponent from '@/components/TableComponent';
import { TYPE_FLOWER } from '@/contants';
import useCallContext from '@/hooks/useCallContext';
import { Notification, uuid } from '@/utils';
import { Button, Collapse, DatePicker, Form, Input, InputNumber, Modal, Select, SelectProps, Space, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Harvest, seasonsService } from '../services';
import RangerPicker from '@/components/RangerPicker';
import { DefaultSelectStyled } from '@/config/global.style';
import useWindowSize from '@/hooks/useWindowSize';
import { TAB_MOBLIE } from '@/config/theme';
import { IFilter } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { addArray, addItem } from '@/redux/slice/DataHarvestSlice';

const { Panel } = Collapse;
const EditableContext = React.createContext<FormInstance<any> | null>(null);
interface Item {
    key: string;
    name: string;
    age: string;
    address: string;
    harvestDate?: any;
    createdAt?: any;
    actualStart?: any;
}

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    inputType: 'number' | 'select' | 'date';
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}
let newArrActualDate: any;
const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    inputType,
    record,
    handleSave,
    ...restProps
}) => {
    const { id } = useParams();
    const [editing, setEditing] = useState(false);
    const { state } = useCallContext();
    const inputRef = useRef<any>(null);
    const form = useContext(EditableContext)!;
    const [data, setData] = React.useState<any[]>([]);
    const listUnit = async () => {
        const options: SelectProps['options'] = [];
        for (let i = 0; i < state?.unit?.length; ++i) {
            options.push({
                value: state?.unit[i].id,
                label: state?.unit[i].name,
            });
        }
        setData(options);
    };
    React.useEffect(() => {
        listUnit();
    }, [id]);
    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
        form.setFieldsValue({ harvestDate: moment(record?.harvestDate) });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {}
    };
    let childNode = children;
    let inputNode = null;
    switch (inputType) {
        case 'number':
            inputNode = (
                <InputNumber
                    ref={inputRef}
                    min={0}
                    max={100000000000}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={(value: any) => (value ? value.replace(/[^0-9]/g, '') : '')}
                    style={{ width: '90%' }}
                    onPressEnter={save}
                    onBlur={save}
                />
            );
            break;
        case 'select':
            inputNode = (
                <Select
                    allowClear={true}
                    ref={inputRef}
                    style={{ width: '90%' }}
                    onChange={save}
                    placeholder="Chọn đơn vị"
                    optionFilterProp="children"
                    options={data}
                />
            );
            break;
        case 'date':
            inputNode = (
                <DatePicker
                    format={'DD/MM/YYYY'}
                    placeholder="Chọn ngày thu hoạch"
                    style={{ width: '95%' }}
                    ref={inputRef}
                    onChange={save}
                    disabledDate={(date) => {
                        if (record?.createdAt) {
                            return date < moment(record?.actualStart).startOf('day');
                        }
                        return date < moment(record?.actualStart).startOf('day');
                        // return record?.harvestDate && date < moment(record?.harvestDate).startOf('day');
                    }}
                />
            );
            break;
        default:
            inputNode = <Input />;
            break;
    }

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `Vui lòng nhập ${title}.`,
                    },
                ]}
            >
                {inputNode}
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap" onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
    key: React.Key;
    id?: number;
    harvestDate: any;
    quantity: number;
    unitId: number;
    price?: number;
}
export const subtractDates = (date1: string, date2: string) => {
    const momentDate1 = moment(date1, 'DD/MM/YYYY');
    const momentDate2 = moment(date2, 'DD/MM/YYYY');

    const differenceInDays = momentDate2.diff(momentDate1, 'days');

    return differenceInDays;
};
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;
const initialFilterQuery = {};

const HarvestTab = ({ form, data, key, setDataHarvest }: any) => {
    const id = useParams();
    const { state } = useCallContext();
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [actualDate, setActualDate] = React.useState<any[]>([]);
    const [dataTurns, setDataTurns] = useState<any[]>([]);
    const [optionData, setOptionData] = React.useState<any[]>([]);
    const { width } = useWindowSize();
    const [count, setCount] = useState(2);
    const [isReloadData, setIsReloadData] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [unitErrors, setUnitErrors] = React.useState<any[]>([]);
    const [filterQuery, setFilterQuery] = React.useState(initialFilterQuery);
    const selectRef = useRef<any>(null);
    const dispatch = useDispatch();
    const dataHarvestFilter = useSelector((state: any) => state?.harvestDataReducer?.items);
    const [changingId, setChangingId] = React.useState<number>(-1);

    let previousMaxHarvestDate = moment('1900-01-01');
    const newStartDateArray = actualDate?.map((item, index) => {
        const maxHarvestDate = item?.turns?.reduce((max: any, turn: any) => {
            const turnHarvestDate = moment(turn?.harvestDate);
            return turnHarvestDate.isValid() && turnHarvestDate.isAfter(max) ? turnHarvestDate : max;
        }, moment('1900-01-01'));

        const startDate = index === 0 ? data?.data?.actualStart : previousMaxHarvestDate;
        previousMaxHarvestDate = maxHarvestDate;

        return startDate;
    });
    const newHarvestDate = actualDate?.map((item, index) => {
        const turns = item?.turns?.map((turn: any, turnIndex: number) => {
            return { ...turn, actualStart: moment(newStartDateArray[index]).toISOString() };
        });
        const harvestDates = turns?.map((turn: any) => moment(turn?.harvestDate));
        const minHarvestDate = harvestDates.length > 0 ? moment.min(harvestDates) : '';
        return minHarvestDate;
    });

    newArrActualDate = newStartDateArray;
    React.useEffect(() => {
        getDate();
    }, []);
    React.useEffect(() => {
        checkValidate();
    }, [dataSource]);
    React.useEffect(() => {
        listUnit();
    }, [id]);
    React.useEffect(() => {
        listHarvest();

        const index = dataSource?.length;
        if (data?.data?.flower?.type === TYPE_FLOWER.GROW_ONE) {
            setDataTurns(dataSource[0]?.turns);
        } else {
            setDataTurns(dataSource[index - 1]?.turns);
        }
    }, [id, key, isReloadData, selectedDate, filterQuery]);
    useEffect(() => {
        // Dispatch sau khi changingId được cập nhật
        dispatch(addArray({ newData: dataSource, targetId: changingId }));
    }, [dataSource, changingId]);
    const listHarvest = async () => {
        setLoading(true);

        try {
            const res = await seasonsService.getHarvest(Number(id?.id), { ...filterQuery });

            if (res.status) {
                let filteredData = res.data;

                const selectedStartDate = moment(selectedDate[0], 'DD/MM/YYYY');
                const selectedEndDate = moment(selectedDate[1], 'DD/MM/YYYY');

                // Lọc theo ngày nếu có ngày được chọn
                if (selectedStartDate.isValid() && selectedEndDate.isValid()) {
                    filteredData = filteredData.filter((item: any) =>
                        item.turns.some((turn: any) =>
                            moment(turn.harvestDate, 'DD/MM/YYYY').isBetween(
                                selectedStartDate,
                                selectedEndDate,
                                null,
                                '[]'
                            )
                        )
                    );
                }
                const index = filteredData?.length;
                setDataSource(filteredData);
                dispatch(addArray({ newData: filteredData, targetId: changingId }));
                if (data?.data?.flower?.type === TYPE_FLOWER.GROW_ONE) {
                    setDataTurns(filteredData?.[0]?.turns);
                } else {
                    setDataTurns(filteredData?.[index - 1]?.turns);
                }
            }
        } catch (error) {
            // Xử lý lỗi ở đây (nếu cần)
        } finally {
            setLoading(false);
        }
    };
    const getDate = async () => {
        setLoading(true);

        try {
            const res = await seasonsService.getHarvest(Number(id?.id), initialFilterQuery);

            if (res.status) {
                let filteredData = res.data;

                const selectedStartDate = moment(selectedDate[0], 'DD/MM/YYYY');
                const selectedEndDate = moment(selectedDate[1], 'DD/MM/YYYY');

                // Lọc theo ngày nếu có ngày được chọn
                if (selectedStartDate.isValid() && selectedEndDate.isValid()) {
                    filteredData = filteredData.filter((item: any) =>
                        item.turns.some((turn: any) =>
                            moment(turn.harvestDate, 'DD/MM/YYYY').isBetween(
                                selectedStartDate,
                                selectedEndDate,
                                null,
                                '[]'
                            )
                        )
                    );
                }

                const index = filteredData?.length;
                setActualDate(filteredData);
                if (data?.data?.flower?.type === TYPE_FLOWER.GROW_ONE) {
                    setDataTurns(filteredData?.[0]?.turns);
                } else {
                    setDataTurns(filteredData?.[index - 1]?.turns);
                }
            }
        } catch (error) {
            // Xử lý lỗi ở đây (nếu cần)
        } finally {
            setLoading(false);
        }
    };

    const checkValidate = () => {
        const arrValidate: any[] = [];
        for (let index = 0; index < dataSource?.length; index++) {
            const element = dataSource[index];
            const subArray: any = [];
            for (let i = 0; i < element?.turns?.length; i++) {
                subArray.push(null);
            }
            arrValidate.push(subArray);
        }

        for (let index = 0; index < dataSource?.length; index++) {
            const element = dataSource[index];
            const chilError = arrValidate?.[index] ? [...arrValidate[index]] : [];
            for (let idx = 0; idx < element?.turns?.length; ++idx) {
                const elm = element?.turns[idx];
                chilError[idx] = element?.turns[idx]?.unitId ? true : false;
            }
            arrValidate[index] = chilError;
            setUnitErrors(arrValidate);
        }
    };

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

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: 'STT',
            dataIndex: 'id',
            width: 80,
            render: (value: any, record: any, index: number) => ++index,
        },
        {
            title: 'Ngày thu hoạch',
            dataIndex: 'harvestDate',
            align: 'center',
            width: 200,
            editable: true,
            render: (value: any, record: any) => {
                return (
                    <DatePicker
                        style={{ width: '100%' }}
                        format={'DD/MM/YYYY'}
                        placeholder="Chọn ngày thu hoạch"
                        defaultValue={moment(value)}
                        disabledDate={(current: any) => {
                            // const turnsCreatedAt = moment(dataSource[0]?.turns?.createdAt).startOf('day');
                            const actualStart = moment(data?.data?.actualStart).startOf('day');
                            return current && current < actualStart;
                        }}
                    />
                );
            },
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            width: '20%',
            align: 'center',
            editable: true,
            render: (value: any, record: any, index: number) => (
                <InputNumber
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={(value: any) => (value ? value.replace(/[^0-9]/g, '') : '')}
                    style={{ width: '95%' }}
                    defaultValue={value}
                />
            ),
        },
        {
            title: 'Đơn vị',
            dataIndex: 'unitId',
            editable: true,
            align: 'center',
            width: '20%',
            render: (value: any, record: any, idx: number) => {
                const recordIndex = findRecordIndex(record?.id);

                return (
                    <>
                        <SelectStyled
                            ref={selectRef}
                            style={{ width: '95%' }}
                            placeholder="Chọn đơn vị"
                            defaultValue={value || undefined}
                            options={optionData}
                        />
                        {!unitErrors?.[recordIndex]?.[idx] && (
                            <span style={{ color: 'red' }}>Vui lòng nhập đơn vị</span>
                        )}
                    </>
                );
            },
        },
        {
            title: 'Giá bán/Đơn vị',
            dataIndex: 'price',
            editable: true,
            align: 'center',
            width: '20%',
            render: (value: any, record: any, index: number) => (
                <InputNumber
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={(value: any) => (value ? value.replace(/[^0-9]/g, '') : '')}
                    style={{ width: '95%' }}
                    defaultValue={value}
                />
            ),
        },
    ];

    const handleAddRecords = async (index: number) => {
        const currentTime = moment();

        // Chuyển đổi thời gian hiện tại sang định dạng "2024-02-21T00:00:00.000Z"
        const formattedTime = currentTime.toISOString();
        const newTurn: any = {
            key: count,
            harvestDate: formattedTime,
            quantity: 1,
            unitId: undefined,
            price: 0,
            id: uuid(),
        };
        setChangingId(dataSource[index]?.id);
        const updatedData = dataSource?.map((item, idx) => {
            if (idx === index) {
                // Thêm bản ghi mới vào mảng `expenses` của đối tượng tại chỉ số tương ứng
                return {
                    ...item,
                    turns: [...item.turns, newTurn],
                };
            }
            return item;
        });

        setDataSource(updatedData);
        setActualDate(updatedData);
        // checkValidate();
    };

    const findRecordIndex = (id: any) => {
        const index = dataSource.findIndex((record: any) => {
            const expenses = record.turns || [];
            return expenses.some((expense: any) => expense.id === id);
        });

        return index;
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns: any = defaultColumns?.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                inputType:
                    col.dataIndex === 'unitId'
                        ? 'select'
                        : col.dataIndex === 'quantity' || col.dataIndex === 'price'
                        ? 'number'
                        : 'date',
                title: col.title,
                handleSave,
            }),
        };
    });
    const handleDelete = async (id: string | number) => {
        if (typeof id === 'number') {
            await seasonsService.deleteHarvest(id).then((res) => {
                if (res.status) {
                    Notification('success', 'Xóa đợt thu hoạch thành công');
                    setIsReloadData(!isReloadData);
                }
            });
            setChangingId(id);
        } else {
            // const newData = dataTurns?.filter((item: { id: string | number }) => item.id !== id);
            // setDataTurns(newData);
            const newArr = dataSource?.map((item: any) => {
                const foundIndex = item?.turns.findIndex((turns: { id: string }) => turns?.id === id);
                let newTurns = item?.turns;
                if (foundIndex !== -1) {
                    if (Array.isArray(item.turns)) {
                        // item?.turns?.splice(foundIndex, 1);
                        newTurns = item?.turns?.filter((_: any, index: number) => index !== foundIndex);
                    }
                    Notification('success', 'Xóa đợt thu hoạch thành công');
                }
                setChangingId(Number(turns?.id));
                return { ...item, turns: newTurns };
            });
            setDataSource(newArr);
            setActualDate(newArr);
        }
    };

    const handleSave = (row: DataType) => {
        const recordIndex = findRecordIndex(row.id);
        const newData = [...dataSource];
        const updatedData = newData?.map((item, idx) => {
            // const newData = [...data];
            if (idx === recordIndex) {
                const updatedExpenses = item?.turns?.map((expense: any) => {
                    if (expense.id === row.id) {
                        setChangingId(Number(item?.id));

                        // Cập nhật các thuộc tính của bản ghi
                        return {
                            ...expense,
                            ...row,
                        };
                    }
                    return expense;
                });

                // Trả về đối tượng mới với mảng `expenses` đã được cập nhật
                return {
                    ...item,
                    turns: updatedExpenses,
                };
            }
            return item;
        });
        setDataSource(updatedData);
        setActualDate(updatedData);
    };
    const onChange = (key: string | string[]) => {};

    // start search
    const returnFilter = React.useCallback(
        (filter: IFilter) => {
            // setPage(1);
            setFilterQuery({ ...filterQuery, ...filter });
        },
        [filterQuery]
    );
    //end search

    const handleSubmit = async (index: number) => {
        setLoading(true);
        const { id, turns, seasonId } = dataSource[index];
        // Tạo một mảng mới để chứa các mục mới được chuyển đổi
        const convertedTurns: Harvest[] = [];

        // Lặp qua mỗi mục trong mảng "turns" của phần tử hiện tại
        for (const turn of turns) {
            const { id: turnId, harvestDate, quantity, unitId, price } = turn;
            if (typeof turnId === 'number' && !isNaN(turnId)) {
                // Tạo mục mới theo cấu trúc mong muốn
                const convertedTurn: Harvest = {
                    harvestId: id,
                    turnId: turnId,
                    harvestDate: moment(harvestDate).format('YYYY-MM-DD'),
                    quantity,
                    unitId,
                    price,
                };
                convertedTurns.push(convertedTurn);
            } else {
                const convertedTurn: Harvest = {
                    harvestId: id,
                    harvestDate: moment(harvestDate).format('YYYY-MM-DD'),
                    quantity,
                    unitId,
                    price,
                };
                convertedTurns.push(convertedTurn);
            }
            // Thêm mục mới vào mảng chứa các mục đã chuyển đổi
        }

        // Tạo mục mới cho phần tử hiện tại và thêm mảng chứa các mục đã chuyển đổi
        const convertedItem: any = {
            turns: convertedTurns,
            harvestId: id,
            seasonId: seasonId,
        };
        const hasFalse = unitErrors[index]?.some((subArray: any) => subArray === false);
        if (hasFalse) {
            setLoading(false);
            Notification('warning', 'Vui lòng nhập đầy đủ thu hoạch!');
        } else {
            await seasonsService
                .updateHarvest(convertedItem)
                .then((res) => {
                    if (res?.status) {
                        Notification('success', 'Cập nhật thu hoạch thành công');
                        setIsReloadData(!isReloadData);
                    }
                })
                .finally(() => setLoading(false));
        }
    };

    const turns = dataSource[0]?.turns?.map((turn: any) => {
        return { ...turn, actualStart: moment(dataSource[0]?.startPlanting).toISOString() };
    });
    turns?.sort((a: any, b: any) => {
        const dateA = new Date(a.harvestDate);
        const dateB = new Date(b.harvestDate);

        if (dateA > dateB) {
            return -1; // Nếu dateA lớn hơn dateB, đẩy a lên trước b trong mảng
        } else if (dateA < dateB) {
            return 1; // Nếu dateA nhỏ hơn dateB, đẩy b lên trước a trong mảng
        } else {
            return 0; // Nếu bằng nhau, không thay đổi vị trí
        }
    });

    return data?.data?.flower?.type === TYPE_FLOWER.GROW_ONE ? (
        <CardComponent>
            <>
                <SpaceStyled
                    style={
                        width <= TAB_MOBLIE
                            ? {
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  width: '100%',
                              }
                            : { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }
                    }
                >
                    <SpaceStyled
                        style={
                            width <= TAB_MOBLIE
                                ? { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }
                                : { display: 'flex', width: '100%' }
                        }
                    >
                        <DefaultSelectStyled
                            placeholder="Loại đơn vị"
                            allowClear
                            style={{ width: '100%' }}
                            defaultValue={null}
                            onClear={() => {
                                setFilterQuery(initialFilterQuery);
                            }}
                            onChange={(item: any) => {
                                if (item === undefined) {
                                    returnFilter({ unitId: item, harvestId: undefined });
                                } else returnFilter({ unitId: item, harvestId: dataSource[0]?.id });
                            }}
                            options={optionData}
                        />
                        <RangerPicker
                            name="dateFilter"
                            onChange={(name: string, value: string) => {
                                {
                                    value.split(',')[0] === '' && value.split(',')[1] === undefined
                                        ? returnFilter({
                                              startDate: value.split(',')[0],
                                              endDate: value.split(',')[1],
                                              harvestId: undefined,
                                          })
                                        : returnFilter({
                                              startDate: value.split(',')[0],
                                              endDate: value.split(',')[1],
                                              harvestId: dataSource[0]?.id,
                                          });
                                }
                            }}
                            tooltipTitle="Lọc theo ngày thu hoạch"
                            // defaultValue={params?.fromDate ? [moment(params?.createFrom), moment(params?.toDate)] : null}
                        />
                    </SpaceStyled>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <Button onClick={() => handleAddRecords(0)} type="primary" style={{ marginBottom: 16 }}>
                            Thêm thu hoạch
                        </Button>
                        <Button type="primary" style={{ marginBottom: 16 }} onClick={() => handleSubmit(0)}>
                            Lưu
                        </Button>
                    </div>
                </SpaceStyled>
                <Space
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        flexDirection: 'column',
                    }}
                >
                    <Space style={width <= TAB_MOBLIE ? { display: 'flex', flexDirection: 'column' } : {}}>
                        <strong>Bắt đầu trồng: {moment(dataSource[0]?.startPlanting).format('DD/MM/YYYY')}.</strong>
                        <strong>
                            Bắt đầu thu hoạch:{' '}
                            {dataSource[0]?.turns
                                ? moment.isMoment(newHarvestDate[0])
                                    ? newHarvestDate[0]?.format('DD/MM/YYYY')
                                    : '---'
                                : '---'}
                        </strong>
                        <strong>
                            Tổng:{' '}
                            {dataSource[0]?.turns
                                ? moment.isMoment(newHarvestDate[0])
                                    ? subtractDates(
                                          moment(dataSource[0]?.startPlanting).format('DD/MM/YYYY'),
                                          newHarvestDate[0]?.format('DD/MM/YYYY')
                                      ) + 1
                                    : '---'
                                : '---'}{' '}
                            Ngày.
                        </strong>
                    </Space>
                </Space>
                <TableComponent
                    loading={loading}
                    components={components}
                    rowClassName={() => 'editable-row'}
                    rowSelect={false}
                    dataSource={turns}
                    columns={[
                        ...columns,
                        {
                            title: 'Thao tác',
                            dataIndex: 'operation',
                            align: 'center',
                            width: '80px',
                            render: (_: any, record: any) => (
                                <Button
                                    onClick={() => {
                                        Modal.confirm({
                                            title: 'Xóa đợt thu hoạch',
                                            content: 'Bạn có chắc chắn muốn xoá đợt thu hoạch này?',
                                            onOk: () => handleDelete(record.id),
                                        });
                                    }}
                                    disabled={
                                        data?.data?.status === 'completed' && data?.data?.flower?.type !== 'perennial'
                                    }
                                    type="link"
                                    icon={<IconAntd icon="DeleteOutlined" />}
                                />
                            ),
                        },
                    ]}
                />
            </>

            <br />
        </CardComponent>
    ) : (
        <Collapse onChange={onChange} defaultActiveKey={[1, 2, 3, 4, 5, 6]}>
            {dataSource?.map((item: any, index: number) => {
                const maxHarvestDate = item?.turns?.reduce((max: any, turn: any) => {
                    const turnHarvestDate = moment(turn?.harvestDate);
                    return turnHarvestDate?.isValid() && turnHarvestDate?.isAfter(max) ? turnHarvestDate : max;
                }, moment('1900-01-01'));
                previousMaxHarvestDate = maxHarvestDate;
                const turns = item?.turns?.map((turn: any, turnIndex: number) => {
                    return { ...turn, actualStart: moment(newStartDateArray[index]).toISOString() };
                });
                turns?.sort((a: any, b: any) => {
                    const dateA = new Date(a.harvestDate);
                    const dateB = new Date(b.harvestDate);

                    if (dateA > dateB) {
                        return -1; // Nếu dateA lớn hơn dateB, đẩy a lên trước b trong mảng
                    } else if (dateA < dateB) {
                        return 1; // Nếu dateA nhỏ hơn dateB, đẩy b lên trước a trong mảng
                    } else {
                        return 0; // Nếu bằng nhau, không thay đổi vị trí
                    }
                });
                return (
                    <>
                        <Panel
                            header={`Thu hoạch đợt ${index + 1}`}
                            key={index + 1}
                            extra={
                                <Space
                                    style={
                                        width <= TAB_MOBLIE
                                            ? {
                                                  display: 'flex',
                                                  flexDirection: 'column',
                                                  justifyContent: 'end',
                                                  alignItems: 'flex-end',
                                                  textAlign: 'end',
                                              }
                                            : {}
                                    }
                                >
                                    <strong>
                                        Bắt đầu trồng:{' '}
                                        {index === 0
                                            ? moment(data?.data?.actualStart).format('DD/MM/YYYY')
                                            : item?.turns
                                            ? newStartDateArray[index]?.format('DD/MM/YYYY')
                                            : ''}
                                        .
                                    </strong>
                                    <strong>
                                        Bắt đầu thu hoạch:{' '}
                                        {item?.turns
                                            ? moment.isMoment(newHarvestDate[index])
                                                ? moment(newHarvestDate[index]).format('DD/MM/YYYY')
                                                : '---'
                                            : '---'}
                                        .
                                    </strong>
                                    <strong>
                                        Tổng:{' '}
                                        {item?.turns
                                            ? moment.isMoment(newHarvestDate[index])
                                                ? index === 0
                                                    ? subtractDates(
                                                          moment(data?.data?.actualStart).format('DD/MM/YYYY'),
                                                          moment(newHarvestDate[index]).format('DD/MM/YYYY')
                                                      ) + 1
                                                    : subtractDates(
                                                          newStartDateArray[index]?.format('DD/MM/YYYY'),
                                                          moment(newHarvestDate[index]).format('DD/MM/YYYY')
                                                      ) + 1
                                                : '---'
                                            : '---'}{' '}
                                        Ngày.
                                    </strong>
                                </Space>
                            }
                        >
                            <SpaceStyled
                                style={
                                    width <= TAB_MOBLIE
                                        ? { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }
                                        : { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
                                }
                            >
                                <SpaceStyled
                                    size="middle"
                                    style={
                                        width <= TAB_MOBLIE
                                            ? {
                                                  display: 'flex',
                                                  flexDirection: 'column',
                                                  justifyContent: 'space-between',
                                                  width: '100%',
                                              }
                                            : { width: '100%', display: 'flex', flexDirection: 'row' }
                                    }
                                >
                                    <DefaultSelectStyled
                                        placeholder="Loại đơn vị"
                                        allowClear
                                        style={{ width: '100%' }}
                                        defaultValue={null}
                                        onChange={(it: any) => {
                                            setChangingId(item?.id);
                                            if (it === undefined) {
                                                returnFilter({ unitId: it, harvestId: undefined });
                                            } else returnFilter({ unitId: it, harvestId: item?.id });
                                        }}
                                        options={optionData}
                                    />
                                    <RangerPicker
                                        tooltipTitle="Lọc theo ngày thu hoạch"
                                        name="dateFilter"
                                        onChange={(name: string, value: string) => {
                                            setChangingId(item?.id);
                                            {
                                                value.split(',')[0] === '' && value.split(',')[1] === undefined
                                                    ? returnFilter({
                                                          startDate: value.split(',')[0],
                                                          endDate: value.split(',')[1],
                                                          harvestId: undefined,
                                                      })
                                                    : returnFilter({
                                                          startDate: value.split(',')[0],
                                                          endDate: value.split(',')[1],
                                                          harvestId: item?.id,
                                                      });
                                            }
                                        }}
                                        // defaultValue={params?.fromDate ? [moment(params?.createFrom), moment(params?.toDate)] : null}
                                    />
                                </SpaceStyled>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        onClick={() => handleAddRecords(index)}
                                        type="primary"
                                        style={{ marginBottom: 16 }}
                                    >
                                        Thêm thu hoạch
                                    </Button>
                                    <Button
                                        onClick={() => handleSubmit(index)}
                                        type="primary"
                                        style={{ marginBottom: 16 }}
                                    >
                                        Lưu
                                    </Button>
                                </div>
                            </SpaceStyled>
                            <TableComponent
                                loading={loading}
                                components={components}
                                rowClassName={() => 'editable-row'}
                                dataSource={item?.turns?.length ? turns : []}
                                rowSelect={false}
                                columns={[
                                    ...columns,
                                    index === dataSource.length - 1
                                        ? {
                                              title: 'Thao tác',
                                              dataIndex: 'operation',
                                              align: 'center',
                                              width: '80px',
                                              render: (_: any, record: any) => (
                                                  <Button
                                                      onClick={() => {
                                                          Modal.confirm({
                                                              title: 'Xóa đợt thu hoạch',
                                                              content: 'Bạn có chắc chắn muốn xoá đợt thu hoạch này?',
                                                              onOk: () => handleDelete(record.id),
                                                          });
                                                      }}
                                                      disabled={
                                                          data?.data?.status === 'completed' &&
                                                          data?.data?.flower?.type !== 'perennial'
                                                      }
                                                      type="link"
                                                      icon={<IconAntd icon="DeleteOutlined" />}
                                                  />
                                              ),
                                          }
                                        : { title: 'Thao tác', dataIndex: 'operation', width: '80px' },
                                ]}
                            />
                            <br />
                        </Panel>
                    </>
                );
            })}
        </Collapse>
    );
};

export default HarvestTab;

const TableStyle = styled(Table)`
    .editable-row .editable-cell-value-wrap {
        padding: 15px 8px;
        border: 1px solid #d9d9d9;
        border-radius: 8px;
    }
`;
const SelectStyled = styled(Select)`
    & .ant-select-selection-item {
        color: black;
    }
    & .ant-select-show-arrow .ant-select-selector {
        border: none !important;
    }
`;
const SpaceStyled = styled(Space)`
    & .ant-space-item {
        width: 100%;
    }
    @media (min-width: 768px) {
        /* Điều chỉnh kích thước khi màn hình có độ rộng từ 768px trở lên */
        & .ant-space-item {
            width: 100%; /* Đặt kích thước mong muốn cho SpaceStyled trên web */
        }
    }
`;
