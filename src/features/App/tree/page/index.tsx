import CardComponent from '@/components/CardComponent';
import TableComponent from '@/components/TableComponent';
import TopBar from '@/components/TopBar';
import { routerPage } from '@/config/contants.routes';
import Container from '@/layout/Container';
import { IFilter } from '@/types';
import { Button, Modal, Popconfirm, Switch } from 'antd';
import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import Filter from '../components/Filter';
import { columns } from '../components/Tree.Config';
import { flowerService } from '../services';
import IconAntd from '@/components/IconAntd';
import { Notification } from '@/utils';
const initialFilterQuery = {};
const TreePage = () => {
    const navigator = useNavigate();
    const [filterQuery, setFilterQuery] = React.useState(initialFilterQuery);
    const [page, setPage] = React.useState(1);
    const navigate = useNavigate();
    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['flower', page, filterQuery], () =>
        flowerService.get({ page, ...filterQuery })
    );
    React.useEffect(() => {
        refetch();
    }, [data])
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
                            navigator(routerPage.addTree);
                        }}
                    >
                        Thêm mới
                    </Button>
                }
                title="Danh sách cây trồng"
            />
            <Container>
                <CardComponent title={<Filter returnFilter={returnFilter} key="filter" />}>
                    <TableComponent
                        showTotalResult
                        loading={isRefetching || isLoading}
                        page={page}
                        rowSelect={false}
                        onChangePage={(_page) => setPage(_page)}
                        // expandedRowRender={rowRender}
                        // onRowSelection={onRowSelection}
                        dataSource={data?.data}
                        columns={[
                            ...columns(page),
                            {
                                title: 'Trạng thái',
                                dataIndex: 'status',
                                align: 'center',
                                // width: 40,
                                render: (value: number, row: any) => (
                                    <div
                                        onClick={(e: any) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    >
                                        <Switch
                                            onChange={(value) => {
                                                row.status
                                                    ? flowerService.lock(row.id).then((res) => {
                                                          if (res.status) {
                                                              Notification('success', 'Cập nhật trạng thái thành công');
                                                              refetch();
                                                          } else {
                                                              Notification('error', 'Cập nhật trạng thái thất bại');
                                                          }
                                                      })
                                                    : flowerService.unlock(row.id).then((res) => {
                                                          if (res.status) {
                                                              Notification('success', 'Cập nhật trạng thái thành công');
                                                              refetch();
                                                          } else {
                                                              Notification('error', 'Cập nhật trạng thái thất bại');
                                                          }
                                                      });
                                            }}
                                            defaultChecked={!!value}
                                        />
                                    </div>
                                ),
                            },
                            {
                                title: 'Thao tác',
                                dataIndex: 'action',
                                align: 'center',
                                render: (value: any, row: any) => {
                                    return (
                                        <>
                                            <Button
                                                onClick={() => {
                                                    navigate(`/tree/form/${row.id}`);
                                                }}
                                                style={{ border: 'none' }}
                                                icon={<IconAntd icon="EditOutlined" />}
                                            />

                                                <Button
                                                onClick={() => {
                                                    Modal.confirm({
                                                        title: 'Bạn có chắc chắn muốn xoá cây trồng này?',
                                                        onOk: async () => {
                                                            await flowerService.delete({ flowerId: row.id }).then((res) => {
                                                                if (res?.status) {
                                                                    refetch();
                                                                    Notification('success', 'Xoá cây trồng thành công');
                                                                }
                                                            });
                                                        },
                                                    });
                                                }}
                                                style={{ border: 'none' }}
                                                icon={<IconAntd style={{ background: 'none' }} icon="DeleteOutlined" />}
                                            />
                                        </>
                                    );
                                },
                            },
                        ]}
                        total={data && data?.paging?.totalItem}
                    />
                </CardComponent>
            </Container>
        </>
    );
};

export default TreePage;
