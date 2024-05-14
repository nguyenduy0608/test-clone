import CardComponent from '@/components/CardComponent';
import TableComponent from '@/components/TableComponent';
import TopBar from '@/components/TopBar';
import { BOX_SHADOW, RADIUS } from '@/config/theme';
import Container from '@/layout/Container';
import { IFilter } from '@/types';
import { currencyFormat } from '@/utils';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tooltip as TooltipAntd, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { reportSeasson } from '../../services';
import ReportPlantbeds from '../components/Description';
import Filter from '../components/Filter';
import { columns } from '../components/Report.Config';
// import CountUp from "react-countup/build/CountUp";
const { Text, Link } = Typography;
const initialFilterQuery = {
    startDate: moment().startOf('month').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
};

const API_URL = import.meta.env.VITE_API_URL;

const textReportStyle: any = {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '17px',
    textAlign: 'center',
    marginBottom: '4px',
};
const textNote = { color: '#fff', fontSize: '12px', fontWeight: '600' };
const ReportFlower = () => {
    const [page, setPage] = React.useState(1);
    const [filterQuery, setFilterQuery] = React.useState<IFilter>(initialFilterQuery);
    const {
        data: reportFlower,
        isLoading,
        refetch,
        isRefetching,
    } = useQuery<any>(['report', page, filterQuery], () => reportSeasson.get({ page, ...filterQuery }));
    const returnFilter = React.useCallback(
        (filter: IFilter) => {
            setPage(1);
            setFilterQuery({ ...filterQuery, ...filter });
        },
        [filterQuery]
    );
    const rowRender = (record: any, index: number, indent: number, expanded: any) => {
        const row = document.querySelector(`[data-row-key="${record.id}"]`);
        if (expanded) {
            row?.classList.add('rowTableSelect');
        } else {
            row?.classList.remove('rowTableSelect');
        }

        return <ReportPlantbeds record={record} refetch={refetch} />;
    };

    const handleExportExcel = async () => {
        try {
            let apiUrl = `${API_URL}/reports/seasons/export?page=${page}&limit=12`;

            // Kiểm tra và thêm các query parameter vào apiUrl nếu chúng không phải là undefined hoặc ''
            if (filterQuery.startDate) {
                apiUrl += `&start_date=${filterQuery.startDate}`;
            }
            if (filterQuery.endDate) {
                apiUrl += `&end_date=${filterQuery.endDate}`;
            }
            if (filterQuery.search) {
                apiUrl += `&search=${filterQuery.search}`;
            }
            if (filterQuery.season_status) {
                apiUrl += `&season_status=${filterQuery.season_status}`;
            }
            if (filterQuery.gardenId !== undefined && filterQuery.gardenId !== '') {
                apiUrl += `&garden_id=${filterQuery.gardenId}`;
            }
            if (filterQuery.flowerId !== undefined && filterQuery.flowerId !== '') {
                apiUrl += `&flower_id=${filterQuery.flowerId}`;
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
                        className="gx-mb-0"
                        icon={<VerticalAlignBottomOutlined />}
                        onClick={handleExportExcel}
                    >
                        Xuất Excel
                    </Button>
                }
                title="Báo cáo thu hoạch dự kiến"
            />
            <Container>
                <CardComponent title={<Filter returnFilter={returnFilter} key="filter" />}>
                    <span style={{ fontSize: '20px', color: '#52c41a' }}>Thu hoạch dự kiến</span>

                    <ReportChartStyled>
                        <RowStyled className="gx-m-0 gx-p-0 gx-mb-3" justify="center">
                            <Col
                                xxl={6}
                                xl={6}
                                lg={12}
                                md={12}
                                sm={24}
                                xs={24}
                                className="gx-col-full gx-p-0 gx-px-2 gx-py-2"
                            >
                                <TooltipAntd color="#00C49F" title="Tổng diện tích">
                                    <ColStyled index={1} color="#00C49F">
                                        <div>
                                            <div style={textReportStyle}>
                                                <strong>
                                                    {currencyFormat(reportFlower?.data?.totalUsableAreas) + ' m2'}
                                                </strong>
                                            </div>
                                            <div style={textNote}>Tổng diện tích</div>
                                        </div>
                                    </ColStyled>
                                </TooltipAntd>
                            </Col>
                            <Col
                                xxl={6}
                                xl={6}
                                lg={12}
                                md={12}
                                sm={24}
                                xs={24}
                                className="gx-col-full gx-p-0 gx-px-2 gx-py-2"
                            >
                                <TooltipAntd color="#FFBB28" title="Tổng số luống">
                                    <ColStyled index={2} color="#FFBB28">
                                        <div>
                                            <div style={textReportStyle}>
                                                <strong>
                                                    {currencyFormat(reportFlower?.data?.totalPlantbeds) || '---'}
                                                </strong>
                                            </div>
                                            <div style={textNote}>Tổng số luống</div>
                                        </div>
                                    </ColStyled>
                                </TooltipAntd>
                            </Col>
                            <Col
                                xxl={6}
                                xl={6}
                                lg={12}
                                md={12}
                                sm={24}
                                xs={24}
                                className="gx-col-full gx-p-0 gx-px-2 gx-py-2"
                            >
                                <TooltipAntd color="#FF8042" title="Vụ mùa">
                                    <ColStyled index={3} color="#FF8042">
                                        <div>
                                            <div style={textReportStyle}>
                                                {/* <CountUp separator="" end={0} /> */}
                                                <strong>
                                                    {currencyFormat(reportFlower?.data?.totalSeasons) || '---'}
                                                </strong>
                                            </div>
                                            <div style={textNote}>Vụ mùa</div>
                                        </div>
                                    </ColStyled>
                                </TooltipAntd>
                            </Col>
                            <Col
                                xxl={6}
                                xl={6}
                                lg={12}
                                md={12}
                                sm={24}
                                xs={24}
                                className="gx-col-full gx-p-0 gx-px-2 gx-py-2"
                            >
                                <TooltipAntd color="#9488" title="Vườn">
                                    <ColStyled index={4} color="#9488">
                                        <div>
                                            <div style={textReportStyle}>
                                                <strong>{currencyFormat(reportFlower?.data?.gardens) || '---'}</strong>
                                                {/* <CountUp separator="" end={0} /> */}
                                            </div>
                                            <div style={textNote}>Vườn</div>
                                        </div>
                                    </ColStyled>
                                </TooltipAntd>
                            </Col>
                        </RowStyled>
                        <CustomTable
                            showTotalResult
                            reLoadData={() => refetch()}
                            loading={isRefetching || isLoading}
                            page={page}
                            rowSelect={false}
                            expandedRowRender={rowRender}
                            onChangePage={(_page) => setPage(_page)}
                            dataSource={reportFlower?.data?.foundSeasons || []}
                            columns={columns(page, filterQuery)}
                            total={reportFlower?.data?.foundSeasons && reportFlower?.paging?.totalItem}
                        />
                        {/* </TopBoxStyled> */}
                    </ReportChartStyled>
                </CardComponent>
            </Container>
        </>
    );
};

export default ReportFlower;
const ReportChartStyled = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
`;
const RowStyled = styled(Row)`
    padding: 0 40px;
    margin: 30px 0;
`;

const CustomTable = styled(TableComponent)`
    .ant-table-expanded-row-fixed {
        display: none;
    }
`;
const ColStyled = styled(Col)<{ color?: string; index?: number }>`
    display: flex;
    justify-content: center;
    align-items: center;
    /* border: 2px solid ${(props) => (props.color ? props.color : '#ccc')}; */
    padding: 14px 0;
    border-radius: ${RADIUS};
    position: relative;
    box-shadow: ${BOX_SHADOW};
    ${(props) =>
        props.color &&
        `
        background-color: ${props.color};
        background-image: linear-gradient(160deg, ${props.color} 0%, #80D0C7 100%);
    `};
`;
