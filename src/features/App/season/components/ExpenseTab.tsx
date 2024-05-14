import IconAntd from '@/components/IconAntd';
import TableComponent from '@/components/TableComponent';
import { TYPE_FLOWER } from '@/contants';
import useCallContext from '@/hooks/useCallContext';
import { Notification, currencyFormat, uuid } from '@/utils';
import { Button, Collapse, DatePicker, Form, Input, InputNumber, Modal, Select, SelectProps, Space } from 'antd';
import { FormInstance } from 'antd/es/form';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { seasonsService } from '../services';
import { DefaultSelectStyled } from '@/config/global.style';
import RangerPicker from '@/components/RangerPicker';
import FilterExpense from './FilterExpense';
import { IFilter } from '@/types';
import { TAB_MOBLIE } from '@/config/theme';
import useWindowSize from '@/hooks/useWindowSize';
import { useDispatch, useSelector } from 'react-redux';
import { addArray } from '@/redux/slice/DataExpensiveSlice';
const { Panel } = Collapse;
const EditableContext = React.createContext<FormInstance<any> | null>(null);
interface Item {
    id: any;
    type: any;
    unitId: number | null;
    unitPrice: number;
    amount: number;
    totalPrice: number;
    editTime: any;
    createdAt?: any;
    content?: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editable: boolean;
    dataIndex: keyof Item;
    title: any;
    inputType: 'number' | 'text' | 'selectType' | 'selectUnit' | 'date';
    record: Item;
    index: number;
    children: React.ReactNode;
    width?: string;
    handleSave: (record: Item) => void;
    dataHarvest?: any;
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
const optionDataType = [
    {
        value: 'land_rents',
        label: 'Chi phí thuê đất',
    },
    {
        value: 'labor_costs',
        label: 'Chi phí nhân công',
    },
    {
        value: 'fertilizers_costs',
        label: 'Chi phí phân bón',
    },
    {
        value: 'pakaging_costs',
        label: 'Chi phí đóng gói',
        disabled: true,
    },
    {
        value: 'another_costs',
        label: 'Chi phí khác',
    },
    {
        value: 'cultivars_costs',
        label: 'Chi phí hạt giống',
    },
    {
        value: 'pesticides_costs',
        label: 'Chi phí thuốc trừ sâu',
    },
];
const EditableCell: React.FC<EditableCellProps> = ({
    editable,
    dataIndex,
    title,
    inputType,
    record,
    index,
    width,
    children,
    handleSave,
    dataHarvest,
    ...restProps
}) => {
    const { id } = useParams();
    const { state } = useCallContext();
    const inputRef = React.useRef<any>(null);
    const form = useContext(EditableContext)!;
    const [editing, setEditing] = useState(false);
    const [data, setData] = React.useState<any[]>([]);
    const listUnit = async () => {
        const options: SelectProps['options'] = [];
        for (let i = 0; i < state?.unit?.length; ++i) {
            options.push({
                value: state?.unit[i]?.id,
                label: state?.unit[i]?.name,
            });
        }
        setData(options);
    };
    React.useEffect(() => {
        listUnit();
    }, [id]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record?.[dataIndex] });
        form.setFieldsValue({ editTime: moment(record?.editTime) });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values, createdAt: moment() });
        } catch (errInfo) {}
    };

    let childNode = children;
    let inputNode = null;
    switch (inputType) {
        case 'number':
            inputNode = (
                <InputNumber
                    ref={inputRef}
                    style={{ width: '150px' }}
                    min={0}
                    max={100000000000}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={(value: any) => (value ? value.replace(/[^0-9]/g, '') : '')}
                    onPressEnter={save}
                    onBlur={save}
                />
            );
            break;
        case 'selectUnit':
            inputNode = (
                <Select
                    ref={inputRef}
                    style={{ width: '150px', color: 'black' }}
                    onChange={save}
                    placeholder="Chọn đơn vị"
                    optionFilterProp="children"
                    options={data}
                    disabled={record.type === 'pakaging_costs' ? true : false}
                />
            );
            break;
        case 'date':
            inputNode = (
                <DatePicker
                    format="DD/MM/YYYY"
                    allowClear={false}
                    style={{ width: '150px' }}
                    ref={inputRef}
                    onChange={save}
                />
            );
            break;
        case 'selectType':
            inputNode = (
                <Select
                    disabled={record.type === 'pakaging_costs' ? true : false}
                    ref={inputRef}
                    style={{ width: '150px', color: 'black' }}
                    placeholder="Chọn loại chi phí"
                    onChange={save}
                    options={[
                        {
                            value: 'land_rents',
                            label: 'Chi phí thuê đất',
                        },
                        {
                            value: 'labor_costs',
                            label: 'Chi phí nhân công',
                        },
                        {
                            value: 'fertilizers_costs',
                            label: 'Chi phí phân bón',
                        },
                        {
                            value: 'pakaging_costs',
                            label: 'Chi phí đóng gói',
                            disabled: true,
                        },
                        {
                            value: 'another_costs',
                            label: 'Chi phí khác',
                        },
                        {
                            value: 'cultivars_costs',
                            label: 'Chi phí hạt giống',
                        },
                        {
                            value: 'pesticides_costs',
                            label: 'Chi phí thuốc trừ sâu',
                        },
                    ]}
                />
            );
            break;
        case 'text':
            inputNode = (
                <Input.TextArea
                    ref={inputRef}
                    style={{ width: '200px', whiteSpace: 'pre-wrap' }}
                    onPressEnter={save}
                    onBlur={save}
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
                style={{ margin: '0 10px', textAlign: 'center' }}
                name={dataIndex}
                normalize={(value: any) => (dataIndex === 'content' ? value?.trimStart() : value)}
                rules={[
                    {
                        required: dataIndex === 'content' ? false : true,
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
const initialFilterQuery = {};
const ExpenseTab = ({ refetch, dataHarvest, key }: any) => {
    const [form] = Form.useForm();
    const { id } = useParams();
    const [data, setData] = useState<any[]>([]);
    const [dataUploads, setDataUpload] = useState<any>();
    const [optionData, setOptionData] = React.useState<any[]>([]);
    const { state } = useCallContext();
    const [isRefetch, setIsRefetch] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [typeErrors, setTypeError] = React.useState<any[]>([]);
    const [unitErrors, setUnitErrors] = React.useState<any[]>([]);
    const { width } = useWindowSize();
    const [changingId, setChangingId] = React.useState<number>(-1);
    const [filterQuery, setFilterQuery] = React.useState(initialFilterQuery);
    const [harvestIds, setHarvestIds] = React.useState<any[]>([]);
    const dispatch = useDispatch();
    const dataExpenseFilter = useSelector((state: any) => state?.ExpenseDataReducer?.items);

    const getDataExpenes = async () => {
        setLoading(true);
        try {
            await seasonsService.getExpensesAll(Number(id), { page: 1, ...filterQuery }).then((res: any) => {
                if (res.status) {
                    const maxPeriodNumber = res.data?.harvests?.[res.data?.harvests?.length - 1]?.periodNumber || 0;
                    const groupedExpenses: any[] = Array.from({ length: maxPeriodNumber }, () => ({ expenses: [] }));
                    res?.data?.expenses?.forEach((curr: any) => {
                        const newIndex = curr?.harvest?.periodNumber - 1;
                        if (newIndex >= 0 && newIndex < groupedExpenses?.length) {
                            groupedExpenses[newIndex]?.expenses?.push(curr);
                        }
                    });
                    setHarvestIds(res.data?.harvests);
                    setData(groupedExpenses);
                    dispatch(addArray({ newData: data, targetId: changingId }));
                }
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    React.useEffect(() => {
        getDataExpenes();
    }, [id, isRefetch, key, filterQuery]);
    const handleDelete = async (id: number | string) => {
        const idx = findRecordIndex(id);
        if (typeof id === 'number') {
            await seasonsService.deleteExpenses(Number(id)).then((res) => {
                if (res.status) {
                    setIsRefetch(!isRefetch);
                    Notification('success', 'Xoá chi phí thành công');
                }
            });
        } else {
            const updatedData = data.map((item) => {
                const updatedExpenses = item.expenses.filter((expense: any) => expense.id !== id);
                return { ...item, expenses: updatedExpenses };
            });
            setData(updatedData);
        }
    };

    const listUnit = async () => {
        const options: SelectProps['options'] = [];
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
    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            width: 80,
            render: (value: any, record: any, index: number) => ++index,
        },
        {
            title: 'Loại chi phí',
            dataIndex: 'type',
            align: 'center',
            width: 200,
            editable: true,
            render: (value: any, record: any, index: number) => {
                const recordIndex = findRecordIndex(record?.id);
                return (
                    <>
                        <SelectStyled
                            disabled={value === 'pakaging_costs' ? true : false}
                            placeholder="Chọn loại chi phí"
                            defaultValue={value}
                            style={{ width: '150px' }}
                            options={optionDataType}
                        />
                        {!typeErrors?.[recordIndex]?.[index] && (
                            <span style={{ color: 'red' }}>Vui lòng nhập loại chi phí</span>
                        )}
                    </>
                );
            },
        },
        {
            title: 'Đơn vị',
            dataIndex: 'unitId',
            align: 'center',
            editable: true,
            width: 200,
            render: (value: any, record: any, index: number) => {
                const recordIndex = findRecordIndex(record?.id);
                return (
                    <>
                        <SelectStyled
                            disabled={record?.type === 'pakaging_costs' ? true : false}
                            style={{ width: '150px' }}
                            placeholder="Chọn đơn vị"
                            defaultValue={Number(value) || undefined}
                            options={optionData}
                        />
                        {!unitErrors?.[recordIndex]?.[index] && (
                            <span style={{ color: 'red' }}>Vui lòng nhập đơn vị</span>
                        )}
                    </>
                );
            },
        },
        {
            title: 'Đơn giá(VNĐ)',
            dataIndex: 'unitPrice',
            align: 'center',
            editable: true,
            width: 200,
            render: (value: any, record: any, index: number) => (
                <InputNumber
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={(value: any) => (value ? value.replace(/[^0-9]/g, '') : '')}
                    style={{ width: '150px', color: 'black' }}
                    defaultValue={value}
                />
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'amount',
            align: 'center',
            editable: true,
            width: 200,
            render: (value: any, record: any, index: number) => (
                <InputNumber
                    disabled={record?.type === 'pakaging_costs' ? true : false}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={(value: any) => (value ? value.replace(/[^0-9]/g, '') : '')}
                    defaultValue={value}
                    style={{ width: '150px', color: 'black' }}
                />
            ),
        },
        {
            title: 'Thành tiền(VNĐ)',
            dataIndex: 'totalPrice',
            align: 'center',
            width: '200px',
            render: (value: any, record: any, index: number) => currencyFormat(record.amount * record.unitPrice),
        },
        {
            title: 'Ngày phát sinh',
            dataIndex: 'editTime',
            align: 'center',
            editable: true,
            width: 200,
            render: (value: any, record: any, index: number) => {
                const defaultValue = moment(value);
                return (
                    <DatePicker
                        allowClear={false}
                        format="DD/MM/YYYY"
                        style={{ width: '150px' }}
                        defaultValue={defaultValue}
                    />
                );
            },
        },
        {
            title: 'Thời gian cập nhật',
            dataIndex: 'createdAt',
            align: 'center',
            width: 200,
            render: (value: any, record: any, index: number) =>
                value ? moment(value)?.format('HH:mm DD/MM/YYYY') : '',
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            editable: true,
            width: 200,
            render: (value: any, record: any, index: number) =>
                value || <Input.TextArea style={{ width: '200px', whiteSpace: 'pre-wrap' }} />,
        },
    ];
    const findRecordIndex = (id: any) => {
        const index = data.findIndex((record) => {
            const expenses = record.expenses || [];
            return expenses.some((expense: any) => expense.id === id);
        });

        return index;
    };
    const handleSave = (row: Item) => {
        const recordIndex = findRecordIndex(row.id);
        const newData = [...data];

        const updatedData = newData.map((item, idx) => {
            // const newData = [...data];
            if (idx === recordIndex) {
                const updatedExpenses = item?.expenses?.map((expense: any) => {
                    if (expense.id === row.id) {
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
                    expenses: updatedExpenses,
                };
            }
            return item;
        });

        setData(updatedData);
    };
    const formatData = (data: any, index: number) => {
        const classifiedData: any = {};
        // Lặp qua từng đối tượng trong mảng data
        data[index]?.expenses?.forEach((item: { type: string }) => {
            const type = item.type;
            // Nếu mảng phân loại dựa trên type chưa tồn tại, tạo một mảng mới
            if (!classifiedData[type]) {
                classifiedData[type] = [];
            }
            // Thêm đối tượng vào mảng phân loại tương ứng
            classifiedData[type].push(item);
        });
        setDataUpload(classifiedData);
    };

    const mergedColumns: any = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item, dataHarvest: any) => ({
                record,
                inputType:
                    col.dataIndex === 'unitPrice' || col.dataIndex === 'amount'
                        ? 'number'
                        : col.dataIndex === 'type'
                        ? 'selectType'
                        : col.dataIndex === 'content'
                        ? 'text'
                        : col.dataIndex === 'unitId'
                        ? 'selectUnit'
                        : 'date',
                dataIndex: col.dataIndex,
                title: col.title,
                align: col.align,
                editable: col.editable,
                width: col.width,
                handleSave,
                dataHarvest,
            }),
        };
    });
    const handleAdd = (index: number) => {
        const newData: Item = {
            id: uuid(),
            type: null,
            unitId: null,
            unitPrice: 1,
            amount: 1,
            totalPrice: 1,
            editTime: moment(),
            createdAt: moment(),
            content: '',
        };

        const updatedData = data?.map((item, idx) => {
            if (idx === index) {
                // Thêm bản ghi mới vào mảng `expenses` của đối tượng tại chỉ số tương ứng
                return {
                    ...item,
                    expenses: [...item.expenses, newData],
                };
            }
            return item;
        });
        setData(updatedData);
    };
    const checkValidate = () => {
        const arrValidate: any[] = [];
        const typeValidate: any[] = [];
        for (let index = 0; index < data?.length; index++) {
            const element = data[index];
            const subArray: any = [];
            for (let i = 0; i < element?.expenses?.length; i++) {
                subArray.push(null);
            }
            arrValidate.push(subArray);
            typeValidate.push(subArray);
        }

        for (let index = 0; index < data?.length; index++) {
            const element = data[index];
            const chilError = arrValidate?.[index] ? [...arrValidate[index]] : [];
            const typeError = typeValidate?.[index] ? [...typeValidate[index]] : [];
            for (let idx = 0; idx < element?.expenses?.length; ++idx) {
                // const elm = element?.expenses[idx];
                chilError[idx] = element?.expenses[idx]?.unitId ? true : false;
                typeError[idx] = element?.expenses[idx]?.type ? true : false;
            }
            arrValidate[index] = chilError;
            typeValidate[index] = typeError;
            setUnitErrors(arrValidate);
            setTypeError(typeValidate);
        }
    };

    React.useEffect(() => {
        checkValidate();
    }, [data]);

    const handleSubmit = async (harvestId: number, seasonId: number, index: number) => {
        // form.validateFields().then((values) => {
        // formatData(data,index);
        setLoading(true);
        const dataUpload: any = {};
        // Lặp qua từng đối tượng trong mảng data
        data[index]?.expenses?.forEach((item: { type: string }, idx: number) => {
            const type = item.type;
            if (!dataUpload[type]) {
                dataUpload[type] = [];
            }
            dataUpload[type].push(item);
        });

        const dataUploladExpenses: any = {
            harvestId: Number(harvestId),
            seasonId: Number(seasonId),
            anotherCosts:
                dataUpload?.another_costs?.length &&
                dataUpload?.another_costs?.map((obj: any) => ({
                    expenseId: typeof obj.id === 'number' ? obj.id : undefined,
                    type: obj.type || 'another_costs',
                    unitId: obj.unitId,
                    unitPrice: obj.unitPrice,
                    amount: obj.amount,
                    totalPrice: obj.unitPrice * obj.amount,
                    editTime: moment(obj.editTime).format('YYYY-MM-DD HH:mm:ss'),
                    content: obj.content,
                    createdAt: obj.createdAt ? moment(obj.createdAt).format('YYYY-MM-DD HH:mm:ss') : null,
                })),
            landRents:
                dataUpload?.land_rents?.length &&
                dataUpload.land_rents?.map((obj: any) => ({
                    expenseId: typeof obj.id === 'number' ? obj.id : undefined,
                    type: obj.type || 'land_rents',
                    unitId: obj.unitId,
                    unitPrice: obj.unitPrice,
                    amount: obj.amount,
                    totalPrice: obj.unitPrice * obj.amount,
                    content: obj.content,
                    editTime: moment(obj.editTime).format('YYYY-MM-DD HH:mm:ss'),
                    createdAt: obj.createdAt ? moment(obj.createdAt).format('YYYY-MM-DD HH:mm:ss') : null,
                })),
            laborCosts:
                dataUpload?.labor_costs?.length &&
                dataUpload.labor_costs?.map((obj: any) => ({
                    expenseId: typeof obj.id === 'number' ? obj.id : undefined,
                    type: obj.type || 'labor_costs',
                    unitId: obj.unitId,
                    unitPrice: obj.unitPrice,
                    amount: obj.amount,
                    totalPrice: obj.unitPrice * obj.amount,
                    content: obj.content,
                    editTime: moment(obj.editTime).format('YYYY-MM-DD HH:mm:ss'),
                    createdAt: obj.createdAt ? moment(obj.createdAt).format('YYYY-MM-DD HH:mm:ss') : null,
                })),
            pakagingCosts:
                dataUpload?.pakaging_costs?.length &&
                dataUpload.pakaging_costs?.map((obj: any) => ({
                    expenseId: typeof obj.id === 'number' ? obj.id : undefined,
                    type: obj.type || 'pakaging_costs',
                    unitId: obj.unitId,
                    unitPrice: obj.unitPrice,
                    amount: obj.amount,
                    totalPrice: obj.unitPrice * obj.amount,
                    content: obj.content,
                    editTime: moment(obj.editTime).format('YYYY-MM-DD HH:mm:ss'),
                    createdAt: obj.createdAt ? moment(obj.createdAt).format('YYYY-MM-DD HH:mm:ss') : null,
                })),
            cultivarsCosts:
                dataUpload?.cultivars_costs?.length &&
                dataUpload.cultivars_costs?.map((obj: any) => ({
                    expenseId: typeof obj.id === 'number' ? obj.id : undefined,
                    type: obj.type || 'cultivars_costs',
                    unitId: obj.unitId,
                    unitPrice: obj.unitPrice,
                    amount: obj.amount,
                    totalPrice: obj.unitPrice * obj.amount,
                    content: obj.content,
                    editTime: moment(obj.editTime).format('YYYY-MM-DD HH:mm:ss'),
                    createdAt: obj.createdAt ? moment(obj.createdAt).format('YYYY-MM-DD HH:mm:ss') : null,
                })),
            pesticidesCosts:
                dataUpload?.pesticides_costs?.length &&
                dataUpload.pesticides_costs?.map((obj: any) => ({
                    expenseId: typeof obj.id === 'number' ? obj.id : undefined,
                    type: obj.type || 'pesticides_costs',
                    unitId: obj.unitId,
                    unitPrice: obj.unitPrice,
                    amount: obj.amount,
                    totalPrice: obj.unitPrice * obj.amount,
                    content: obj.content,
                    editTime: moment(obj.editTime).format('YYYY-MM-DD HH:mm:ss'),
                    createdAt: obj.createdAt ? moment(obj.createdAt).format('YYYY-MM-DD HH:mm:ss') : null,
                })),
            fertilizersCosts:
                dataUpload?.fertilizers_costs?.length &&
                dataUpload.fertilizers_costs?.map((obj: any) => ({
                    expenseId: typeof obj.id === 'number' ? obj.id : undefined,
                    type: obj.type || 'fertilizers_costs',
                    unitId: obj.unitId,
                    unitPrice: obj.unitPrice,
                    amount: obj.amount,
                    totalPrice: obj.unitPrice * obj.amount,
                    content: obj.content,
                    editTime: moment(obj.editTime).format('YYYY-MM-DD HH:mm:ss'),
                    createdAt: obj.createdAt ? moment(obj.createdAt).format('YYYY-MM-DD HH:mm:ss') : null,
                })),
        };
        const checkType = typeErrors[index]?.some((subArray: any) => subArray === false);
        const checkUnit = unitErrors[index]?.some((subArray: any) => subArray === false);

        if (checkType || checkUnit) {
            setLoading(false);
            Notification('warning', 'Vui lòng nhập đầy đủ chi phí!');
        } else {
            await seasonsService
                .updateExpenses(dataUploladExpenses)
                .then((res) => {
                    if (res?.status) {
                        Notification('success', 'Cập nhật chi phí thành công');
                        refetch();
                    }
                })
                .finally(() => setLoading(false));
        }
    };

    const returnFilter = React.useCallback(
        (filter: IFilter) => {
            // setPage(1);
            setFilterQuery({ ...filterQuery, ...filter });
        },
        [filterQuery]
    );
    const onChange = (key: string | string[]) => {};

    return (
        <Form form={form} component={false}>
            {dataHarvest?.data?.flower?.type === TYPE_FLOWER.GROW_ONE ? (
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
                                : {
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      width: '100%',
                                  }
                        }
                    >
                        <FilterExpense
                            returnFilter={returnFilter}
                            setChangingId={setChangingId}
                            harvestId={data?.[0]?.expenses?.[0]?.harvest?.id}
                        />
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={() => handleAdd(0)} type="primary" style={{ marginBottom: 16 }}>
                                Thêm chi phí
                            </Button>
                            <Button
                                onClick={() =>
                                    handleSubmit(
                                        data?.[0]?.expenses?.[0]?.harvest?.id || harvestIds[0]?.id,
                                        Number(id),
                                        0
                                    )
                                }
                                type="primary"
                                htmlType="submit"
                                style={{ marginBottom: 16 }}
                            >
                                Xác nhận
                            </Button>
                        </div>
                    </SpaceStyled>
                    <TableComponent
                        loading={loading}
                        components={{
                            body: {
                                row: EditableRow,
                                cell: EditableCell,
                            },
                        }}
                        dataSource={data?.[0]?.expenses}
                        columns={[
                            ...mergedColumns,
                            {
                                title: 'Thao tác',
                                dataIndex: 'operation',
                                render: (value: any, record: any) => {
                                    return record?.type !== 'pakaging_costs' ? (
                                        <Button
                                            onClick={() => {
                                                Modal.confirm({
                                                    title: 'Xóa chi phí',
                                                    content: 'Bạn có chắc chắn muốn xoá chi phí này?',
                                                    onOk: () => handleDelete(record.id),
                                                });
                                            }}
                                            disabled={
                                                dataHarvest?.data?.status === 'completed' &&
                                                dataHarvest?.data?.flower?.type !== 'perennial'
                                            }
                                            type="link"
                                            icon={<IconAntd icon="DeleteOutlined" />}
                                        />
                                    ) : (
                                        <></>
                                    );
                                },
                            },
                        ]}
                        rowSelect={false}
                        rowClassName="editable-row"
                    />
                    <Space style={{ display: 'flex', justifyContent: 'end' }}>
                        <strong>Tổng: </strong>
                        <strong style={{ color: 'red' }}>
                            {currencyFormat(
                                data?.[0]?.expenses?.reduce((accumulator: any, turn: any) => {
                                    return accumulator + turn?.unitPrice * turn?.amount;
                                }, 0)
                            )}{' '}
                            VNĐ
                        </strong>
                    </Space>
                </>
            ) : (
                <>
                    <Collapse onChange={onChange} defaultActiveKey={[1, 2, 3, 4, 5]}>
                        {data?.map((item: any, index: number) => {
                            return (
                                <>
                                    <Panel header={`Chi phí đợt ${index + 1}`} key={index + 1}>
                                        <>
                                            <SpaceStyled
                                                style={
                                                    width <= TAB_MOBLIE
                                                        ? {
                                                              display: 'flex',
                                                              flexDirection: 'column',
                                                              alignItems: 'flex-start',
                                                          }
                                                        : {
                                                              display: 'flex',
                                                              justifyContent: 'space-between',
                                                              alignItems: 'center',
                                                              width: '100%',
                                                          }
                                                }
                                            >
                                                <FilterExpense
                                                    setChangingId={setChangingId}
                                                    returnFilter={returnFilter}
                                                    harvestId={data?.[index]?.expenses?.[0]?.harvest?.id}
                                                />
                                                <div
                                                    style={
                                                        width <= TAB_MOBLIE
                                                            ? {
                                                                  display: 'flex',
                                                                  justifyContent: 'space-between',
                                                              }
                                                            : {
                                                                  display: 'flex',
                                                                  justifyContent: 'flex-end',
                                                              }
                                                    }
                                                >
                                                    <Button
                                                        onClick={() => handleAdd(index)}
                                                        type="primary"
                                                        style={{ marginBottom: 16 }}
                                                    >
                                                        Thêm chi phí
                                                    </Button>
                                                    <Button
                                                        htmlType="submit"
                                                        onClick={() =>
                                                            handleSubmit(
                                                                data?.[index]?.expenses?.[0]?.harvest?.id ||
                                                                    harvestIds[index]?.id,
                                                                Number(id),
                                                                index
                                                            )
                                                        }
                                                        type="primary"
                                                        style={{ marginBottom: 16 }}
                                                    >
                                                        Xác nhận
                                                    </Button>
                                                </div>
                                            </SpaceStyled>
                                            <TableComponent
                                                loading={loading}
                                                components={{
                                                    body: {
                                                        row: EditableRow,
                                                        cell: EditableCell,
                                                    },
                                                }}
                                                rowSelect={false}
                                                dataSource={item?.expenses}
                                                columns={[
                                                    ...mergedColumns,
                                                    {
                                                        title: 'Thao tác',
                                                        dataIndex: 'operation',
                                                        render: (value: any, record: any, idx: number) => {
                                                            return index === data?.length - 1 ? (
                                                                record?.type !== 'pakaging_costs' && (
                                                                    <Button
                                                                        onClick={() => {
                                                                            Modal.confirm({
                                                                                title: 'Xóa chi phí',
                                                                                content:
                                                                                    'Bạn có chắc chắn muốn xoá chi phí này?',
                                                                                onOk: () => handleDelete(record.id),
                                                                            });
                                                                        }}
                                                                        disabled={
                                                                            dataHarvest?.data?.status === 'completed' &&
                                                                            dataHarvest?.data?.flower?.type !==
                                                                                'perennial'
                                                                        }
                                                                        type="link"
                                                                        icon={<IconAntd icon="DeleteOutlined" />}
                                                                    />
                                                                )
                                                            ) : (
                                                                <></>
                                                            );
                                                        },
                                                    },
                                                ]}
                                                rowClassName="editable-row"
                                            />
                                            <Space style={{ display: 'flex', justifyContent: 'end' }}>
                                                <strong>Tổng: </strong>
                                                <strong style={{ color: 'red' }}>
                                                    {currencyFormat(
                                                        data?.[index]?.expenses?.reduce(
                                                            (accumulator: any, turn: any) => {
                                                                return accumulator + turn?.unitPrice * turn?.amount;
                                                            },
                                                            0
                                                        )
                                                    )}{' '}
                                                    VNĐ
                                                </strong>
                                            </Space>
                                        </>
                                    </Panel>
                                </>
                            );
                        })}
                    </Collapse>
                </>
            )}
        </Form>
    );
};

export default ExpenseTab;

const SelectStyled = styled(Select)`
    & .ant-select-selection-item {
        color: black;
    }
    width: 100%;
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
