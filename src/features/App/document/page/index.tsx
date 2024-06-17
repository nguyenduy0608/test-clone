import { images } from '@/assets/imagesAssets';
import CardComponent from '@/components/CardComponent';
import IconAntd from '@/components/IconAntd';
import TopBar from '@/components/TopBar';
import { routerPage } from '@/config/contants.routes';
import { NEWS_STATUS } from '@/contants';
import Container from '@/layout/Container';
import { IFilter } from '@/types';
import { Notification, momentToStringDate } from '@/utils';
import { EditOutlined } from '@ant-design/icons';
import { Avatar, Button, List, Popconfirm, Tag } from 'antd';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import Filter from '../components/Filter';
import { documentService } from '../services';
import TableComponent from '@/components/TableComponent';
import { columns } from '../components/Document.Config';
import axios from 'axios';
const initialFilterQuery = {};
const DocumentPage = () => {
    const [filterQuery, setFilterQuery] = React.useState(initialFilterQuery);
    const [page, setPage] = React.useState(1);
    const navigator = useNavigate();
    const location = useLocation();
    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['document', page, filterQuery], () =>
        axios.get('http://localhost:5243/api/Cart/getUnpaidCartsByUserId?userId=1')
    );
    console.log('🚀 ~ DocumentPage ~ data:', data);

    const returnFilter = React.useCallback(
        (filter: IFilter) => {
            setPage(1);
            setFilterQuery({ ...filterQuery, ...filter });
        },
        [filterQuery]
    );
    React.useEffect(() => {
        refetch();
        if (location.state && location.state.page) {
            // Nếu có, cập nhật trang thái của trang
            setPage(location.state.page);
        }
    }, [location]);
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
                            navigator(routerPage.addDocument, {
                                state: { ...filterQuery, page, prevUrl: location.pathname },
                            });
                        }}
                    >
                        Thêm mới
                    </Button>
                }
                title="Đơn hàng"
            />
            <Container>
                <CardComponent>
                    <TableComponent
                        showTotalResult
                        loading={isRefetching || isLoading}
                        page={page}
                        rowSelect={false}
                        onChangePage={(_page) => setPage(_page)}
                        dataSource={data?.data}
                        columns={[
                            ...columns(page),
                            {
                                title: 'Thao tác',
                                dataIndex: 'action',
                                align: 'center',
                                width: 120,
                                render: (value, record: any, index) => (
                                    <Button
                                        type="link"
                                        icon={<IconAntd icon="SelectOutlined" />}
                                        style={{ border: 'none' }}
                                        onClick={async () => {
                                            const res = await axios.post(
                                                `http://localhost:5243/api/Cart/update-Cart-Status?cartId=${record?.id}&status=dathanhtoan`
                                            );
                                            if (res.status) {
                                                refetch();
                                                Notification('success', `Chấp nhận đơn hàng ${record?.id} thành công`);
                                            }
                                        }}
                                    />
                                ),
                            },
                        ]}
                        total={data && data?.data?.length}
                    />
                </CardComponent>
            </Container>
        </>
    );
};
export default DocumentPage;
