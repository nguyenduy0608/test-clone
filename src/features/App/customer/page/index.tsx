import CardComponent from '@/components/CardComponent';
import IconAntd from '@/components/IconAntd';
import TableComponent from '@/components/TableComponent';
import TopBar from '@/components/TopBar';
import { routerPage } from '@/config/contants.routes';
import useCallContext from '@/hooks/useCallContext';
import Container from '@/layout/Container';
import { IFilter } from '@/types';
import { Button, Form, Row } from 'antd';
import React from 'react';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import Filter from '../components/Filter';
import { columns } from '../components/Customer.Config';
import { customerServices } from '../services';
import CustomerForm from './form';
import Axios from 'axios';
import axios from 'axios';
const initialFilterQuery = {
    task_id: undefined,
};

const CustomerPage = () => {
    const [form] = Form.useForm();
    const navigator = useNavigate();
    const [filterQuery, setFilterQuery] = React.useState(initialFilterQuery);
    const [page, setPage] = React.useState(1);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [keyExpan, setKeyExpan] = React.useState<any>('');
    const [values, setValues] = React.useState<any>();
    const location = useLocation();
    const { state } = useCallContext();

    const { data, isLoading, error, refetch, isRefetching } = useQuery('customers', fetchCustomers);
    const apiUrl = 'https://a4d7-2405-4802-1cae-d580-f4f8-da7f-56a1-fefa.ngrok-free.app/api/Customers';

    async function fetchCustomers() {
        try {
            const response = await axios.get(apiUrl, {
                // headers: {
                //     accept: 'text/plain',
                // },
                // params: {
                //     page,
                //     ...filterQuery,
                // },
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch customers');
        }
    }

    const returnFilter = React.useCallback(
        (filter: IFilter) => {
            setPage(1);
            setFilterQuery({ ...filterQuery, ...filter });
        },
        [filterQuery]
    );
    const handleShowModal = (record: any) => {
        setValues(record);
        setModalVisible(true);
        setValues(record);
    };
    const handleCloseForm = () => {
        setModalVisible(false);
        setValues(null);
    };

    const deleteCustomerById = async (id: number) => {
        const url = `${apiUrl}/${id}`;

        try {
            const response = await axios.delete(url);

            if (response.status !== 200) {
                throw new Error('Failed to delete customer');
            }

            return response.data; // Trả về dữ liệu phản hồi từ API nếu cần
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
                            setModalVisible(true);
                        }}
                    >
                        Thêm mới
                    </Button>
                }
                title="Khách hàng"
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
                                            onClick={() => handleShowModal(record)}
                                        />
                                        <Button
                                            style={{
                                                border: 'solid 0px #d9d9d9',
                                            }}
                                            icon={<IconAntd icon="DeleteOutlined" />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteCustomerById(record?.id);
                                            }}
                                        ></Button>
                                    </Row>
                                ),
                            },
                        ]}
                    />
                </CardComponent>
                <CustomerForm modalVisible={modalVisible} values={values} handleCloseForm={handleCloseForm} />
            </Container>
        </>
    );
};

export default CustomerPage;
