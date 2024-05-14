import CardComponent from '@/components/CardComponent';
import ClearFilter from '@/components/ClearFilter';
import IconAntd from '@/components/IconAntd';
import TableComponent from '@/components/TableComponent';
import TopBar from '@/components/TopBar';
import useCallContext from '@/hooks/useCallContext';
import Container from '@/layout/Container';
import { rules } from '@/rules';
import { handleObjectEmpty, momentToStringDate, Notification, wait } from '@/utils';
import { Button, Col, Form, Modal, Row, Space, TimePicker } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import ModalConfig from '../components/ModalConfig';
import { columns } from '../components/Unit.Config';
import { ConfigService } from '../service';
import dayjs from 'dayjs';
import useWindowSize from '@/hooks/useWindowSize';
import { TAB_MOBLIE } from '@/config/theme';
import { useWatch } from 'antd/lib/form/Form';
const initialFilterQuery = {};

const initialValue = {
    id: undefined,
    code: '',
    name: '',
};

const ConfigPage = () => {
    const { state } = useCallContext();
    const [values, setValues] = React.useState<any | null>(null);
    const [filterQuery, setFilterQuery] = React.useState<any>(initialFilterQuery);
    const [page, setPage] = React.useState(1);
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [openModal, setOpenModal] = React.useState<boolean>(false);
    const [loadingClearFilter, setLoadingClearFilter] = React.useState(false);
    const width = useWindowSize();

    const {
        data: color,
        refetch,
        isRefetching,
    } = useQuery<any>(['ConfigService', page, filterQuery], () => ConfigService.get({ page, ...filterQuery }));
    const getDataTime = async () => {
        const data = await ConfigService.getTimes();
        if (data?.status) {
            form1.setFieldsValue({
                morningTime: moment(data?.data?.morningTime, 'HH:mm'),
                afternoonTime: moment(data?.data.afternoonTime, 'HH:mm'),
            });
        }
    };

    useEffect(() => {
        getDataTime();
    }, []);
    React.useEffect(() => {
        refetch();
    }, [state.syncLoading]);

    const onClearFilter = () => {
        setLoadingClearFilter(true);
        wait(1500).then(() => {
            setFilterQuery(initialFilterQuery);
            setPage(1);
            setLoadingClearFilter(false);
        });
    };

    const onClickAddCategory = () => {
        formReset();
        setOpenModal(true);
        refetch();
    };

    const formReset = () => {
        form.setFieldsValue(initialValue);
    };

    const handleShowModal = (record: any) => {
        setValues(record);
        setOpenModal(true);
    };
    const handleCloseForm = React.useCallback((trick = '') => {
        setOpenModal(false);
        setValues(null);
        if (trick === 'notRefresh') return;
        refetch();
        formReset();
    }, []);
    const handleSubmit = async (data: any) => {
        console.log('🚀 ~ handleSubmit ~ data:', data);
        await ConfigService.updateTimes({
            // afternoonTime: data?.afternoonTime,
            morningTime: moment(data?.morningTime).format('HH:mm'),
            afternoonTime: '22:00',
        }).then(() => {
            Notification('success', 'Cập nhật thời gian thành công!');
        });
    };
    return (
        <>
            <TopBar title="Cấu hình hệ thống" />
            <Container>
                <Form form={form1} layout="horizontal" onFinish={handleSubmit} style={{ marginBottom: 0 }}>
                    <CardComponent>
                        <Row justify="space-between">
                            <Form.Item
                                rules={[rules.required('Vui lòng nhập thời gian!')]}
                                name="morningTime"
                                label="Thời gian gửi thông báo công việc"
                                style={{
                                    marginLeft: 30,
                                    marginBottom: 2,
                                }}
                            >
                                <TimePicker style={{ width: width.width <= TAB_MOBLIE ? '70%' : 200 }} format="HH:mm" />
                            </Form.Item>

                            <Button style={{ marginRight: 24 }} htmlType="submit" type="primary">
                                Lưu
                            </Button>
                        </Row>
                    </CardComponent>
                </Form>
                <CardComponent
                    title="Danh sách đơn vị"
                    extra={[
                        <Button type="primary" onClick={onClickAddCategory}>
                            Thêm mới
                        </Button>,
                    ]}
                >
                    <TableComponent
                        showFilter={true}
                        reLoadData={() => refetch()}
                        showTotalResult
                        loading={isRefetching}
                        page={page}
                        rowSelect={false}
                        onChangePage={(_page) => setPage(_page)}
                        dataSource={color?.data || []}
                        columns={[
                            ...columns(page),
                            {
                                title: 'Ngày tạo',
                                dataIndex: 'createdAt',
                                align: 'center',
                                width: 200,
                                render: (value: any) => momentToStringDate(value),
                            },
                            {
                                title: 'Thao tác',
                                dataIndex: 'action',
                                align: 'center',
                                width: 80,
                                render: (value: any, row: any) => {
                                    return (
                                        <div
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            style={{ display: 'flex', justifyContent: 'center' }}
                                        >
                                            <Button
                                                onClick={() => {
                                                    handleShowModal(row);
                                                }}
                                                style={{ border: 'none' }}
                                                icon={<IconAntd style={{ border: 'none' }} icon="EditOutlined" />}
                                            />
                                            <Button
                                                onClick={() => {
                                                    Modal.confirm({
                                                        title: 'Bạn có chắc chắn muốn xoá đơn vị này?',
                                                        onOk: async () => {
                                                            await ConfigService.delete(row?.id).then((res) => {
                                                                if (res?.status) {
                                                                    refetch();
                                                                    Notification('success', 'Xoá đơn vị thành công');
                                                                }
                                                            });
                                                        },
                                                    });
                                                }}
                                                style={{ border: 'none' }}
                                                icon={<IconAntd style={{ background: 'none' }} icon="DeleteOutlined" />}
                                            />
                                        </div>
                                    );
                                },
                            },
                        ]}
                        total={color && color?.paging?.totalItem}
                    />
                </CardComponent>
            </Container>
            <ClearFilter
                hidden={
                    Object.values(handleObjectEmpty(filterQuery))?.filter(
                        (item: any) => item !== undefined && item !== ''
                    ).length > 0
                }
                onClick={onClearFilter}
            />
            <ModalConfig
                setValues={setValues}
                openModal={openModal}
                values={values}
                handleCloseForm={handleCloseForm}
                refetch={refetch}
            />
        </>
    );
};

export default ConfigPage;
