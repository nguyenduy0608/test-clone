import CardComponent from '@/components/CardComponent';
import FormItemComponent from '@/components/FormComponent/FormItemComponent';
import SelectComponent from '@/components/SelectComponent';
import SelectSearch from '@/components/SelectComponent/SelectSearch';
import TableComponent from '@/components/TableComponent';
import { STATUS_SEASON, TYPE_FLOWER } from '@/contants';
import { rules } from '@/rules';
import { Notification, momentParseUtc, wait } from '@/utils';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Pagination, Row, Space } from 'antd';
import { useWatch } from 'antd/lib/form/Form';
import moment from 'moment';
import React from 'react';
import { DataType, seasonsService } from '../services';
import { columnsPlantbeds } from './Season.Config';
import SelectArea from './SelectArea';
import SelectPlant from './SelectPlantbedI';
import TableNumberHarvestUpdate from './TableNumberHarvestUpdate';
import styled from 'styled-components';
import ModalComponent from '@/components/ModalComponent';
import useWindowSize from '@/hooks/useWindowSize';
import { TAB_MOBLIE } from '@/config/theme';

const SeasonTab = ({ id, form, data, refetch, setTimeMany }: any) => {
    const gardenId = useWatch('gardenId', form);
    const [areaIds, setAreaId] = React.useState<number[]>();
    const [gerden, setGerden] = React.useState<number>();
    const [note, setNote] = React.useState<string>('');
    const expectedHarvestStartDates = useWatch('expectedHarvestStartDates', form);
    const numberOfHarvests = useWatch('numberOfHarvests', form);
    const plantbedIds = useWatch('plantbedIds', form);
    const actualStart = useWatch('actualStart', form);
    const [dateHarvests, setDateHarvests] = React.useState<number>();
    const [timeharvest, setTimeHarvest] = React.useState<any[]>([]);
    const [typeFlowrs, setTypeFlowrs] = React.useState<string>('');
    const [startDate, setStartDate] = React.useState(null);
    const [isModal, setIsModal] = React.useState<boolean>(false);
    const [deletePlantbeds, setDeletePlantbeds] = React.useState<number>(0);
    const [selectArea, setSelectArea] = React.useState<any[]>([]);
    const [selectPlanbeds, setSelectPlantbeds] = React.useState<any[]>([]);
    const [deleteAreaId, setDeleteAreaId] = React.useState('');

    const { width } = useWindowSize();
    React.useEffect(() => {
        const fieldValues: DataType = {
            ...data?.data,
        };
        const areaId = data?.data?.areas?.map((it: { id: number }) => it.id);
        const expectedHarvestStartDatesManyTimes = data?.data?.expectedHarvestStartDates?.map((item: string) =>
            moment(item)
        );
        setSelectArea(areaId);
        setSelectPlantbeds(data?.data?.plantbeds?.map((it: { id: number }) => it.id));
        form.setFieldsValue({
            ...fieldValues,
            unitIds: data?.data?.units?.map((it: { id: number }) => it.id),
            areaIds: areaId,
            plantbedIds: data?.data?.plantbeds?.map((it: { id: number }) => it.id),
            actualStart: data?.data?.actualStart ? momentParseUtc(data?.data?.actualStart) : '',
            expectedHarvestStartDates:
                data?.data?.flower?.type === TYPE_FLOWER.GROW_ONE
                    ? expectedHarvestStartDatesManyTimes[0]
                    : data?.data?.flower?.type === TYPE_FLOWER.PERENNIAL
                    ? expectedHarvestStartDatesManyTimes
                    : data?.data?.flower?.type === TYPE_FLOWER.GROWN_MANY_TIMES
                    ? expectedHarvestStartDatesManyTimes
                    : '',
            sowingDate: data?.data?.information?.sowingDate ? momentParseUtc(data?.data?.information?.sowingDate) : '',
            germinationDate: data?.data?.information?.germinationDate
                ? momentParseUtc(data?.data?.information?.germinationDate)
                : '',
            germinationQuantity: data?.data?.information?.germinationQuantity || '',
            cuttingLength: data?.data?.information?.cuttingLength || null,
            grownDate: data?.data?.information?.grownDate ? momentParseUtc(data?.data?.information?.grownDate) : '',
            // actualHarvestStart: data?.data?.actualHarvestStart ? momentParseUtc(data?.data?.actualHarvestStart) : '',
            // actualHarvestEnd: data?.data?.actualHarvestEnd ? momentParseUtc(data?.data?.actualHarvestEnd) : '',
            numberOfHarvests: data?.data?.numberOfHarvests,
        });
        setDateHarvests(data?.data?.harvests?.length);
        setGerden(data?.data?.gardenId);
        const newArrAreas = data?.data?.areas?.map((it: any) => it.id);
        setAreaId(newArrAreas?.join(','));
    }, [id, data]);

    React.useEffect(() => {
        setTimeMany(timeharvest);
    }, [timeharvest]);
    const startDateValue = form.getFieldValue('actualStart');

    // Hàm kiểm tra ngày có được chọn hay không
    const disabledDate = (current: any) => {
        // Nếu không có giá trị Ngày bắt đầu hoặc ngày hiện tại lớn hơn Ngày bắt đầu, disable ngày
        return !startDateValue || current < startDateValue;
    };
    return (
        <>
            <CardComponent title="Thông tin vụ mùa">
                <Row>
                    <Col span={width <= TAB_MOBLIE ? 24 : 12}>
                        <FormItemComponent
                            rules={[rules.required('Vui lòng nhập tên vụ mùa'), rules.validateTitle]}
                            name="name"
                            normalize={(value: any) => value.trimStart()}
                            label="Tên vụ mùa"
                            inputField={<Input placeholder="Nhập tên vụ mùa" />}
                        />
                        <FormItemComponent
                            rules={[rules.required('Vui lòng nhập tên loại cây trồng!')]}
                            name="flowerId"
                            label="Loại cây trồng"
                            inputField={
                                <SelectComponent
                                    disabled={true}
                                    onChange={(item: any, option: any) => {
                                        // returnFilter({ user_type: item?.value });
                                        setTypeFlowrs(option?.title);
                                    }}
                                    apiUrl="/flowers"
                                    placeholder="Chọn loại cây trồng"
                                />
                            }
                        />
                        <FormItemComponent
                            rules={[rules.required('Vui lòng chọn vườn!')]}
                            name="gardenId"
                            label="Vườn"
                            inputField={
                                <SelectComponent
                                    disabled={true}
                                    onChange={(item: any) => {
                                        // returnFilter({ user_type: item?.value });
                                    }}
                                    apiUrl="/gardens"
                                    placeholder="Chọn vườn"
                                />
                            }
                        />

                        <FormItemComponent
                            rules={[rules.required('Vui lòng chọn khu vực!')]}
                            name="areaIds"
                            label="Khu vực"
                            inputField={
                                <SelectArea
                                    onChange={(item: any, record: any) => {
                                        setAreaId(item.join(','));
                                    }}
                                    onDeselect={(item: any) => {
                                        const allPlantbedIds =
                                            item?.plantbeds?.map((plantbed: any) => plantbed?.id) || [];
                                        const commonElements = plantbedIds?.filter((item: any) =>
                                            allPlantbedIds?.includes(item)
                                        );
                                        // Lọc ra những phần tử không giống nhau trong mảng plantbedIds
                                        const uniquePlantbedIds = plantbedIds?.filter(
                                            (item: any) => !commonElements.includes(item)
                                        );
                                        form.setFieldsValue({
                                            plantbedIds: uniquePlantbedIds,
                                        });
                                        setDeletePlantbeds(item.value);
                                    }}
                                    selectArea={selectArea}
                                    apiUrl={`/seasons/web/to-update/current-areas`}
                                    placeholder="Chọn khu vực"
                                    reload={gardenId}
                                    params={{ gardenId: data?.data?.gardenId, seasonId: data?.data?.id }}
                                />
                            }
                        />
                        <FormItemComponent
                            rules={[rules.required('Vui lòng chọn luống trồng!')]}
                            name="plantbedIds"
                            label="Luống trồng"
                            inputField={
                                <SelectPlant
                                    selectPlantbeds={selectPlanbeds}
                                    onChange={(item: any, record: any) => {}}
                                    apiUrl={`/seasons/to-update/usable-plantbeds`}
                                    params={{ areaIds: areaIds, seasonId: data?.data?.id }}
                                    deletePlantbeds={deletePlantbeds}
                                    placeholder="Chọn luống trồng"
                                />
                            }
                        />
                        <FormItemComponent
                            rules={[rules.required('Vui lòng nhập Khoảng cách trồng!')]}
                            name="plantingDistance"
                            label="Khoảng cách trồng"
                            inputField={
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={1}
                                    max={100000000000}
                                    formatter={(value: any) => {
                                        const parts = value.toString().split('.');
                                        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Định dạng phần nguyên với dấu chấm
                                        const decimalPart = parts[1] ? `,${parts[1]}` : ''; // Thêm dấu phẩy và phần thập phân (nếu có)
                                        return `${integerPart}${decimalPart}`;
                                    }}
                                    parser={(value: any) => {
                                        const normalizedValue = value.replace(/[^0-9.,]/g, ''); // Xóa các ký tự không phải số, dấu chấm, hoặc dấu phẩy
                                        const parts = normalizedValue.split(',');
                                        const parsedValue = parts.join('.') || '0'; // Kết hợp phần nguyên và phần thập phân (nếu có) với dấu chấm
                                        return parseFloat(parsedValue);
                                    }}
                                    placeholder="Nhập Khoảng cách trồng"
                                    addonAfter="CM"
                                />
                            }
                        />
                    </Col>
                    <Col span={width <= TAB_MOBLIE ? 24 : 12}>
                        <FormItemComponent
                            rules={[rules.required('Vui lòng nhập ngày bắt đầu!')]}
                            name="actualStart"
                            label="Ngày bắt đầu"
                            inputField={
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    placeholder="Chọn ngày bắt đầu"
                                    style={{ width: '100%', paddingRight: '10px' }}
                                    onChange={(date: any) => setStartDate(date)}
                                    // disabledDate={(current: any) => {
                                    //     return current && current > moment().endOf('day');
                                    // }}
                                />
                            }
                        />
                        <FormItemComponent
                            rules={[rules.required('Vui lòng nhập diện tích trồng!')]}
                            name="usableArea"
                            label="Diện tích trồng"
                            inputField={
                                <InputNumber
                                    min={1}
                                    max={100000000000}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                    parser={(value: any) => (value ? value.replace(/[^0-9]/g, '') : '')}
                                    style={{ width: '100%' }}
                                    placeholder="Nhập diện tích trồng"
                                    addonAfter="M2"
                                />
                            }
                        />

                        <FormItemComponent
                            rules={[rules.required('Vui lòng nhập sản lượng dự kiến!')]}
                            name="expectedQuantity"
                            label="Sản lượng dự kiến"
                            inputField={
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={1}
                                    max={100000000000}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                    parser={(value: any) => (value ? value.replace(/[^0-9]/g, '') : '')}
                                    placeholder="Nhập Sản lượng dự kiến"
                                />
                            }
                        />
                        <FormItemComponent
                            rules={[rules.required('Vui lòng nhập Đơn vị!')]}
                            name="unitIds"
                            label="Đơn vị"
                            inputField={
                                <SelectSearch
                                    // value={params?.search ? { value: params?.search } : undefined}
                                    onChange={(item: any) => {
                                        // returnFilter({ user_type: item?.value });
                                    }}
                                    apiUrl="/configs/units"
                                    placeholder="Chọn đơn vị"
                                />
                            }
                        />
                        <FormItemComponent
                            rules={[rules.required('Vui lòng nhập Số lượng cây trồng!')]}
                            name="numberOfSeedlings"
                            label="Số lượng cây trồng"
                            inputField={
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={1}
                                    max={100000000000}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                    parser={(value: any) => (value ? value.replace(/[^0-9]/g, '') : '')}
                                    placeholder="Nhập Số lượng cây trồng"
                                />
                            }
                        />
                        <FormItemComponent
                            name="cuttingLength"
                            label="Ngắt ngọn"
                            inputField={
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    placeholder="Nhập ngắt ngọn"
                                    addonAfter="CM"
                                />
                            }
                        />
                        {data?.data?.flower?.type === TYPE_FLOWER.GROWN_MANY_TIMES ? (
                            <FormItemComponent
                                rules={[rules.required('Vui lòng nhập số lần thu hoạch!')]}
                                name="numberOfHarvests"
                                label="Số lần thu hoạch"
                                inputField={
                                    <InputNumber
                                        min={dateHarvests}
                                        max={100}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                        parser={(value: any) => (value ? value.replace(/[^0-9]/g, '') : '')}
                                        style={{ width: '100%' }}
                                        placeholder="Nhập số lần thu hoạch"
                                        onBlur={(e: any) => {
                                            const value = e.target.value;
                                            if (Number(value) < Number(dateHarvests)) {
                                                e.target.value = dateHarvests;
                                            }
                                        }}
                                    />
                                }
                            />
                        ) : data?.data?.flower?.type === TYPE_FLOWER.GROW_ONE ? (
                            <FormItemComponent
                                rules={[rules.required('Vui lòng nhập ngày dự kiến thu hoạch!')]}
                                name="expectedHarvestStartDates"
                                label="Ngày dự kiến thu hoạch"
                                inputField={
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        placeholder="Nhập Ngày dự kiến thu hoạch"
                                        style={{ width: '100%', paddingRight: '10px' }}
                                        disabledDate={disabledDate}
                                    />
                                }
                            />
                        ) : (
                            <></>
                        )}
                    </Col>
                </Row>
                {data?.data?.flower?.type === TYPE_FLOWER.PERENNIAL ? (
                    <Row justify={'center'}>
                        <Col span={15}>
                            <FormItemStyles name="expectedHarvestStartDates">
                                {(fields, { add, remove }, { errors }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Form.Item
                                                // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                                label={`Ngày dự kiến thu hoạch ${index + 1}`}
                                                required={true}
                                                key={field.key}
                                            >
                                                <Row align="middle" justify="start">
                                                    <Form.Item
                                                        {...field}
                                                        validateTrigger={['onChange', 'onBlur']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Vui lòng nhập ngày thu hoạch.',
                                                            },
                                                        ]}
                                                        noStyle
                                                    >
                                                        <DatePicker
                                                            format="DD/MM/YYYY"
                                                            placeholder="Nhập Ngày dự kiến thu hoạch"
                                                            style={{ width: '90%', marginRight: 8 }}
                                                            disabledDate={(current: any) => {
                                                                if (actualStart) {
                                                                    return current < moment(actualStart).startOf('day');
                                                                }
                                                                return (
                                                                    current &&
                                                                    current < moment(actualStart).startOf('day')
                                                                );
                                                            }}
                                                        />
                                                    </Form.Item>
                                                    {data?.data?.status !== STATUS_SEASON.Completed &&
                                                    fields.length > 1 &&
                                                    index > data?.data?.harvests?.length - 2 ? (
                                                        <MinusCircleOutlined
                                                            style={{ fontSize: 20 }}
                                                            className="dynamic-delete-button"
                                                            onClick={() => remove(field.name)}
                                                        />
                                                    ) : null}
                                                </Row>
                                            </Form.Item>
                                        ))}
                                        {data?.data?.status === STATUS_SEASON.Completed ? (
                                            <></>
                                        ) : (
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <Button
                                                    type="default"
                                                    onClick={() => add()}
                                                    style={{
                                                        width: '50%',
                                                        marginBottom: '10px',
                                                        background: '#038fde',
                                                        color: 'white',
                                                    }}
                                                    icon={<PlusOutlined />}
                                                >
                                                    Thêm ngày thu hoạch
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </FormItemStyles>
                        </Col>
                    </Row>
                ) : data?.data?.flower?.type === TYPE_FLOWER.GROWN_MANY_TIMES ? (
                    <TableNumberHarvestUpdate
                        refetch={refetch}
                        id={data?.data?.id}
                        dataSeason={data?.data}
                        numberOfHarvests={numberOfHarvests}
                        dataTime={data?.data?.expectedHarvestStartDates || []}
                        setTimeHarvest={setTimeHarvest}
                        actualStart={actualStart}
                    />
                ) : (
                    <></>
                )}
                <TableComponent
                    rowSelect={false}
                    dataSource={data?.data?.plantbeds}
                    columns={[
                        ...columnsPlantbeds(),
                        {
                            title: 'Thao tác',
                            dataIndex: 'statsss',
                            align: 'center',
                            render: (value, record) => {
                                return record?.seasonsPlantbeds?.status === STATUS_SEASON.InProgress ? (
                                    <>
                                        <Button
                                            // type="primary"
                                            style={{ background: '#ff4d4f', color: 'white' }}
                                            onClick={() => {
                                                setDeleteAreaId(record?.id);
                                                setIsModal(true);
                                            }}
                                        >
                                            Dừng trồng
                                        </Button>
                                    </>
                                ) : (
                                    <></>
                                );
                            },
                        },
                    ]}
                />
            </CardComponent>
            <ModalComponent
                modalVisible={isModal}
                title="Dừng luống trồng"
                children={
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: '100px',
                        }}
                    >
                        <Input
                            placeholder="Nhập lý do dừng trồng"
                            value={note?.trimStart()}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <Space>
                            <Button
                                type="primary"
                                onClick={async () => {
                                    if (note?.trimStart()) {
                                        seasonsService
                                            .plantbedInActive({
                                                seasonId: Number(id),
                                                plantbedId: deleteAreaId,
                                                reason: note ? note : '',
                                            })
                                            .then((res) => {
                                                if (res?.status) {
                                                    Notification('success', 'Dừng trồng thành công');
                                                    refetch();
                                                    setNote('');
                                                    setDeleteAreaId('');
                                                    setIsModal(false);
                                                }
                                            });
                                    } else {
                                        Notification('warning', 'Nhập lý do dừng trồng');
                                    }
                                }}
                            >
                                Lưu
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsModal(false);
                                    setNote('');
                                }}
                                danger
                            >
                                Hủy
                            </Button>
                        </Space>
                    </div>
                }
            />
            <CardComponent title="Thông tin gieo trồng">
                <Row>
                    <Col span={width <= TAB_MOBLIE ? 24 : 12}>
                        <FormItemComponent
                            name="sowingDate"
                            label="Ngày xuống giống"
                            inputField={
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    placeholder="Nhập ngày xuống giống"
                                    style={{ width: '100%', paddingRight: '10px' }}
                                />
                            }
                        />
                        <FormItemComponent
                            // rules={[rules.required('Vui lòng nhập Ngày nảy mầm')]}
                            name="germinationDate"
                            label="Ngày nảy mầm"
                            inputField={
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    placeholder="Nhập ngày nảy mầm"
                                    style={{ width: '100%', paddingRight: '10px' }}
                                    // disabledDate={(current: any) => {
                                    //     return current && current > moment().endOf('day');
                                    // }}
                                />
                            }
                        />
                        <FormItemComponent
                            name="germinationQuantity"
                            label="Số lượng nảy mầm"
                            inputField={
                                <InputNumber
                                    min={1}
                                    max={100000000000}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                    parser={(value: any) => (value ? value.replace(/[^0-9]/g, '') : '')}
                                    style={{ width: '100%' }}
                                    placeholder="Nhập Số lượng nảy mầm"
                                />
                            }
                        />
                    </Col>
                    <Col span={width <= TAB_MOBLIE ? 24 : 12}>
                        <FormItemComponent
                            // rules={[rules.required('Vui lòng nhập ngày ra luống!')]}
                            name="grownDate"
                            label="Ngày ra luống"
                            inputField={
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    placeholder="Nhập ngày ra luống"
                                    style={{ width: '100%', paddingRight: '10px' }}
                                />
                            }
                        />
                    </Col>
                </Row>
            </CardComponent>
        </>
    );
};

export default SeasonTab;
const FormItemStyles = styled(Form.List)`
    height: 100%;

    & .ant-form-item-label > label.ant-form-item-required:not(.ant-form-item-required-mark-optional):before {
        content: '';
        margin-right: 0;
    }

    & .ant-form-item-label > label.ant-form-item-required:not(.ant-form-item-required-mark-optional):after {
        display: inline-block;
        margin-right: 4px;
        color: #ff4d4f;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
    }
    & .ant-select-arrow {
        display: flex;
    }
    & .ant-form-item-label > label {
        margin-left: 15px;
        text-align: center;
    }
`;
