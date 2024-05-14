import SearchInput from '@/components/SearchInput';
import TableComponent from '@/components/TableComponent';
import React from 'react';
import { useQuery } from 'react-query';
import { gardenService } from '../services';
import { columnsUser } from './Garden.Config';
interface IProps {
    record: any;
}
const initialFilterQuery = {};
const TabUser = (props: IProps) => {
    const { record } = props;
    const [filterQuery, setFilterQuery] = React.useState(initialFilterQuery);
    const [page, setPage] = React.useState(1);
    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['users', page, filterQuery], () =>
        gardenService.detailUser(record?.id, { page, ...filterQuery })
    );
    return (
        <TableComponent
            header={
                <SearchInput
                    style={{ width: '25%' }}
                    onChangeSearch={(search) => setFilterQuery({ search })}
                    placeholderSearch="Nhập tên, số điện thoại"
                />
            }
            reLoadData={refetch}
            showTotalResult
            loading={isRefetching || isLoading}
            page={page}
            rowSelect={false}
            onChangePage={(_page) => setPage(_page)}
            dataSource={data?.data}
            columns={columnsUser(page)}
            total={data?.data && data?.paging?.totalItem}
        />
    );
};

export default TabUser;
