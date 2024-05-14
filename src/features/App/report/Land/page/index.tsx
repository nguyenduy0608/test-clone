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
    const [valueOptions, setValueOptions] = React.useState<string>(TimeType.MONTH);
    const textReportStyle: any = {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '20px',
        textAlign: 'center',
        marginBottom: '4px',
    };
    const textNote = { color: '#fff', fontSize: '20px', fontWeight: '600' };
    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['reports-lands', page, filterQuery], async () => {
        const getReportPromise = ReportUseLand.get({ page, ...filterQuery });
        const getRatioLand = ReportUseLand.getChart({ page, ...filterQuery });

        const [reportLandData, RatioLandData] = await Promise.all([getReportPromise, getRatioLand]);

        // Tại đây, reportData là dữ liệu từ reportcostServices.get và costData là dữ liệu từ reportcostServices.getCost
        return { reportLandData: reportLandData, RatioLandData: RatioLandData };
    });

    const dataDonut = data?.RatioLandData?.data?.dataSeriesResults;

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
                extra={
                    <Button
                        style={{ backgroundColor: '#119211', color: 'white' }}
                        key="add"
                        icon={<VerticalAlignBottomOutlined />}
                        className="gx-mb-0"
                        onClick={handleExportExcel}
                    >
                        Xuất Excel
                    </Button>
                }
                title="Báo cáo doanh thu"
            />

            <Container>
                <CardComponent
                    title={
                        <Filter
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
                                            <strong>{currencyFormat(data?.costData?.data?.revenue)}</strong>
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
                                            <strong>{currencyFormat(data?.costData?.data?.expenses)}</strong>
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
                                            <strong>{currencyFormat(data?.costData?.data?.profit)}</strong>
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
                        <Col span={width <= TAB_MOBLIE ? 24 : 6}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={OptionsDonutChart({ data: data?.RatioLandData?.data?.pieChart })}
                                containerProps={{ style: { height: '400px', width: '100%' } }}
                            />
                        </Col>
                        <Col span={width <= TAB_MOBLIE ? 24 : 18}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={OptionsChartUseLand({
                                    dataName: dateGroups,
                                    dataX1: totalEmptyDays,
                                    dataX2: totalCultivationDays,
                                })}
                                containerProps={{ style: { height: '400px', width: '100%' } }}
                            />
                        </Col>
                    </Row>
                    <TableComponent
                        showTotalResult
                        loading={isRefetching || isLoading}
                        page={page}
                        totalDay={
                            totalDaysBetweenMoments(moment(filterQuery?.startDate), moment(filterQuery?.endDate)) + 1 ||
                            '---'
                        }
                        rowSelect={false}
                        onChangePage={(_page) => setPage(_page)}
                        dataSource={data?.reportLandData?.data?.foundPlantbeds || []}
                        columns={[...columns(page)]}
                        total={data?.reportLandData && data?.reportLandData?.paging?.totalItem}
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
