import CardComponent from '@/components/CardComponent';
import TableComponent from '@/components/TableComponent';
import { Button, Collapse, Descriptions, Pagination, Row, Space, Tag } from 'antd';
import React from 'react';
import { columnsPlanting } from './Season.Config';
import { Notification, currencyFormat, momentToStringDate } from '@/utils';
import { PROPOSE_STATUS, TYPE_FLOWER } from '@/contants';
import moment from 'moment';
import { RECORD_SIZE, TAB_MOBLIE } from '@/config/theme';
import TagResult from '@/components/TagResult';
import useWindowSize from '@/hooks/useWindowSize';
import styled from 'styled-components';
import { subtractDates } from './HarvestTab';
import TopBar from '@/components/TopBar';
import { seasonsService } from '../services';
const { Panel } = Collapse;
const PlantingInformation = ({ data, refetch }: { data: any; refetch?: any }) => {
    let previousMaxHarvestDate = moment('1900-01-01');
    const [page, setPage] = React.useState<number>(1);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(12);
    const handlePageChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
    };
    // const [visiableHandled, setVisiableHandled] = React.useState(false);
    const { width } = useWindowSize();
    const onChange = (key: string | string[]) => {};
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentItems = data?.data?.expectedHarvestStartDates?.slice(startIndex, endIndex);
    const harvestDatesOne = data?.data?.harvests?.[0]?.turns?.map((turn: any) => moment(turn?.harvestDate));
    // Sử dụng hàm min() của Moment.js để tìm giá trị harvestDate nhỏ nhất
    const minHarvestDateOne = harvestDatesOne?.length === 0 ? '---' : moment?.min(harvestDatesOne);
    // Định dạng lại harvestDate nhỏ nhất theo một định dạng mong muốn (ví dụ: "YYYY-MM-DD HH:mm:ss")
    const diffMilliseconds = moment(minHarvestDateOne)?.diff(data?.data?.harvests?.[0]?.turns?.createdAt);
    const totalDiffDays = Math.floor(moment.duration(diffMilliseconds).asDays()) + 1;
    return (
        <>
            <CardComponent title="">
                <Descriptions column={width <= TAB_MOBLIE ? 1 : 2}>
                    <Descriptions.Item label="Ngày xuống giống">
                        {momentToStringDate(data?.data?.information?.sowingDate) || '---'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày ra luống">
                        {momentToStringDate(data?.data?.information?.grownDate) || '---'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày nảy mầm">
                        {momentToStringDate(data?.data?.information?.germinationDate) || '---'}
                    </Descriptions.Item>
                    {/* <Descriptions.Item label="Ngày bắt đầu thu hoạch thực tế">
                        {momentToStringDate(data?.data?.actualStart) || '---'}
                    </Descriptions.Item> */}
                    <Descriptions.Item label="Số lượng nảy mầm">
                        {data?.data?.information?.germinationQuantity || '---'}
                    </Descriptions.Item>
                    {data?.data?.flower?.type === TYPE_FLOWER.GROW_ONE ? (
                        <>
                            <DescriptionsItemStyled label="Ngày bắt đầu thu hoạch thực tế">
                                {momentToStringDate(data?.data?.harvests[0]?.turns[0]?.createdAt) || '---'}
                            </DescriptionsItemStyled>
                            <DescriptionsItemStyled label="Ngày kết thúc thu hoạch thực tế">
                                {data?.data?.actualEnd ? moment(data?.data?.actualEnd).format('DD/MM/YYYY') : '---'}
                            </DescriptionsItemStyled>
                        </>
                    ) : (
                        <></>
                    )}
                </Descriptions>
            </CardComponent>
            {data?.data?.flower?.type !== TYPE_FLOWER.GROW_ONE && (
                <>
                    <TableComponent
                        rowSelect={false}
                        dataSource={data?.data?.harvests || []}
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
                                title: 'Ngày bắt đầu thu hoạch thực tế',
                                dataIndex: 'harvestDate',
                                key: 'harvestDate',
                                align: 'center',
                                render: (text: string, record) => {
                                    const turns = record?.turns;
                                    // Tạo một mảng chứa các giá trị harvestDate
                                    const harvestDates = turns?.map((turn: any) => moment(turn?.harvestDate));

                                    // Sử dụng hàm min() của Moment.js để tìm giá trị harvestDate nhỏ nhất
                                    const minHarvestDate = moment.min(harvestDates);

                                    // Định dạng lại harvestDate nhỏ nhất theo một định dạng mong muốn (ví dụ: "YYYY-MM-DD HH:mm:ss")
                                    const formattedMinHarvestDate = minHarvestDate.format('DD/MM/YYYY');
                                    return <div>{turns?.length ? formattedMinHarvestDate : ''}</div>;
                                },
                            },
                            {
                                title: 'Ngày kết thúc thu hoạch thực tế',
                                dataIndex: 'expectedHarvestStartDates',
                                key: 'expectedHarvestStartDates',
                                align: 'center',
                                render: (text: string, record) => {
                                    const turns = record?.turns;
                                    // Tạo một mảng chứa các giá trị harvestDate
                                    const harvestDates = turns?.map((turn: any) => moment(turn?.harvestDate));

                                    // Sử dụng hàm min() của Moment.js để tìm giá trị harvestDate nhỏ nhất
                                    const minHarvestDate = moment.max(harvestDates);

                                    // Định dạng lại harvestDate nhỏ nhất theo một định dạng mong muốn (ví dụ: "YYYY-MM-DD HH:mm:ss")
                                    const formattedMinHarvestDate = minHarvestDate.format('DD/MM/YYYY');
                                    return <div>{harvestDates && turns?.length ? formattedMinHarvestDate : ''}</div>;
                                },
                            },
                        ]}
                    />
                    {/* <Pagination
                        current={currentPage}
                        // pageSize={pageSize}
                        total={data?.data?.expectedHarvestStartDates?.length}
                        onChange={handlePageChange}
                    /> */}
                </>
            )}

            {data?.data?.flower?.type === TYPE_FLOWER.GROWN_MANY_TIMES ||
            data?.data?.flower?.type === TYPE_FLOWER.PERENNIAL ? (
                <Collapse onChange={onChange} defaultActiveKey={[1, 2, 3, 4, 5, 6]}>
                    {data?.data?.harvests?.map((item: any, index: number) => {
                        const maxHarvestDate = item?.turns?.reduce((max: any, turn: any) => {
                            const turnHarvestDate = moment(turn?.harvestDate);
                            return turnHarvestDate?.isValid() && turnHarvestDate?.isAfter(max) ? turnHarvestDate : max;
                        }, moment('1900-01-01'));
                        const startDate = index === 0 ? data?.data?.actualStart : previousMaxHarvestDate;
                        previousMaxHarvestDate = maxHarvestDate;

                        const turns = item?.turns;
                        // Tạo một mảng chứa các giá trị harvestDate
                        const harvestDates = turns?.map((turn: any) => moment(turn?.harvestDate));
                        // Sử dụng hàm min() của Moment.js để tìm giá trị harvestDate nhỏ nhất
                        const minHarvestDate = moment.min(harvestDates);
                        // Định dạng lại harvestDate nhỏ nhất theo một định dạng mong muốn (ví dụ: "YYYY-MM-DD HH:mm:ss")
                        const diffMilliseconds = minHarvestDate.diff(
                            index === 0 ? data?.data?.actualStart : item?.createdAt
                        );
                        const diffDays = Math.floor(moment.duration(diffMilliseconds).asDays()) + 1;
                        const totalQuantityByUnit: any = {}; // Đối tượng lưu trữ tổng quantity theo unit.id

                        item?.turns.forEach((turn: any) => {
                            const { quantity, unit } = turn;
                            const unitId = unit?.id;

                            // Kiểm tra xem unitId đã tồn tại trong đối tượng totalQuantityByUnit chưa
                            if (unitId in totalQuantityByUnit) {
                                // Nếu tồn tại, cộng thêm quantity vào tổng hiện tại của unitId đó
                                totalQuantityByUnit[unitId] += quantity;
                            } else {
                                // Nếu chưa tồn tại, khởi tạo tổng mới cho unitId đó
                                totalQuantityByUnit[unitId] = quantity;
                            }
                        });
                        return (
                            <Panel
                                header={
                                    <Space>
                                        <div>Thu hoạch đợt {index + 1}</div>
                                        <strong style={{ marginLeft: 28 }}>Tổng thu hoạch: </strong>
                                        <strong style={{ color: 'green' }}>
                                            {currencyFormat(
                                                item?.turns?.reduce(
                                                    (total: number, turn: any) => total + turn.quantity,
                                                    0
                                                )
                                            )}{' '}
                                            {item?.turns[0]?.unit?.name}
                                        </strong>
                                    </Space>
                                }
                                key={index + 1}
                                extra={
                                    item?.turns?.length ? (
                                        <>
                                            <strong>
                                                Bắt đầu trồng:{' '}
                                                {index === 0
                                                    ? moment(data?.data?.actualStart).format('DD/MM/YYYY')
                                                    : startDate.format('DD/MM/YYYY')}
                                                .
                                            </strong>{' '}
                                            <strong>
                                                Bắt đầu thu hoạch:{' '}
                                                {harvestDates ? minHarvestDate.format('DD/MM/YYYY') : '---'}.
                                            </strong>{' '}
                                            <strong>
                                                Tổng:{' '}
                                                {item?.turns?.length > 0
                                                    ? index === 0
                                                        ? subtractDates(
                                                              moment(data?.data?.actualStart).format('DD/MM/YYYY'),
                                                              minHarvestDate.format('DD/MM/YYYY')
                                                          ) + 1
                                                        : subtractDates(
                                                              startDate.format('DD/MM/YYYY'),
                                                              minHarvestDate.format('DD/MM/YYYY')
                                                          ) + 1
                                                    : '---'}{' '}
                                                Ngày.
                                            </strong>
                                        </>
                                    ) : (
                                        ''
                                    )
                                }
                            >
                                <TableComponent
                                    page={page}
                                    rowSelect={false}
                                    onChangePage={(_page) => setPage(_page)}
                                    dataSource={item?.turns?.length ? item?.turns : []}
                                    columns={columnsPlanting(page)}
                                />
                                <Space style={{ display: 'flex', justifyContent: 'end' }}>
                                    <strong>Tổng thu: </strong>
                                    <strong style={{ color: 'red' }}>
                                        {currencyFormat(
                                            item?.turns.reduce((accumulator: any, turn: any) => {
                                                return accumulator + turn?.quantity * turn?.price;
                                            }, 0)
                                        )}{' '}
                                        VNĐ
                                    </strong>
                                </Space>
                            </Panel>
                        );
                    })}
                </Collapse>
            ) : (
                <>
                    <CardComponent
                        title={
                            <Space>
                                <div>Thu hoạch</div>
                            </Space>
                        }
                        extra={
                            <Space>
                                <strong>Tổng lượng thu hoạch:{'   '}</strong>
                                <strong style={{ color: 'green' }}>
                                    {currencyFormat(
                                        data?.data?.harvests?.[0]?.turns?.reduce(
                                            (total: number, turn: any) => total + turn?.quantity,
                                            0
                                        )
                                    )}{' '}
                                    {data?.data?.harvests?.[0]?.turns[0]?.unit?.name}
                                </strong>
                            </Space>
                        }
                    >
                        <div
                            style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}
                        >
                            <strong>Bắt đầu trồng: {moment(data?.data?.actualStart).format('DD/MM/YYYY')}.</strong>{' '}
                            <strong>
                                Bắt đầu thu hoạch:{' '}
                                {minHarvestDateOne
                                    ? moment.isMoment(minHarvestDateOne)
                                        ? moment(minHarvestDateOne).format('DD/MM/YYYY')
                                        : '---'
                                    : '---'}
                                .
                            </strong>{' '}
                            <strong>
                                Tổng:{' '}
                                {data?.data?.actualStart?.length > 0
                                    ? moment.isMoment(minHarvestDateOne)
                                        ? subtractDates(
                                              moment(data?.data?.actualStart).format('DD/MM/YYYY'),
                                              moment(minHarvestDateOne)?.format('DD/MM/YYYY')
                                          ) + 1
                                        : '---'
                                    : '---'}{' '}
                                Ngày.
                            </strong>
                        </div>
                        <TableComponent
                            page={page}
                            rowSelect={false}
                            onChangePage={(_page) => setPage(_page)}
                            dataSource={data?.data?.harvests?.[0]?.turns || []}
                            columns={columnsPlanting(page)}
                        />
                        <Space style={{ display: 'flex', justifyContent: 'end' }}>
                            <strong>Tổng thu: </strong>
                            <strong style={{ color: 'red' }}>
                                {currencyFormat(
                                    data?.data?.harvests?.[0]?.turns?.reduce((accumulator: any, turn: any) => {
                                        return accumulator + turn?.quantity * turn?.price;
                                    }, 0)
                                )}{' '}
                                VNĐ
                            </strong>
                        </Space>
                    </CardComponent>
                </>
            )}
            <TopBar title="Nội dung đề xuất thu hoạch" />
            {data?.data?.proposes &&
                data?.data?.proposes
                    .sort((a: any, b: any) => {
                        const dateA: any = new Date(a.createdAt);
                        const dateB: any = new Date(b.createdAt);
                        return dateB - dateA;
                    })
                    ?.map((proposes: any) => (
                        <CardComponent
                            key={proposes?.id}
                            title={
                                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <div>
                                        <span style={{ fontSize: '14px', fontWeight: 'normal', marginRight: 16 }}>
                                            {proposes?.createdByUser?.fullName}
                                        </span>
                                        <span style={{ fontSize: '14px', fontWeight: 'normal', marginRight: 16 }}>
                                            {moment(proposes?.createdAt).format('HH:mm DD-MM-YYYY')}
                                        </span>
                                        <span>Trạng thái: </span>
                                        {proposes?.status === PROPOSE_STATUS.INPROGRESS ? (
                                            <Tag color="red">
                                                {proposes?.status === PROPOSE_STATUS.INPROGRESS && 'Chờ tiếp nhận'}
                                            </Tag>
                                        ) : (
                                            <Tag color="green">
                                                {proposes?.status === PROPOSE_STATUS.PROCESSED && 'Đã xử lý'}
                                            </Tag>
                                        )}
                                    </div>
                                    {proposes?.status === PROPOSE_STATUS.INPROGRESS ? (
                                        <Button
                                            onClick={async () => {
                                                await seasonsService.updateProposes(proposes?.id).then((res) => {
                                                    if (res.status) {
                                                        Notification('success', 'Đã xử lý đề xuất thu hoạch');
                                                        refetch();
                                                    }
                                                });
                                            }}
                                            type="primary"
                                        >
                                            Đã xử lý
                                        </Button>
                                    ) : (
                                        <></>
                                    )}
                                </Space>
                            }
                        >
                            <p style={{ fontWeight: 700 }}>{proposes?.content}</p>
                        </CardComponent>
                    ))}
        </>
    );
};

const DescriptionsItemStyled = styled(Descriptions.Item)`
    & .ant-descriptions-item .ant-descriptions-item-container {
        display: flex;
        flex-direction: column;
    }
`;

export default PlantingInformation;
