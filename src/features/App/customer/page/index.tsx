import CardComponent from '@/components/CardComponent';
import IconAntd from '@/components/IconAntd';
import TableComponent from '@/components/TableComponent';
import TopBar from '@/components/TopBar';
import { routerPage } from '@/config/contants.routes';
import useCallContext from '@/hooks/useCallContext';
import Container from '@/layout/Container';
import { IFilter } from '@/types';
import { Button, Form, Popconfirm, Row, Space } from 'antd';
import React from 'react';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import Filter from '../components/Filter';
import { columns } from '../components/Customer.Config';
import { customerServices } from '../services';
import CustomerForm from './form';
import Axios from 'axios';
import axios from 'axios';
import { Notification } from '@/utils';
import moment from 'moment';
import BuyForm from '../components/BuyProduct';
const initialFilterQuery = {
    task_id: undefined,
};

const CustomerPage = () => {
    const [form] = Form.useForm();
    const navigator = useNavigate();
    const [filterQuery, setFilterQuery] = React.useState(initialFilterQuery);
    const [page, setPage] = React.useState(1);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalVisibleBuy, setModalVisibleBuy] = React.useState(false);
    const [keyExpan, setKeyExpan] = React.useState<any>('');
    const [values, setValues] = React.useState<any>();
    const [valuesUser, setValuesUser] = React.useState<any>();
    const location = useLocation();
    const { state } = useCallContext();

    const { data, isLoading, error, refetch, isRefetching } = useQuery('customers', fetchCustomers);
    const apiUrl = 'http://localhost:5243/api/Customers';

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
    };
    const handleCloseForm = () => {
        refetch();
        setModalVisible(false);
        setValues(null);
    };
    const handleCloseByForm = () => {
        setModalVisibleBuy(false);
        setValues(null);
    };
    const getRandomDateIn2023 = () => {
        const start = moment('2023-01-01');
        const end = moment('2023-12-31');
        const randomDate = moment(start).add(Math.random() * end.diff(start), 'milliseconds');
        return randomDate.format('YYYY-MM-DD');
    };
    const deleteCustomerById = async (id: number) => {
        const url = `${apiUrl}/${id}`;

        try {
            const response = await axios.delete(url);

            Notification('success', 'Xóa khách hàng thành công');
            refetch();
        } catch (error) {
            console.error('Error deleting customer:');
            throw error;
        }
    };

    const handleAdd = async (record: any) => {
        const customerID = record.id;
        const paidDate = getRandomDateIn2023();

        try {
            const res = await axios.post(
                `http://localhost:5243/api/Cart?customerID=${customerID}&paidDate=${paidDate}`
            );
            console.log('Response:', res.data);
        } catch (error) {
            console.error('Error adding to cart:', error);
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
                        dataSource={data}
                        total={data && data.length}
                        columns={[
                            ...columns(page),

                            {
                                title: 'Thao tác',
                                dataIndex: 'action',
                                align: 'center',
                                width: 120,
                                render: (value, record, index) => (
                                    <Space>
                                        <Button
                                            onClick={() => {
                                                handleAdd(record);
                                            }}
                                            style={{ border: 'none' }}
                                            icon={<IconAntd icon={'PlusOutlined'} />}
                                        ></Button>
                                        <Button
                                            onClick={() => {
                                                setModalVisibleBuy(true);
                                                setValuesUser(record);
                                            }}
                                            style={{ border: 'none' }}
                                            icon={<IconAntd icon={'BoldOutlined'} />}
                                        ></Button>
                                        <Button
                                            icon={<IconAntd icon="EditOutlined" />}
                                            style={{ border: 'none' }}
                                            onClick={() => handleShowModal(record)}
                                        />

                                        <Popconfirm
                                            cancelButtonProps={{
                                                style: {
                                                    margin: 0,
                                                },
                                            }}
                                            title={<strong>{`Bạn chắc chắn muốn xoá khách hàng này?`}</strong>}
                                            onConfirm={() => deleteCustomerById(record?.id)}
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
                                    </Space>
                                ),
                            },
                        ]}
                    />
                </CardComponent>
                <BuyForm values={valuesUser} modalVisible={modalVisibleBuy} handleCloseForm={handleCloseByForm} />
                <CustomerForm modalVisible={modalVisible} values={values} handleCloseForm={handleCloseForm} />
            </Container>
        </>
    );
};

export default CustomerPage;
