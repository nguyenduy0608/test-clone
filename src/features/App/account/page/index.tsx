import CardComponent from '@/components/CardComponent';
import TableComponent from '@/components/TableComponent';
import TopBar from '@/components/TopBar';
import Container from '@/layout/Container';
import { Button, Form } from 'antd';
import React from 'react';
import { useQuery } from 'react-query';
import { DataTypeAccount, columns } from '../component/Account.Config';

import { IFilter } from '@/types';
import Description from '../component/Description';
import Filter from '../component/Filter';
import accountService from '../service';
import AccountFormPage from './form';
const initialFilterQuery = {};
const initialValue = {
    fullName: '',
    email: '',
    avatar: '',
    phoneNumber: '',
    createdAt: '',
    updatedAt: '',
    password: '',
    accountId: '',
    passwordConfirmation: '',
};

const AccountPage = () => {
    const [form] = Form.useForm();

    const [filterQuery, setFilterQuery] = React.useState(initialFilterQuery);
    const [loadingModal, setLoadingModal] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [rowSelected, setRowSelected] = React.useState<DataTypeAccount[] | null>(null);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [values, setValues] = React.useState<DataTypeAccount | null>(null);

    const {
        data: account,
        isLoading,
        refetch,
        isRefetching,
    } = useQuery<any>(['account', page, filterQuery], () => accountService.get({ page, ...filterQuery }));

    const onRowSelection = React.useCallback((row: DataTypeAccount[]) => {
        setRowSelected(row);
    }, []);
    const handleShowModal = (record: DataTypeAccount) => {
        setValues(record);
        setModalVisible(true);
    };
    const handleCloseForm = React.useCallback((trick = '') => {
        setValues(null);
        setModalVisible(false);
        if (trick === 'notRefresh') return;
        refetch();
        form.setFieldsValue(initialValue);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const rowRender = (record: DataTypeAccount, index: number, indent: number, expanded: any) => {
        const row = document.querySelector(`[data-row-key="${record.id}"]`);
        if (expanded) {
            row?.classList.add('rowTableSelect');
        } else {
            row?.classList.remove('rowTableSelect');
        }

        return <Description record={record} handleShowModal={() => handleShowModal(record)} refetch={refetch} />;
    };

    const returnFilter = React.useCallback(
        (filter: IFilter) => {
            setPage(1);
            setFilterQuery({ ...filterQuery, ...filter });
        },
        [filterQuery]
    );

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
                title="Tài khoản"
            />
            <Container>
                <CardComponent title={<Filter returnFilter={returnFilter} key="filter" />}>
                    <TableComponent
                        showTotalResult
                        reLoadData={refetch}
                        loading={isRefetching || loadingModal}
                        page={page}
                        rowSelect={false}
                        onChangePage={(_page) => {
                            return setPage(_page);
                        }}
                        expandedRowRender={rowRender}
                        onRowSelection={onRowSelection}
                        dataSource={account ? account.data : []}
                        columns={[...columns(page)]}
                        total={account && account?.paging?.totalItem}
                    />
                </CardComponent>
                <AccountFormPage modalVisible={modalVisible} values={values} handleCloseForm={handleCloseForm} />
            </Container>
        </>
    );
};

export default AccountPage;
