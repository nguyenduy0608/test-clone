import SaveButton from '@/components/Button/Save.Button';
import CardComponent from '@/components/CardComponent';
import FormComponent from '@/components/FormComponent';
import FormItemComponent from '@/components/FormComponent/FormItemComponent';
import SelectComponent from '@/components/SelectComponent';
import SelectSearch from '@/components/SelectComponent/SelectSearch';
import TopBar from '@/components/TopBar';
import { BOX_SHADOW, TAB_SIZE } from '@/config/theme';
import { TYPE_FLOWER } from '@/contants';
import Wrapper from '@/features/Auth/Wrapper';
import Container from '@/layout/Container';
import { rules } from '@/rules';
import { Notification } from '@/utils';
import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';
import { useWatch } from 'antd/lib/form/Form';
import dayjs from 'dayjs';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SelectArea from '../components/SelectArea';
import SelectPlant from '../components/SelectPlantbedI';
import TableNumberHarvest from '../components/TableNumberHarvest';
import { DataType, seasonsService } from '../services';
import useWindowSize from '@/hooks/useWindowSize';
import SelectComponentSeasons from '../components/SeclectComponentsSeasons';
const Option = Select;
const SeasonForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [areaIds, setAreaId] = React.useState<number[]>();
    const [typeFlowrs, setTypeFlowrs] = React.useState<string>('');
    const [timeharvest, setTimeHarvest] = React.useState<any[]>([]);
    const expectedHarvestStartDates = Form.useWatch('expectedHarvestStartDates', form);
    const actualStart = Form.useWatch('actualStart', form);
    const gardenId = useWatch('gardenId', form);
    const areaIdsForm = useWatch('areaIds', form);
    const numberOfHarvests = useWatch('numberOfHarvests', form);
    const { width } = useWindowSize();
    React.useEffect(() => {
        if (!gardenId?.value) {
            form.setFieldsValue({
                areaIds: [],
                plantbedIds: [],
            });
        }
    }, [gardenId?.value]);

    React.useEffect(() => {
        if (!areaIdsForm?.value) {
            form.setFieldsValue({
                plantbedIds: [],
            });
        }
    }, [areaIdsForm?.value]);
    const handleSubmit = (data: DataType) => {
        setLoading(true);
        const expectedHarvestStartDates = timeharvest?.map((item) =>
            moment(item.expectedHarvestStartDates).format('YYYY-MM-DD')
        );
        const dataUpload: DataType = {
            ...data,
            expectedHarvestStartDates:
                typeFlowrs !== 'Cây nhiều lần'
                    ? [dayjs(data?.expectedHarvestStartDates).format('YYYY-MM-DD')]
                    : expectedHarvestStartDates,
            actualStart: dayjs(data?.actualStart).format('YYYY-MM-DD'),
            flowerId: Number(data?.flowerId?.value),
            gardenId: Number(data?.gardenId?.value),
            cuttingLength: data?.cuttingLength || null,
        };
        seasonsService
            .create(dataUpload)
            .then((res) => {
                if (res.status) {
                    Notification('success', 'Thêm vụ mùa thành công');
                    // navigate(location?.state?.prevUrl || -1, { state: location.state });
                    navigate('/season');
                }
            })
            .finally(() => setLoading(false));
    };

    React.useEffect(() => {
        form.setFieldsValue({
            areaIds: [],
            plantbedIds: [],
        });
    }, [gardenId]);

    React.useEffect(() => {
        form.setFieldsValue({
            plantbedIds: [],
        });
    }, [areaIdsForm]);

    return (
        <Wrapper loading={loading}>
            <FormComponent form={form} onSubmit={handleSubmit} layoutType="horizontal">
                <TopBar back title={'Thêm vụ mùa'} extra={[<SaveButton key="addTree" htmlType="submit" />]} />
                <Container>
                    <CardComponent>
                        <Row style={{ flexDirection: 'row' }} gutter={[20, 0]}>
                            <Col span={width <= TAB_SIZE ? 24 : 12}>
                                <FormItemComponent
                                    rules={[rules.required('Vui lòng nhập tên vụ mùa!'), rules.validateTitle]}
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
                                        <SelectComponentSeasons
                                            // value={params?.search ? { value: params?.search } : undefined}
                                            onChange={(item: any, option: any) => {
                                                setTypeFlowrs(option?.title);
                                            }}
                                            title="type"
                                            apiUrl="/flowers"
                                            params={{ status: 1 }}
                                            placeholder="Chọn loại cây trồng"
                                        />
                                    }
                                />
                                {typeFlowrs === 'Cây nhiều lần' ? (
                                    <FormItemComponent
                                        rules={[rules.required('Vui lòng nhập số lần thu hoạch!')]}
                                        name="numberOfHarvests"
                                        label="Số lần thu hoạch"
                                        inputField={
                                            <InputNumber
                                                min={1}
                                                max={100}
                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                                parser={(value: any) => (value ? value.replace(/[^0-9]/g, '') : '')}
                                                style={{ width: '100%' }}
                                                placeholder="Nhập số lần thu hoạch"
                                            />
                                        }
                                    />
                                ) : (
                                    <></>
                                )}

                                <FormItemComponent
                                    rules={[rules.required('Vui lòng nhập ngày bắt đầu!')]}
                                    name="actualStart"
                                    label="Ngày bắt đầu"
                                    inputField={
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            placeholder="Chọn ngày bắt đầu"
                                            style={{ width: '100%', paddingRight: '10px' }}
                                        />
                                    }
                                />

                                {typeFlowrs !== 'Cây nhiều lần' ? (
                                    <FormItemComponent
                                        rules={[
                                            rules.required('Vui lòng nhập ngày thu hoạch!'),
                                            {
                                                validator: async (rule: any, value: any) => {
                                                    const actualStartDate = form.getFieldValue('actualStart');
                                                    if (value && actualStartDate) {
                                                        const isValid =
                                                            moment(value).startOf('day') >=
                                                            moment(actualStartDate).startOf('day');
                                                        if (!isValid) {
                                                            throw new Error(
                                                                'Ngày dự kiến thu hoạch phải lớn hơn ngày bắt đầu!'
                                                            );
                                                        }
                                                    }
                                                },
                                            },
                                        ]}
                                        name="expectedHarvestStartDates"
                                        label="Ngày dự kiến thu hoạch"
                                        inputField={
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                allowClear={true}
                                                placeholder="Chọn ngày thu hoạch"
                                                style={{ width: '100%', paddingRight: '10px' }}
                                                disabledDate={(current: any) => {
                                                    if (actualStart) {
                                                        return current < moment(actualStart).startOf('day');
                                                    }
                                                    return current && current < moment(actualStart).startOf('day');
                                                }}
                                            />
                                        }
                                    />
                                ) : (
                                    <></>
                                )}

                                <FormItemComponent
                                    rules={[rules.required('Vui lòng nhập số lượng cây trồng!')]}
                                    name="numberOfSeedlings"
                                    label="Số lượng cây trồng"
                                    inputField={
                                        <InputNumber
                                            min={0}
                                            max={1000000000}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                            parser={(value: any) => (value ? value.replace(/[^0-9]/g, '') : '')}
                                            style={{ width: '100%' }}
                                            placeholder="Nhập số lượng cây trồng"
                                        />
                                    }
                                />
                                <FormItemComponent
                                    rules={[rules.required('Vui lòng nhập khoảng cách trồng!')]}
                                    name="plantingDistance"
                                    label="Khoảng cách trồng"
                                    inputField={
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            min={1}
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
                                            max={1000}
                                            placeholder="Nhập khoảng cách trồng"
                                            addonAfter="CM"
                                        />
                                    }
                                />
                                <FormItemComponent
                                    name="cuttingLength"
                                    label="Ngắt ngọn"
                                    inputField={
                                        <InputNumber
                                            min={0}
                                            style={{ width: '100%' }}
                                            placeholder="Nhập ngắt ngọn"
                                            addonAfter="CM"
                                        />
                                    }
                                />
                            </Col>
                            <Col span={width <= TAB_SIZE ? 24 : 12}>
                                <FormItemComponent
                                    rules={[rules.required('Vui lòng chọn vườn!')]}
                                    name="gardenId"
                                    label="Vườn"
                                    inputField={
                                        <SelectComponent
                                            // value={params?.search ? { value: params?.search } : undefined}
                                            onChange={(item: any) => {
                                                // returnFilter({ user_type: item?.value });
                                            }}
                                            apiUrl="/gardens"
                                            params={{ status: 1 }}
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
                                            // value={params?.search ? { value: params?.search } : undefined}
                                            onChange={(item: any) => {
                                                setAreaId(item.join(','));
                                            }}
                                            apiUrl={`/seasons/web/current-areas`}
                                            placeholder="Chọn khu vực"
                                            reload={gardenId}
                                            params={{ gardenId: gardenId?.value }}
                                        />
                                    }
                                />
                                <FormItemComponent
                                    rules={[rules.required('Vui lòng chọn luống trồng!')]}
                                    name="plantbedIds"
                                    label="Luống trồng"
                                    inputField={
                                        <SelectPlant
                                            onChange={(item: any) => {}}
                                            apiUrl={`/seasons/usable-plantbeds`}
                                            params={{ areaIds: areaIds }}
                                            placeholder="Chọn luống trồng"
                                        />
                                    }
                                />
                                <FormItemComponent
                                    rules={[rules.required('Vui lòng nhập sản lượng dự kiến!')]}
                                    name="expectedQuantity"
                                    label="Sản lượng dự kiến"
                                    inputField={
                                        <InputNumber
                                            min={1}
                                            max={1000000000}
                                            style={{ width: '100%' }}
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
                                    rules={[rules.required('Vui lòng nhập diện tích trồng!')]}
                                    name="usableArea"
                                    label="Diện tích trồng"
                                    inputField={
                                        <InputNumber
                                            min={1}
                                            max={1000000000}
                                            style={{ width: '100%' }}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                            parser={(value: any) => (value ? value.replace(/[^0-9]/g, '') : '')}
                                            addonAfter="M2"
                                            placeholder="Nhập diện tích trồng"
                                        />
                                    }
                                />
                            </Col>
                        </Row>
                        {typeFlowrs === 'Cây nhiều lần' && numberOfHarvests ? (
                            <TableNumberHarvest
                                actualStartDate={actualStart}
                                numberOfHarvests={numberOfHarvests}
                                setTimeHarvest={setTimeHarvest}
                            />
                        ) : (
                            <></>
                        )}
                    </CardComponent>
                </Container>
            </FormComponent>
        </Wrapper>
    );
};

const ColStyled = styled(Col)`
    /* border: 1px solid; */
    border-radius: 10px;
    display: flex;
    margin-top: 25px !important;
    padding: 20px 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* box-shadow: ${BOX_SHADOW} !important; */
`;

export default SeasonForm;
