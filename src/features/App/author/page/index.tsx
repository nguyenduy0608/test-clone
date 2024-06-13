import CardComponent from '@/components/CardComponent';
import IconAntd from '@/components/IconAntd';
import TableComponent from '@/components/TableComponent';
import TopBar from '@/components/TopBar';
import { routerPage } from '@/config/contants.routes';
import useCallContext from '@/hooks/useCallContext';
import Container from '@/layout/Container';
import { IFilter } from '@/types';
import { Button, Form, Popconfirm, Row } from 'antd';
import React from 'react';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import Filter from '../components/Filter';
import { columns } from '../components/Author.Config';
import { authorServices } from '../services';
import AuthorForm from './form';
import axios from 'axios';
import { Notification } from '@/utils';
const initialFilterQuery = {
    task_id: undefined,
};

const AuthorPage = () => {
    const [form] = Form.useForm();
    const navigator = useNavigate();
    const [filterQuery, setFilterQuery] = React.useState(initialFilterQuery);
    const [page, setPage] = React.useState(1);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [keyExpan, setKeyExpan] = React.useState<any>('');
    const [values, setValues] = React.useState<any>();
    const [isNameWork, setIsNameWork] = React.useState<string>('');
    const location = useLocation();
    const { state } = useCallContext();
    const apiUrl = 'http://localhost:5243/api/authors';

    const { data, isLoading, refetch, isRefetching } = useQuery('customers', fetchCustomers);

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
        refetch();
        setValues(null);
    };
    const deleteAuthorById = async (id: number) => {
        const url = `${apiUrl}/${id}`;

        try {
            const response = await axios.delete(url);

            Notification('success', 'Xóa tác giả thành công');
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
                            setModalVisible(true);
                        }}
                    >
                        Thêm mới
                    </Button>
                }
                title="Tác giả"
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
                                    <Row justify="center">
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
                                            title={<strong>{`Bạn chắc chắn muốn xoá tác giả này?`}</strong>}
                                            onConfirm={() => deleteAuthorById(record?.id)}
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
                <AuthorForm modalVisible={modalVisible} values={values} handleCloseForm={handleCloseForm} />
            </Container>
        </>
    );
};

export default AuthorPage;
