import CardComponent from '@/components/CardComponent';
import TableComponent from '@/components/TableComponent';
import React from 'react';
import { columnsExpense } from './Season.Config';
import { Button } from 'antd';
import { IFilter } from '@/types';
import FilterExpense from './FilterExpense';
const initialFilterQuery = {};
const ListExpense = ({ data }: any) => {
    const [page, setPage] = React.useState<number>(1);
    const [filterQuery, setFilterQuery] = React.useState(initialFilterQuery);
    const returnFilter = React.useCallback(
        (filter: IFilter) => {
            setPage(1);
            setFilterQuery({ ...filterQuery, ...filter });
        },
        [filterQuery]
    );
    return (
        <>
            <CardComponent title={<FilterExpense returnFilter={returnFilter} key="filter" />}>
                <TableComponent
                    page={page}
                    rowSelect={false}
                    onChangePage={(_page) => setPage(_page)}
                    dataSource={data?.data?.expenses || []}
                    columns={columnsExpense(page)}
                />
            </CardComponent>
        </>
    );
};

export default ListExpense;
