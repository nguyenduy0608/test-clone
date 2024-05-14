import CardComponent from '@/components/CardComponent';
import TableComponent from '@/components/TableComponent';
import TopBar from '@/components/TopBar';
import { BOX_SHADOW, RADIUS, TAB_SIZE } from '@/config/theme';
import useWindowSize from '@/hooks/useWindowSize';
import Container from '@/layout/Container';
import { IFilter } from '@/types';
import { SwitcherOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tooltip as TooltipAntd, Typography } from 'antd';
import React from 'react';
import { LineChartOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { reportHarvesCycles } from '../../services';
import Filter from '../components/Filter';
import { columns } from '../components/ReportHarvestCycle.Config';
const { Text, Link } = Typography;
const initialFilterQuery = {
    // startDate: moment().startOf('month').format('YYYY-MM-DD'),
    // endDate: moment().endOf('month').format('YYYY-MM-DD'),
};

const textReportStyle: any = {
    color: '#ffb52f',
    fontWeight: 'bold',
    fontSize: '30px',
    textAlign: 'center',
    marginBottom: '4px',
};
const textNote = { color: 'black', fontSize: '20px', fontWeight: '600', textAlign: 'center' };
const ReportHarvestCycle = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [page, setPage] = React.useState(1);
    const [filterQuery, setFilterQuery] = React.useState<IFilter>(initialFilterQuery);
    const { width } = useWindowSize();
    const {
        data: reportHarvestCycles,
        isLoading,
        refetch,
        isRefetching,
    } = useQuery<any>(['report', page, filterQuery], () => reportHarvesCycles.get({ page, ...filterQuery }));
    const returnFilter = React.useCallback(
        (filter: IFilter) => {
            setPage(1);
            setFilterQuery({ ...filterQuery, ...filter });
        },
        [filterQuery]
    );
    const handleExportExcel = async () => {
        try {
            let apiUrl = `${API_URL}/reports/harvest-cycles/export?page=${page}&limit=12`;

            // Kiểm tra và thêm các query parameter vào apiUrl nếu chúng không phải là undefined hoặc ''
            if (filterQuery.startDate) {
                apiUrl += `&start_date=${filterQuery.startDate}`;
            }
            if (filterQuery.endDate) {
                apiUrl += `&end_date=${filterQuery.endDate}`;
            }

            if (filterQuery.gardenId !== undefined && filterQuery.gardenId !== '') {
                apiUrl += `&garden_id=${filterQuery.gardenId}`;
            }

            if (filterQuery.seasonId !== undefined && filterQuery.seasonId !== '') {
                apiUrl += `&season_id=${filterQuery.seasonId}`;
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
                        onClick={handleExportExcel}
                        icon={<VerticalAlignBottomOutlined />}
                    >
                        Xuất Excel
                    </Button>
                }
                title="Báo cáo chu kì thu hoạch"
            />
            <Container>
                <CardComponent title={<Filter returnFilter={returnFilter} key="filter" />}>
                    <ReportChartStyled>
                        <RowStyled className="gx-m-0 gx-p-0 gx-mb-3" justify="center">
                            <Col
                                xs={width <= TAB_SIZE ? 24 : 12}
                                sm={12}
                                md={8}
                                lg={8}
                                xl={12}
                                className="gx-col-full gx-p-0 gx-px-2 gx-py-2"
                            >
                                <TooltipAntd color="#ffe6c0" title="">
                                    <ColStyled
                                        index={1}
                                        style={{
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            width: '100%',
                                        }}
                                    >
                                        <div>
                                            <div>
                                                <strong style={{ textAlign: 'center' }}>
                                                    Số ngày trung bình cây trồng cho thu hoạch
                                                </strong>
                                            </div>
                                            <div style={textReportStyle}>
                                                <strong>{reportHarvestCycles?.data?.average?.toFixed(1)}</strong>
                                            </div>
                                        </div>
                                        <div>
                                            <strong>Ngày</strong>
                                        </div>
                                        <div style={{ position: 'absolute', bottom: '0', right: '10px' }}>
                                            <SwitcherOutlined
                                                style={{
                                                    fontSize: '400%',
                                                    color: 'lightgray',
                                                    marginLeft: 20,
                                                }}
                                            />
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
                            onChangePage={(_page) => setPage(_page)}
                            dataSource={reportHarvestCycles?.data?.foundHarvests || []}
                            columns={columns(page)}
                            total={reportHarvestCycles?.data?.foundHarvests && reportHarvestCycles?.paging?.totalItem}
                        />
                    </ReportChartStyled>
                </CardComponent>
            </Container>
        </>
    );
};

export default ReportHarvestCycle;
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
        props?.index === 1 &&
        'background-color: #ffe6c0;background-image: linear-gradient(160deg, #ffe6c0 0%, #ffe6c0 100%);'};
    ${(props) => props?.index === 2 && 'background: linear-gradient(33deg, #ffe6c0, #ffe6c0);'};

    ${(props) => props?.index === 3 && 'background: linear-gradient(33deg, #54E38E, #41C7AF);'};
    ${(props) => props?.index === 4 && 'background: linear-gradient(33deg, #E16E93, #9D2E7D);'};
`;
