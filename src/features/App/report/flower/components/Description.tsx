import TableComponent from '@/components/TableComponent';
import { Row, Select } from 'antd';
import React from 'react';
import { useQuery } from 'react-query';
import { reportSeasson } from '../../services';
import { columnPlantbeds } from './Report.Config';
const { Option } = Select;

interface IProps {
    record: any;
    refetch: any;
}

const initialFilterQuery = {};
const ReportPlantbeds = (props: IProps) => {
    const { record } = props;
    const [filterQuery, setFilterQuery] = React.useState(initialFilterQuery);
    const [page, setPage] = React.useState(1);
    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['reportPlantbeds', page, filterQuery], () =>
        reportSeasson.detailPlantbeds(record?.id, { page, ...filterQuery })
    );

    const newData = data?.data?.flatMap(({ name, plantbeds }: any) =>
        plantbeds.map(({ sid, name: plantbedName, currentStatus, seasons }: any) => {
            return {
                name,
                plantbedId: sid,
                plantbedName,
                status: currentStatus,
                reason: seasons?.[0]?.seasonsPlantbeds?.reasonForStopping,
            };
        })
    );
    React.useEffect(() => {
        refetch();
    }, []);
    return (
        <div style={{ width: '80%' }}>
            <Row style={{ fontWeight: 600, fontSize: 18 }} className="gx-m-0 gx-pb-3" align="middle">
                Luống trồng
            </Row>
            <TableComponent
                showFilter={true}
                reLoadData={refetch}
                showTotalResult
                loading={isRefetching || isLoading}
                page={page}
                rowSelect={false}
                onChangePage={(_page) => setPage(_page)}
                dataSource={newData}
                columns={columnPlantbeds(page)}
                total={newData?.length}
            />
        </div>
    );
};

export default ReportPlantbeds;
