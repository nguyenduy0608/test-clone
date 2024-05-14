import CardComponent from '@/components/CardComponent';
import TableComponent from '@/components/TableComponent';
import { Descriptions, Pagination, Space, Typography } from 'antd';
import React from 'react';
import { columnsGeneral, columnsHistory } from './Season.Config';
import { currencyFormat, momentToStringDate } from '@/utils';
import { STATUS_SEASON, TYPE_FLOWER } from '@/contants';
import TagResult from '@/components/TagResult';
import moment from 'moment';
import { RECORD_SIZE, TAB_MOBLIE } from '@/config/theme';
import { useQuery } from 'react-query';
import { seasonsService } from '../services';
import { useParams } from 'react-router-dom';
import useWindowSize from '@/hooks/useWindowSize';
const { Text, Title } = Typography;
const GeneralInformation = ({ data }: any) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const { id } = useParams();
    const { width } = useWindowSize();
    const [pageSize, setPageSize] = React.useState(12);
    const handlePageChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
    };
    const {
        data: dataHistory,
        isLoading,
        refetch,
    } = useQuery<any>(['history'], () => seasonsService.getHistory(Number(id)));
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentItems = data?.data?.expectedHarvestStartDates?.slice(startIndex, endIndex);
    // const dataHistory = data?.data?.plantbeds?.map((item: any) => {
    //     return item?.histories
    // });
    return (
        <>
            <CardComponent title="VỤ MÙA">
                <Descriptions column={width <= TAB_MOBLIE ? 1 : 2}>
                    <Descriptions.Item label="Loại cây trồng">{data?.data?.flower?.name || '---'}</Descriptions.Item>
                    <Descriptions.Item label="Ngày bắt đầu">
                        {momentToStringDate(data?.data?.actualStart) || '---'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại cây">
                        {data?.data?.flower?.type === TYPE_FLOWER.PERENNIAL
                            ? 'Lâu năm'
                            : data?.data?.flower?.type === TYPE_FLOWER.GROW_ONE
                            ? 'Thu một lần'
                            : data?.data?.flower?.type === TYPE_FLOWER.GROWN_MANY_TIMES
                            ? 'Thu nhiều lần'
                            : ''}
                    </Descriptions.Item>
                    {data?.data?.flower?.type === TYPE_FLOWER.GROW_ONE ? (
                        <Descriptions.Item label="Ngày dự kiến thu hoạch">
                            <div>
                                {data?.data?.expectedHarvestStartDates?.map((item: string) => (
                                    <span style={{ margin: '0 5px' }}>
                                        {moment(item).format('DD/MM/YYYY') || '---'}
                                    </span>
                                ))}
                            </div>
                        </Descriptions.Item>
                    ) : (
                        <></>
                    )}
                    <Descriptions.Item label="Vườn">{data?.data?.garden?.name}</Descriptions.Item>
                    <Descriptions.Item label="Sản lượng dự kiến">
                        {currencyFormat(data?.data?.expectedQuantity) || '---'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Diện tích trồng">
                        {currencyFormat(data?.data?.usableArea) || '---'} M2
                    </Descriptions.Item>
                    <Descriptions.Item label="Số lượng cây trồng">
                        {currencyFormat(data?.data?.numberOfSeedlings) || '---'}
                    </Descriptions.Item>
                    {/* <Descriptions.Item label="Ngắt ngọn">{currencyFormat(data?.data?.information?.cuttingLength)} CM</Descriptions.Item> */}
                    <Descriptions.Item label="Ngắt ngọn">
                        {data?.data?.information?.cuttingLength || '---'} CM
                    </Descriptions.Item>
                    {data?.data?.flower?.type === TYPE_FLOWER.GROWN_MANY_TIMES ? (
                        <Descriptions.Item label="Số lần thu hoạch">
                            {data?.data?.numberOfHarvests || '---'}
                        </Descriptions.Item>
                    ) : (
                        <></>
                    )}
                    <Descriptions.Item label="Khoảng cách trồng">
                        {data?.data?.plantingDistance || '---'} CM
                    </Descriptions.Item>
                </Descriptions>
                {data?.data?.flower?.type !== TYPE_FLOWER.GROW_ONE && (
                    <>
                        <TableComponent
                            rowSelect={false}
                            page={currentPage}
                            onChangePage={(page) => setCurrentPage(page)}
                            dataSource={currentItems}
                            total={data?.data?.expectedHarvestStartDates?.length}
                            columns={[
                                {
                                    title: 'Đợt',
                                    dataIndex: 'id',
                                    align: 'center',
                                    key: 'id',
                                    render: (row, record, index) =>
                                        currentPage === 1 ? ++index : (currentPage - 1) * RECORD_SIZE + ++index,
                                },
                                {
                                    title: 'Ngày dự kiến thu hoạch',
                                    dataIndex: 'expectedHarvestStartDates',
                                    key: 'expectedHarvestStartDates',
                                    align: 'center',
                                    render: (text: string, record) => moment(record).format('DD/MM/YYYY'),
                                },
                            ]}
                        />
                        {/* <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            // total={data?.data?.expectedHarvestStartDates?.length}
                            onChange={handlePageChange}
                        /> */}
                    </>
                )}
            </CardComponent>
            <CardComponent title="Luống trồng">
                <TableComponent
                    rowSelect={false}
                    // onChangePage={(_page) => setPage(_page)}
                    dataSource={data?.data?.plantbeds}
                    columns={columnsGeneral(1)}
                />
            </CardComponent>
            <CardComponent
                title={data?.data?.status === STATUS_SEASON.InActive ? 'LÝ DO DỪNG CANH TÁC' : ''}
                extra={<Title level={5}>LỊCH SỬ CHỈNH SỬA LUỐNG</Title>}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {data?.data?.status === STATUS_SEASON.InActive ? (
                        <Space style={{ flexDirection: 'column', alignItems: 'start' }}>
                            <Text type="secondary">{moment(data?.data?.updatedAt).format('HH:mm DD/MM/YYYY')}</Text>
                            <Text type="secondary">{data?.data?.reasonForStopping}</Text>
                        </Space>
                    ) : (
                        <div></div>
                    )}

                    <TableComponent
                        rowSelect={false}
                        // onChangePage={(_page) => setPage(_page)}
                        dataSource={dataHistory?.data?.length ? dataHistory?.data : []}
                        columns={columnsHistory(1)}
                    />
                </div>
            </CardComponent>
        </>
    );
};

export default GeneralInformation;
