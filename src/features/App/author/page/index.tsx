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
import { columns } from '../components/Author.Config';
import { authorServices } from '../services';
import AuthorForm from './form';
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

    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['customers', page, filterQuery, location], () =>
        authorServices.get({ page, ...filterQuery })
    );
    React.useEffect(() => {
        refetch();
    }, [state?.callbackNoti]);

    React.useEffect(() => {
        if (location?.state?.page) {
            setPage(location?.state?.page);
        }
        setIsNameWork(location?.state?.isNameWork || '');
        if (location?.state?.isFromNoti) {
            setKeyExpan(location?.state?.isFromNoti);
            setPage(1);
            setFilterQuery({ task_id: location?.state?.isFromNoti });
        }
    }, [location]);

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
                                                // handleShowModal(record);
                                            }}
                                        ></Button>
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
