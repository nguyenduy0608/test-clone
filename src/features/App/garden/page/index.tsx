import CardComponent from '@/components/CardComponent';
import TopBar from '@/components/TopBar';
import Container from '@/layout/Container';
import { Button, Modal, Row, Switch } from 'antd';
import React from 'react';
import Filter from '../components/Filter';
import TableComponent from '@/components/TableComponent';
import { IFilter } from '@/types';
import { DataType, columns } from '../components/Garden.Config';
import Description from '../components/Description';
import { routerPage } from '@/config/contants.routes';
import { useNavigate } from 'react-router-dom';
import { gardenService } from '../services';
import { useQuery } from 'react-query';
import IconAntd from '@/components/IconAntd';
import { Notification } from '@/utils';
const initialFilterQuery = {};
const GardenPage = () => {
    const navigator = useNavigate();
    const [filterQuery, setFilterQuery] = React.useState(initialFilterQuery);
    const [page, setPage] = React.useState(1);

    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['gardens', page, filterQuery], () =>
        gardenService.get({ page, ...filterQuery })
    );
    const returnFilter = React.useCallback(
        (filter: IFilter) => {
            setPage(1);
            setFilterQuery({ ...filterQuery, ...filter });
        },
        [filterQuery]
    );

    const rowRender = (record: DataType, index: number, indent: number, expanded: any) => {
        const row = document.querySelector(`[data-row-key="${record.id}"]`);
        if (expanded) {
            row?.classList.add('rowTableSelect');
        } else {
            row?.classList.remove('rowTableSelect');
        }

        return <Description record={record} refetch={refetch} />;
    };
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
                            navigator(routerPage.addGarden);
                        }}
                    >
                        Thêm mới
                    </Button>
                }
                title="Danh sách vườn"
            />
            <Container>
                <CardComponent title={<Filter returnFilter={returnFilter} key="filter" />}>
                    <TableComponent
                        showTotalResult
                        loading={isRefetching || isLoading}
                        page={page}
                        rowSelect={false}
                        onChangePage={(_page) => setPage(_page)}
                        expandedRowRender={rowRender}
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
                                                    ? gardenService.lock(row.id).then((res) => {
                                                          if (res.status) {
                                                              Notification('success', 'Cập nhật trạng thái thành công');
                                                              refetch();
                                                          } else {
                                                              Notification('error', 'Cập nhật trạng thái thất bại');
                                                          }
                                                      })
                                                    : gardenService.unlock(row.id).then((res) => {
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
                                width: 120,
                                render: (_, record: any) => (
                                    <Row justify="center">
                                        <Button
                                            icon={<IconAntd icon="EditOutlined" />}
                                            style={{ border: 'none' }}
                                            onClick={() => {
                                                navigator(`/garden/form/${record.id}`, {
                                                    state: { filterQuery, page, prevUrl: location.pathname },
                                                });
                                            }}
                                        />
                                       <Button
                                            onClick={() => {
                                                Modal.confirm({
                                                    title: 'Bạn có chắc chắn muốn xoá vườn này?',
                                                    onOk: async () => {
                                                        await gardenService.delete({ gardenId: Number(record.id) }).then((res) => {
                                                            if (res?.status) {
                                                                refetch();
                                                                Notification('success', 'Xoá vườn thành công');
                                                            }
                                                        });
                                                    },
                                                });
                                            }}
                                            style={{ border: 'none' }}
                                            icon={<IconAntd style={{ background: 'none' }} icon="DeleteOutlined" />}
                                        /> 
                                    </Row>
                                    
                                ),
                            },
                        ]}
                        total={data && data?.paging?.totalItem}
                    />
                </CardComponent>
            </Container>
        </>
    );
};

export default GardenPage;
