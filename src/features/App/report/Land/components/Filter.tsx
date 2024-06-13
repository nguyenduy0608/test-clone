import FormItemComponent from '@/components/FormComponent/FormItemComponent';
import RangerPicker from '@/components/RangerPicker';
import SearchInput from '@/components/SearchInput';
import SelectComponent from '@/components/SelectComponent';
import { TimeType } from '@/contants';
import { DatePicker, Form, Select, Space, Tooltip } from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/vi';
import React from 'react';
import styled from 'styled-components';

moment.locale('vi');
const { Option } = Select;
const startOfWeek = moment().startOf('month').format('YYYY-MM-DD');
const endOfWeek = moment().endOf('month').format('YYYY-MM-DD');

const { RangePicker } = DatePicker;
const Filter = ({
    returnFilter,
    valueOptions,
    setValueOptions,
    setId,
    setDataCate,
    initialFilterQuery,
}: {
    returnFilter: (filter: any) => void;
    valueOptions: any;
    setDataCate: any;
    setId: any;
    setValueOptions: any;
    initialFilterQuery: any;
}) => {
    const [valueGarden, setValueGarden] = React.useState<number | string>();
    const [checkValue, setCheckValue] = React.useState<any>('');
    const onChangeDate = async (date: any, dateString: any) => {
        returnFilter({
            time_type: TimeType.DATE,
            exactDate: null,
            startDate: dateString[0] !== '' ? moment(dateString[0], 'DD-MM-YYYY').format('YYYY-MM-DD') : null,
            endDate: dateString[1] !== '' ? moment(dateString[1], 'DD-MM-YYYY').format('YYYY-MM-DD') : null,
        });
        const res = await axios.post(
            `http://localhost:5243/api/Statistics/createStatistic?from=${moment(dateString[0], 'DD-MM-YYYY').format(
                'YYYY-MM-DD'
            )}&to=${moment(dateString[1], 'DD-MM-YYYY').format('YYYY-MM-DD')}`
        );
        const data = await axios.get(
            `http://localhost:5243/api/Statistics/getCategoryStatistics?from=${moment(
                dateString[0],
                'DD-MM-YYYY'
            ).format('YYYY-MM-DD')}&to=${moment(dateString[1], 'DD-MM-YYYY').format('YYYY-MM-DD')} `
        );
        setDataCate(data);
        setId(res?.data?.id);
    };
    const disabledDate = (current: any) => {
        // Disable dates after the current date
        return current && current > moment().endOf('day');
    };

    return (
        <SpaceStyled size="middle" wrap style={{ width: '100%' }}>
            {/* <SearchInput onChangeSearch={(search) => returnFilter({ search })} placeholderSearch="Nhập tên sản phẩm" /> */}

            {/* <SelectComponent
                onChange={(item: any) => {
                    returnFilter({ gardenId: item?.value, areaId: null });
                    setValueGarden(item?.value);
                    setCheckValue(null);
                }}
                apiUrl="/reports/gardens-select"
                placeholder="Tác giả"
            /> */}

            <RangePicker
                name="dateFilter"
                format="DD-MM-YYYY"
                style={{ width: '100%' }}
                onChange={onChangeDate}
                allowClear={false}
                defaultValue={[moment(startOfWeek, 'YYYY-MM-DD'), moment(endOfWeek, 'YYYY-MM-DD')]}
            />
        </SpaceStyled>
    );
};

export default Filter;
const SpaceStyled = styled(Space)`
    & .ant-space-item {
        width: 100%;
    }
    @media (min-width: 768px) {
        /* Điều chỉnh kích thước khi màn hình có độ rộng từ 768px trở lên */
        & .ant-space-item {
            width: 30%; /* Đặt kích thước mong muốn cho SpaceStyled trên web */
        }
    }
`;

const StyledRangePicker = styled(RangePicker)`
    .ant-picker-cell-inner {
        font-size: 13px;
    }
`;

const Container = styled.span`
    .custom-tooltip {
        position: relative;
        display: inline-block;
        cursor: pointer;
    }

    .tooltip-text {
        visibility: hidden;
        position: absolute;
        background-color: #333;
        color: #fff;
        padding: 5px;
        border-radius: 5px;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        z-index: 1;
    }

    .custom-tooltip:hover .tooltip-text {
        visibility: visible;
    }
`;
