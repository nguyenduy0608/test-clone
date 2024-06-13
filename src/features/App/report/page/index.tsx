import CardComponent from '@/components/CardComponent';
import TableComponent from '@/components/TableComponent';
import TopBar from '@/components/TopBar';
import { BOX_SHADOW, RADIUS, TAB_MOBLIE } from '@/config/theme';
import { STATUS_SEASON, TimeType } from '@/contants';
import useWindowSize from '@/hooks/useWindowSize';
import Container from '@/layout/Container';
import { IFilter } from '@/types';
import { convertDateFormat, convertMonthYearFormat, convertQuarterString, currencyFormat } from '@/utils';
import {
    DollarCircleFilled,
    DropboxOutlined,
    EuroCircleOutlined,
    VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import { Button, Col, Row, Tooltip as TooltipAntd } from 'antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { OptionsChartCost } from '../components/DetailChartCost';
import { totalResultParams } from '../components/DetailChecklistResultChart';
import Filter from '../components/Filter';
import { columns } from '../components/ReportCost.Config';
import { reportcostServices } from '../services';
import { OptionsChartUseLand } from '../Land/components/DetailChartUseLand';
import axios from 'axios';

export const formatDate = (date: any) => {
    const year = date?.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
// Lấy ngày hiện tại
const currentDate = new Date();

// Lấy tháng hiện tại
const currentMonth = currentDate.getMonth() + 1; // Lưu ý: Tháng trong JavaScript bắt đầu từ 0

// Lấy ngày cuối cùng của tháng hiện tại
const lastDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentMonth, 0);

// Lấy ngày đầu tiên của tháng trước 3 tháng hiện tại
const firstDayOfThreeMonthsAgo = new Date(currentDate.getFullYear(), currentMonth - 3, 1);
const API_URL = import.meta.env.VITE_API_URL;
// Chuyển đổi ngày về định dạng 'YYYY-MM-DD'
const formattedLastDayOfCurrentMonth = formatDate(lastDayOfCurrentMonth);
const formattedFirstDayOfThreeMonthsAgo = formatDate(firstDayOfThreeMonthsAgo);
const initialFilterQuery = {
    startDate: formattedFirstDayOfThreeMonthsAgo,
    endDate: formattedLastDayOfCurrentMonth,
    time_type: 'month',
};
const ReportCostPage = () => {
    const [filterQuery, setFilterQuery] = React.useState<IFilter>(initialFilterQuery);
    const [page, setPage] = React.useState(1);
    const width = useWindowSize();
    const [valueStatus, setValueStatus] = React.useState('');
    const [dataCus, setDataCus] = React.useState([]);
    const [valueOptions, setValueOptions] = React.useState<string>(TimeType.MONTH);

    const { data, isLoading, refetch, isRefetching } = useQuery<any>(
        ['reports-expenses', page, filterQuery],
        async () => {
            // const getReportPromise = reportcostServices.get({ page, ...filterQuery });
            // const getCostPromise = reportcostServices.getCost({ page, ...filterQuery });
            // const getCostLinePromise = reportcostServices.getCostLine({ page, ...filterQuery });
            // const [reportData, costData, costDataLine] = await Promise.all([
            //     getReportPromise,
            //     getCostPromise,
            //     getCostLinePromise,
            // ]);
            // return { reportData, costData, costDataLine };
            // Tại đây, reportData là dữ liệu từ reportcostServices.get và costData là dữ liệu từ reportcostServices.getCost
        }
    );
    React.useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        const res = await axios.get(
            'http://localhost:5243/api/Customers/topNCustomerHaveHighestValueOfInterval?n=10&from=2022-02-02&to=2023-02-02'
        );
        setDataCus(res?.data);
    };
    const returnFilter = React.useCallback(
        (filter: IFilter) => {
            setPage(1);
            setFilterQuery({ ...filterQuery, ...filter });
        },
        [filterQuery]
    );
    const seasonsCounter = data?.costData?.data?.seasonsCounter;

    const dataChart = [
        {
            name: 'Hoàn thành',
            y: seasonsCounter?.completed,
        },
        {
            name: 'Dừng canh tác',
            y: seasonsCounter?.inActive,
        },
    ];
    const newArray =
        seasonsCounter &&
        Object?.entries(seasonsCounter)
            ?.filter(([key, value]) => key !== 'completed' && key !== 'inActive')
            ?.map(([key, value]) => ({ [key]: value }));

    if (newArray) {
        newArray?.map((item: any) => {
            valueStatus === STATUS_SEASON.InActive
                ? dataChart
                : dataChart.push({
                      name: `Thu đợt ${Object.keys(item)[0]}`,
                      y: item[Object?.keys(item)[0]]?.length,
                  });
        });
    }
    const filteredDataChart = dataChart.filter((item) => item.y !== 0);
    const namesArray = data?.costDataLine?.data?.map((item: any) =>
        valueOptions === TimeType.DATE
            ? item?.dateGroup?.length === 6
                ? convertMonthYearFormat(item.dateGroup)
                : convertDateFormat(item?.dateGroup)
            : valueOptions === TimeType.WEEK
            ? item?.dateGroup?.length === 6
                ? convertMonthYearFormat(item.dateGroup)
                : convertDateFormat(item?.dateGroup)
            : valueOptions === TimeType.MONTH || valueOptions === undefined
            ? item?.dateGroup?.length === 6
                ? convertMonthYearFormat(item.dateGroup)
                : convertDateFormat(item.dateGroup)
            : valueOptions === TimeType.QUARTER
            ? item?.dateGroup?.length === 6
                ? convertMonthYearFormat(item.dateGroup)
                : convertQuarterString(item?.dateGroup)
            : item?.dateGroup?.length === 6
            ? convertMonthYearFormat(item.dateGroup)
            : item?.dateGroup
    );
    const loiNhuanArray = data?.costDataLine?.data?.map((item: any) => item?.item?.totalRevenue);
    const chiPhiArray = data?.costDataLine?.data?.map((item: any) => item?.item?.totalCost);
    const handleExportExcel = async () => {
        try {
            let apiUrl = `${API_URL}/reports/seasons-expenses/export?page=1&limit=12`;
            if (filterQuery.startDate) {
                apiUrl += `&start_date=${filterQuery.startDate}`;
            }
            if (filterQuery.endDate) {
                apiUrl += `&end_date=${filterQuery.endDate}`;
            }

            if (filterQuery.gardenId !== undefined && filterQuery.gardenId !== '') {
                apiUrl += `&garden_id=${filterQuery.gardenId}`;
            }
            if (filterQuery.flowerId !== undefined && filterQuery.flowerId !== '') {
                apiUrl += `&flower_id=${filterQuery.flowerId}`;
            }

            if (filterQuery.seasonId !== undefined && filterQuery.seasonId !== '') {
                apiUrl += `&season_id=${filterQuery.seasonId}`;
            }
            if (filterQuery.season_status) {
                apiUrl += `&season_status=${filterQuery.season_status}`;
            }
            if (filterQuery.time_type !== undefined && filterQuery.time_type !== '') {
                apiUrl += `&time_type=${filterQuery.time_type}`;
            }

            window.open(apiUrl, '_blank');
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            <TopBar
                // extra={
                //     <Button
                //         icon={<VerticalAlignBottomOutlined />}
                //         style={{ backgroundColor: '#119211', color: 'white' }}
                //         key="add"
                //         className="gx-mb-0"
                //         onClick={handleExportExcel}
                //     >
                //         Xuất Excel
                //     </Button>
                // }
                title="Báo cáo khách hàng"
            />

            <Container>
                <CardComponent bodyStyle={{ border: RADIUS }} title={'Top 10 khách hàng trong năm'}>
                    <Row justify="start" style={{ width: '100%' }}>
                        <Col span={18}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={OptionsChartUseLand({
                                    dataName: 0,
                                    dataX1: [],
                                    dataX2: [],
                                })}
                                containerProps={{ style: { height: '400px', width: '100%' } }}
                            />
                        </Col>
                    </Row>
                    <TableComponent
                        showTotalResult
                        loading={isRefetching || isLoading}
                        page={page}
                        rowSelect={false}
                        onChangePage={(_page) => setPage(_page)}
                        // expandedRowRender={rowRender}
                        dataSource={dataCus}
                        columns={[...columns(page)]}
                        // total={data?.reportData && data?.reportData?.paging?.totalItem}
                        total={10}
                    />
                </CardComponent>
            </Container>
        </>
    );
};

export default ReportCostPage;
const ColStyled = styled(Col)<{ color?: string; index?: number }>`
    display: flex;
    justify-content: center;
    align-items: center;
    /* border: 2px solid ${(props: any) => (props.color ? props.color : '#ccc')}; */
    padding: 40px 0;
    border-radius: ${RADIUS};
    position: relative;
    width: 100%;
    box-shadow: ${BOX_SHADOW};
    ${(props: any) =>
        props?.index === 1 &&
        'background-color: #0093E9;background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);'};
    ${(props: any) => props?.index === 2 && 'background: linear-gradient(33deg, #DEB0DF, #A16BFE);'};

    ${(props: any) => props?.index === 3 && 'background: linear-gradient(33deg, #54E38E, #41C7AF);'};
    ${(props: any) => props?.index === 4 && 'background: linear-gradient(33deg, #E16E93, #9D2E7D);'};
`;
const customers = [
    {
        name: 'Nguyễn Văn A',
        phone: '0123456789',
        address: '123 Đường A, Quận 1, TP.HCM',
        purchaseCount: 5,
        totalAmount: 1500000,
        lastPurchaseDate: '2024-05-02',
    },
    {
        name: 'Trần Thị B',
        phone: '0987654321',
        address: '456 Đường B, Quận 2, TP.HCM',
        purchaseCount: 3,
        totalAmount: 850000,
        lastPurchaseDate: '2024-05-05',
    },
    {
        name: 'Lê Văn C',
        phone: '0345678901',
        address: '789 Đường C, Quận 3, TP.HCM',
        purchaseCount: 8,
        totalAmount: 2400000,
        lastPurchaseDate: '2024-05-08',
    },
    {
        name: 'Phạm Thị D',
        phone: '0456789012',
        address: '101 Đường D, Quận 4, TP.HCM',
        purchaseCount: 2,
        totalAmount: 500000,
        lastPurchaseDate: '2024-05-10',
    },
    {
        name: 'Hoàng Văn E',
        phone: '0567890123',
        address: '202 Đường E, Quận 5, TP.HCM',
        purchaseCount: 6,
        totalAmount: 1800000,
        lastPurchaseDate: '2024-05-15',
    },
    {
        name: 'Phan Thị F',
        phone: '0678901234',
        address: '303 Đường F, Quận 6, TP.HCM',
        purchaseCount: 4,
        totalAmount: 1200000,
        lastPurchaseDate: '2024-05-18',
    },
    {
        name: 'Đỗ Văn G',
        phone: '0789012345',
        address: '404 Đường G, Quận 7, TP.HCM',
        purchaseCount: 7,
        totalAmount: 2100000,
        lastPurchaseDate: '2024-05-20',
    },
    {
        name: 'Bùi Thị H',
        phone: '0890123456',
        address: '505 Đường H, Quận 8, TP.HCM',
        purchaseCount: 5,
        totalAmount: 1600000,
        lastPurchaseDate: '2024-05-22',
    },
    {
        name: 'Vũ Văn I',
        phone: '0901234567',
        address: '606 Đường I, Quận 9, TP.HCM',
        purchaseCount: 3,
        totalAmount: 900000,
        lastPurchaseDate: '2024-05-23',
    },
    {
        name: 'Ngô Thị J',
        phone: '0912345678',
        address: '707 Đường J, Quận 10, TP.HCM',
        purchaseCount: 6,
        totalAmount: 2000000,
        lastPurchaseDate: '2024-05-23',
    },
];

console.log(customers);

console.log(customers);
