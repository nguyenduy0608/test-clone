import CardComponent from '@/components/CardComponent';
import IconAntd from '@/components/IconAntd';
import TableComponent from '@/components/TableComponent';
import TopBar from '@/components/TopBar';
import { routerPage } from '@/config/contants.routes';
import useCallContext from '@/hooks/useCallContext';
import Container from '@/layout/Container';
import { IFilter } from '@/types';
import { Notification } from '@/utils';
import { Button, Form, Popconfirm, Row } from 'antd';
import axios from 'axios';
import React from 'react';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import Filter from '../components/Filter';
import { columns } from '../components/Work.Config';
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
    const apiUrl = 'http://localhost:5243/api/Products';

    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['products', page, filterQuery, location], () =>
        axios.get(apiUrl, { params: { page, ...filterQuery } })
    );

    const returnFilter = React.useCallback(
        (filter: IFilter) => {
            setPage(1);
            setFilterQuery({ ...filterQuery, ...filter });
        },
        [filterQuery]
    );

    const deleteProductById = async (id: number) => {
        const url = `${apiUrl}/${id}`;

        try {
            const response = await axios.delete(url);

            Notification('success', 'Xóa sản phẩm thành công');
            refetch();
        } catch (error) {
            console.error('Error deleting customer:');
            throw error;
        }
    };
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
                <CardComponent
                // title={<Filter returnFilter={returnFilter} key="filter" />}
                >
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
                        total={data && data?.data.length}
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
                                        <Popconfirm
                                            cancelButtonProps={{
                                                style: {
                                                    margin: 0,
                                                },
                                            }}
                                            title={<strong>{`Bạn chắc chắn muốn xoá sản phẩm này?`}</strong>}
                                            onConfirm={() => deleteProductById(record?.id)}
                                        >
                                            <Button
                                                style={{ color: 'red', border: 'none' }}
                                                icon={<IconAntd size="20px" icon="DeleteOutlined" />}
                                                key="delete"
                                                danger
                                                className="gx-mb-0"
                                                type="dashed"
                                            ></Button>
                                        </Popconfirm>
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
