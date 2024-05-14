import CardComponent from '@/components/CardComponent';
import TopBar from '@/components/TopBar';
import Container from '@/layout/Container';
import { Button, Modal, Row } from 'antd';
import React from 'react';
import Filter from '../components/Filter';
import TableComponent from '@/components/TableComponent';
import { IFilter } from '@/types';
import { routerPage } from '@/config/contants.routes';
import { useNavigate } from 'react-router-dom';
import { seasonsService } from '../services';
import { useQuery } from 'react-query';
import { columns } from '../components/Season.Config';
import IconAntd from '@/components/IconAntd';
import { Notification } from '@/utils';
import { STATUS_SEASON } from '@/contants';
const initialFilterQuery = {};
const SeasonPage = () => {
    const navigate = useNavigate();
    const [filterQuery, setFilterQuery] = React.useState(initialFilterQuery);
    const [page, setPage] = React.useState(1);

    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['seasons', page, filterQuery], () =>
        seasonsService.get({ page, ...filterQuery })
    );
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
                        // style={{ background: BACKGROUND, color: COLOR }}
                        className="gx-mb-0"
                        onClick={() => {
                            // setModalVisible(true);
                            navigate(routerPage.addSeason);
                        }}
                    >
                        Thêm mới
                    </Button>
                }
                title="Danh sách vụ mùa"
            />
            <Container>
                <CardComponent title={<Filter returnFilter={returnFilter} key="filter" />}>
                    <TableComponent
                        showTotalResult
                        // onRowClick={(record: any) => {
                        //     navigate(`/season/detail/${record.id}`);
                        // }}
                        loading={isRefetching || isLoading}
                        page={page}
                        rowSelect={false}
                        onChangePage={(_page) => setPage(_page)}
                        // onRowSelection={onRowSelection}
                        dataSource={data?.data}
                        columns={[
                            ...columns(page),
                            {
                                title: 'Thao tác',
                                dataIndex: 'action',
                                align: 'left',
                                width: 120,
                                render: (_, record: any) => (
                                    <Row justify="start">
                                        <Button
                                            icon={<IconAntd icon="EditOutlined" />}
                                            type="link"
                                            onClick={() => {
                                                navigate(`/season/detail/${record.id}`, {
                                                    state: { filterQuery, page, prevUrl: location.pathname },
                                                });
                                            }}
                                        />
                                        {record?.status === STATUS_SEASON.InProgress ? (
                                            <Button
                                                onClick={() => {
                                                    Modal.confirm({
                                                        title: 'Xóa vụ mùa',
                                                        content: 'Bạn có chắc chắn muốn xoá vụ mùa này?',
                                                        onOk: async () => {
                                                            await seasonsService
                                                                .delete({ seasonId: Number(record?.id) })
                                                                .then((res) => {
                                                                    if (res?.status) {
                                                                        refetch();
                                                                        Notification(
                                                                            'success',
                                                                            'Xoá vụ mùa thành công'
                                                                        );
                                                                    }
                                                                });
                                                        },
                                                    });
                                                }}
                                                type="link"
                                                icon={<IconAntd icon="DeleteOutlined" />}
                                            />
                                        ) : (
                                            <></>
                                        )}
                                    </Row>
                                ),
                            },
                        ]}
                        total={data && data?.paging?.totalItem}
                    />
                </CardComponent>
                {/* <AccountFormPage modalVisible={modalVisible} values={values} handleCloseForm={handleCloseForm} /> */}
            </Container>
        </>
    );
};

export default SeasonPage;
