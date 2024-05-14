import CardComponent from '@/components/CardComponent';
import TopBar from '@/components/TopBar';
import Container from '@/layout/Container';
import { Button, Form, Input, Modal, Row, Space, Switch, Tag, message } from 'antd';
import React from 'react';
import Filter from '../components/Filter';
import TableComponent from '@/components/TableComponent';
import { IFilter } from '@/types';
import { DataType, columns } from '../components/Work.Config';
import Description from '../components/Description';
import { routerPage } from '@/config/contants.routes';
import { useLocation, useNavigate } from 'react-router-dom';
import { workService } from '../services';
import { useQuery } from 'react-query';
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    LoadingOutlined,
    StopOutlined,
} from '@ant-design/icons';
import IconAntd from '@/components/IconAntd';
import { Notification } from '@/utils';
import { STATUS_WORK } from '@/contants';
import FormComponent from '@/components/FormComponent';
import FormItemComponent from '@/components/FormComponent/FormItemComponent';
import SaveButton from '@/components/Button/Save.Button';
import ModalComponent from '@/components/ModalComponent';
import { rules } from '@/rules';
import useCallContext from '@/hooks/useCallContext';
import axios from 'axios';
const initialFilterQuery = {
    task_id: undefined,
};

const ProductPage = () => {
    const [form] = Form.useForm();
    const navigator = useNavigate();
    const [filterQuery, setFilterQuery] = React.useState(initialFilterQuery);
    const [page, setPage] = React.useState(1);
    const [keyExpan, setKeyExpan] = React.useState<any>('');

    const location = useLocation();
    const { state } = useCallContext();

    const initialValue = {
        reason_for_cancellation: '',
    };
    const apiUrl = 'https://b121-2405-4802-1cae-d580-e0cf-60e4-dc25-b862.ngrok-free.app/api/Products';

    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['products', page, filterQuery, location], () =>
        axios.get(apiUrl, { params: { page, ...filterQuery } })
    );
    console.log('🚀 ~ ProductPage ~ data:', data);

    const formReset = () => {
        form.setFieldsValue(initialValue);
    };
    const returnFilter = React.useCallback(
        (filter: IFilter) => {
            setPage(1);
            setFilterQuery({ ...filterQuery, ...filter });
        },
        [filterQuery]
    );

    // const rowRender = (record: DataType, index: number, indent: number, expanded: any) => {
    //     const row = document.querySelector(`[data-row-key="${record?.id}"]`);
    //     if (expanded) {
    //         row?.classList.add('rowTableSelect');
    //     } else {
    //         row?.classList.remove('rowTableSelect');
    //     }
    //     return <Description record={record} refetch={refetch} expanded={expanded} />;
    // };
    return (
        <>
            <TopBar
                extra={
                    <Button
                        key="add"
                        type="primary"
                        className="gx-mb-0"
                        onClick={() => {
                            navigator(routerPage.addProduct);
                        }}
                    >
                        Thêm mới
                    </Button>
                }
                title="Sản phẩm"
            />
            <Container>
                <CardComponent title={<Filter returnFilter={returnFilter} key="filter" />}>
                    <TableComponent
                        showTotalResult
                        expandedRowKeys={keyExpan}
                        reLoadData={refetch}
                        loading={isRefetching || isLoading}
                        page={page}
                        rowSelect={false}
                        onChangePage={(_page) => setPage(_page)}
                        // expandedRowRender={rowRender}
                        dataSource={data?.data}
                        total={data && data?.paging?.totalItem}
                        columns={[
                            ...columns(page),

                            {
                                title: 'Thao tác',
                                dataIndex: 'action',
                                align: 'center',
                                width: 120,
                                render: (value, record, index) => (
                                    <Row justify="center">
                                        <Button
                                            icon={<IconAntd icon="EditOutlined" />}
                                            style={{ border: 'none' }}
                                            onClick={() => {
                                                navigator(`/product/form/${record?.id}`, {
                                                    state: {
                                                        ...filterQuery,
                                                        page,
                                                        prevUrl: location.pathname,
                                                    },
                                                });
                                            }}
                                        />
                                        <Button
                                            icon={<IconAntd icon="DeleteOutlined" />}
                                            style={{
                                                border: 'solid 0px #d9d9d9',
                                            }}
                                            onClick={(e) => {}}
                                        ></Button>
                                    </Row>
                                ),
                            },
                        ]}
                    />
                </CardComponent>
            </Container>
        </>
    );
};

export default ProductPage;
