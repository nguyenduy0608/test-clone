import CardComponent from '@/components/CardComponent';
import TableComponent from '@/components/TableComponent';
import TopBar from '@/components/TopBar';
import { BOX_SHADOW, RADIUS, TAB_MOBLIE } from '@/config/theme';
import { TimeType } from '@/contants';
import useWindowSize from '@/hooks/useWindowSize';
import Container from '@/layout/Container';
import { IFilter } from '@/types';
import {
    DollarCircleFilled,
    DropboxOutlined,
    EuroCircleOutlined,
    VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import { convertDateFormat, convertMonthYearFormat, convertQuarterString, currencyFormat } from '@/utils';
import { Button, Col, Row, Tooltip } from 'antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import React from 'react';
import { useQuery } from 'react-query';
import { formatDate } from '../../page';
import { ReportUseLand } from '../../services';
import { OptionsChartUseLand } from '../components/DetailChartUseLand';
import { OptionsDonutChart } from '../components/DetailDonutChart';
import Filter from '../components/Filter';
import { columns, totalDaysBetweenMoments } from '../components/ReportUseLand.Config';
import styled from 'styled-components';
import { Column } from '../components/Colums';
import { OptionsChartTongthu } from '../components/Charttongthu';
import { Nhomsanpham } from '../components/nhomsanpham';
import axios from 'axios';

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const lastDayOfPreviousMonth = moment(currentDate).subtract(1, 'months').endOf('month');
const API_URL = import.meta.env.VITE_API_URL;

// Lấy ngày đầu tiên của 4 tháng trước
const firstDayOfFourMonthsAgo = moment(currentDate).subtract(3, 'months').startOf('month');

const initialFilterQuery = {
    startDate: firstDayOfFourMonthsAgo.format('YYYY-MM-DD'),
    endDate: lastDayOfPreviousMonth.format('YYYY-MM-DD'),
    time_type: 'month',
};
const ReportUseLandPage = () => {
    const [filterQuery, setFilterQuery] = React.useState<IFilter>(initialFilterQuery);
    const { width } = useWindowSize();
    const [page, setPage] = React.useState(1);
    const [id, setId] = React.useState(47);
    const [dataYear, setDataYear] = React.useState([]);
    const [dataProduct, setDataProduct] = React.useState([]);
    const [dataCate, setDataCate] = React.useState([]);
    const [valueOptions, setValueOptions] = React.useState<string>(TimeType.MONTH);
    const textReportStyle: any = {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '20px',
        textAlign: 'center',
        marginBottom: '4px',
    };
    const textNote = { color: '#fff', fontSize: '20px', fontWeight: '600' };
    const { data, isLoading, refetch, isRefetching } = useQuery<any>(
        ['reports-lands', id], // Tên của query (có thể sử dụng để xác định nếu muốn invalidate cache)
        async () => {
            const response = await fetch(`http://localhost:5243/api/Statistics/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }
    );
    const handlegetDataYear = async () => {
        const res = await axios.get(`http://localhost:5243/api/Statistics/get1Year?year=${2023}`);
        setDataYear(res?.data);
    };
    const handlegetDataCate = async () => {
        const res: any = await axios.get(
            `http://localhost:5243/api/Statistics/getCategoryStatistics?from=${'2022-01-01'}&to=${'2024-01-01'} `
        );
        setDataCate(res?.data);
    };
    const handleGetDataProduct = async () => {
        const data = await axios.get('http://localhost:5243/api/Statistics/getProductStatisticById');
        setDataProduct(data?.data);
    };
    React.useEffect(() => {
        handleGetDataProduct();
        handlegetDataCate();
        const interval = setInterval(refetch, 60000);
        handlegetDataYear();
        return () => clearInterval(interval);
    }, []); // Chỉ chạy một lần khi component mount

    const dataDonut = data?.RatioLandData?.data?.dataSeriesResults;
    const totalAmounts = dataYear?.map((item: any) => item.total_amount);
    const totalCosts = dataYear?.map((item: any) => item.total_cost);
    const totalGains = dataYear?.map((item: any) => item.total_gain);
    const valueCate = dataCate?.map((item: any) => item.total_amount);

    const dateGroups = dataDonut?.map((item: any) =>
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

    const totalEmptyDays = dataDonut?.map((item: any) => item?.item?.totalEmptyDays);

    const totalCultivationDays = dataDonut?.map((item: any) => item?.item?.totalUsedDays);

    const returnFilter = React.useCallback(
        (filter: IFilter) => {
            setPage(1);
            setFilterQuery({ ...filterQuery, ...filter });
        },
        [filterQuery]
    );
    const handleExportExcel = async () => {
        try {
            let apiUrl = `${API_URL}/reports/land/export?page=1&limit=12`;
            if (filterQuery.startDate) {
                apiUrl += `&start_date=${filterQuery.startDate}`;
            }
            if (filterQuery.endDate) {
                apiUrl += `&end_date=${filterQuery.endDate}`;
            }
            if (filterQuery.search !== undefined && filterQuery.search !== '') {
                apiUrl += `&search=${filterQuery.search}`;
            }
            if (filterQuery.gardenId !== undefined && filterQuery.gardenId !== '') {
                apiUrl += `&garden_id=${filterQuery.gardenId}`;
            }

            if (filterQuery.areaId !== undefined && filterQuery.areaId !== '') {
                apiUrl += `&area_id=${filterQuery.areaId}`;
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
                //         style={{ backgroundColor: '#119211', color: 'white' }}
                //         key="add"
                //         icon={<VerticalAlignBottomOutlined />}
                //         className="gx-mb-0"
                //         onClick={handleExportExcel}
                //     >
                //         Xuất Excel
                //     </Button>
                // }
                title="Báo cáo doanh thu"
            />

            <Container>
                <CardComponent
                    title={
                        <Filter
                            setId={setId}
                            setDataCate={setDataCate}
                            initialFilterQuery={initialFilterQuery}
                            returnFilter={returnFilter}
                            valueOptions={valueOptions}
                            setValueOptions={setValueOptions}
                            key="filter"
                        />
                    }
                >
                    <Row justify="center" style={{ width: '100%', marginBottom: '2vh' }}>
                        <Col
                            xxl={6}
                            xl={6}
                            lg={6}
                            md={12}
                            sm={12}
                            xs={24}
                            className="gx-col-full gx-p-0 gx-px-2 gx-py-2"
                        >
                            <Tooltip color="blue" title="Tổng thu">
                                <ColStyled index={1}>
                                    <div>
                                        <Row justify="start" style={textNote}>
                                            Tổng thu
                                        </Row>
                                        <Row justify="start" style={textReportStyle}>
                                            <strong>{currencyFormat(data?.total_amount || 63440000)}</strong>
                                        </Row>
                                        <Row justify="end">
                                            <DollarCircleFilled
                                                style={{
                                                    fontSize: '300%',
                                                    color: 'lightgray',
                                                }}
                                            />
                                        </Row>
                                    </div>
                                </ColStyled>
                            </Tooltip>
                        </Col>
                        <Col
                            xxl={6}
                            xl={6}
                            lg={6}
                            md={12}
                            sm={12}
                            xs={24}
                            className="gx-col-full gx-p-0 gx-px-2 gx-py-2"
                        >
                            <Tooltip color="#a30bc1" title="Chi phí">
                                <ColStyled index={2}>
                                    <div>
                                        <Row justify="start" style={textNote}>
                                            Chi phí
                                        </Row>
                                        <Row justify="start" style={textReportStyle}>
                                            <strong>{currencyFormat(data?.total_cost || 63440000 - 25150000)}</strong>
                                        </Row>
                                        <Row justify="end">
                                            <EuroCircleOutlined
                                                style={{
                                                    fontSize: '300%',
                                                    color: 'lightgray',
                                                }}
                                            />
                                        </Row>
                                    </div>
                                </ColStyled>
                            </Tooltip>
                        </Col>
                        <Col
                            xxl={6}
                            xl={6}
                            lg={6}
                            md={12}
                            sm={12}
                            xs={24}
                            className="gx-col-full gx-p-0 gx-px-2 gx-py-2"
                        >
                            <Tooltip color="#00C49F" title="Lợi nhuận">
                                <ColStyled index={3}>
                                    <div>
                                        <Row justify="start" style={textNote}>
                                            Lợi nhuận
                                        </Row>
                                        <Row justify="start" style={textReportStyle}>
                                            <strong>{currencyFormat(data?.total_gain || 25150000)}</strong>
                                        </Row>
                                        <Row justify="end">
                                            <DropboxOutlined
                                                style={{
                                                    fontSize: '300%',
                                                    color: 'lightgray',
                                                }}
                                            />
                                        </Row>
                                    </div>
                                </ColStyled>
                            </Tooltip>
                        </Col>
                    </Row>
                    <Row justify="start" style={{ width: '100%' }}>
                        <Col span={width <= TAB_MOBLIE ? 24 : 10}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={Nhomsanpham(valueCate)}
                                containerProps={{ style: { height: '400px', width: '100%' } }}
                            />
                        </Col>
                        <Col span={width <= TAB_MOBLIE ? 24 : 14}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={OptionsChartTongthu({
                                    dataName: dateGroups,
                                    dataX1: totalEmptyDays,
                                    dataX2: totalAmounts,
                                })}
                                containerProps={{ style: { height: '400px', width: '100%' } }}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={Column({ x1: totalCosts, x2: totalGains })}
                            containerProps={{ style: { height: '400px', width: '100%' } }}
                        />
                    </Row>

                    <TableComponent
                        showTotalResult
                        loading={isRefetching || isLoading}
                        page={page}
                        // totalDay={
                        //     totalDaysBetweenMoments(moment(filterQuery?.startDate), moment(filterQuery?.endDate)) + 1 ||
                        //     '---'
                        // }
                        rowSelect={false}
                        onChangePage={(_page) => setPage(_page)}
                        dataSource={dataProduct}
                        columns={[...columns(page)]}
                        // total={data?.reportLandData && data?.reportLandData?.paging?.totalItem}
                        total={10}
                    />
                </CardComponent>
            </Container>
        </>
    );
};

export default ReportUseLandPage;
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
const products = [
    {
        id: 1,
        area: { garden: { name: 'Hành Trình Phiêu Lưu' }, quantity: 10 },
        sid: 'Bán chạy',
        name: 'Trần Văn A',
        usedDayCount: 500000,
        emptyDayCount: 200000,
        emptyDayRatio: 700000,
    },
    {
        id: 2,
        area: { garden: { name: 'Bí Mật Rừng Sâu' }, quantity: 8 },
        sid: 'Bán chạy',
        name: 'Phạm Thị B',
        usedDayCount: 750000,
        emptyDayCount: 300000,
        emptyDayRatio: 1050000,
    },
    {
        id: 3,
        area: { garden: { name: 'Chuyện Tình Biển Cả' }, quantity: 15 },
        sid: 'Bán chạy',
        name: 'Trương Văn C',
        usedDayCount: 1000000,
        emptyDayCount: 400000,
        emptyDayRatio: 1400000,
    },
    {
        id: 4,
        area: { garden: { name: 'Cuộc Sống Vùng Núi' }, quantity: 5 },
        sid: 'Tồn kho',
        name: 'Nguyễn Thị D',
        usedDayCount: 600000,
        emptyDayCount: 250000,
        emptyDayRatio: 850000,
    },
    {
        id: 5,
        area: { garden: { name: 'Thiên Đường Bình Yên' }, quantity: 7 },
        sid: 'Bán chạy',
        name: 'Phan Văn E',
        usedDayCount: 400000,
        emptyDayCount: 150000,
        emptyDayRatio: 550000,
    },
    {
        id: 6,
        area: { garden: { name: 'Kỳ Bí Thành Phố Cổ' }, quantity: 6 },
        sid: 'Bán chạy',
        name: 'Trần Văn A',
        usedDayCount: 450000,
        emptyDayCount: 180000,
        emptyDayRatio: 630000,
    },
    {
        id: 7,
        area: { garden: { name: 'Người Hùng Thầm Lặng' }, quantity: 3 },
        sid: 'Tồn kho',
        name: 'Trần Văn A',
        usedDayCount: 550000,
        emptyDayCount: 220000,
        emptyDayRatio: 770000,
    },
    {
        id: 8,
        area: { garden: { name: 'Cơn Bão Kỷ Niệm' }, quantity: 12 },
        sid: 'Bán chạy',
        name: 'Phạm Thị B',
        usedDayCount: 650000,
        emptyDayCount: 260000,
        emptyDayRatio: 910000,
    },
    {
        id: 9,
        area: { garden: { name: 'Cuộc Chiến Sinh Tồn' }, quantity: 4 },
        sid: 'Tồn kho',
        name: 'Nguyễn Thị D',
        usedDayCount: 700000,
        emptyDayCount: 280000,
        emptyDayRatio: 980000,
    },
    {
        id: 10,
        area: { garden: { name: 'Vùng Đất Huyền Bí' }, quantity: 11 },
        sid: 'Bán chạy',
        name: 'Trương Văn C ',
        usedDayCount: 800000,
        emptyDayCount: 320000,
        emptyDayRatio: 1120000,
    },
];
