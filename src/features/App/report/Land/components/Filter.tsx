import FormItemComponent from '@/components/FormComponent/FormItemComponent';
import SearchInput from '@/components/SearchInput';
import SelectComponent from '@/components/SelectComponent';
import { TimeType } from '@/contants';
import { DatePicker, Form, Select, Space, Tooltip } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import React from 'react';
import styled from 'styled-components';

moment.locale('vi');
const { Option } = Select;
const startOfWeek = moment().startOf('isoWeek').format('YYYY-MM-DD');
const endOfWeek = moment().endOf('isoWeek').format('YYYY-MM-DD');
const startOfQuarter = moment().startOf('quarter').format('YYYY-MM-DD');
const startOfYear = moment().startOf('year').format('YYYY-MM-DD');
const endOfQuarter = moment().endOf('quarter').format('YYYY-MM-DD');
const endOfYear = moment().endOf('year').format('YYYY-MM-DD');
const { RangePicker } = DatePicker;
const Filter = ({
    returnFilter,
    valueOptions,
    setValueOptions,
    initialFilterQuery,
}: {
    returnFilter: (filter: any) => void;
    valueOptions: any;
    setValueOptions: any;
    initialFilterQuery: any;
}) => {
    const [valueGarden, setValueGarden] = React.useState<number | string>();
    const [checkValue, setCheckValue] = React.useState<any>('');
    const onChangeMonth = (date: any, dateString: any) => {
        const startDate = dateString[0] !== '' ? moment(dateString[0], 'MM-YYYY').startOf('month') : null;
        const endDate = dateString[1] !== '' ? moment(dateString[1], 'MM-YYYY').endOf('month') : null;

        const isSameMonth = startDate && endDate && startDate.isSame(endDate, 'month');

        returnFilter({
            time_type: isSameMonth ? TimeType.MONTH : TimeType.MONTH,
            startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
            endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
            exactDate: null,
        });
    };
    const getPopupContainer = (trigger: any) => {
        return trigger.parentNode; // Thay đổi vị trí hiển thị của tooltip tại đây
    };

    const onChangeQuarter = (date: any, dateString: any) => {
        const startDate = dateString[0] !== '' ? moment(dateString[0], 'YYYY-[Q]Q').startOf('quarter') : null;
        const endDate = dateString[1] !== '' ? moment(dateString[1], 'YYYY-[Q]Q').endOf('quarter') : null;

        const isSameQuarter = startDate && endDate && startDate.quarter() === endDate.quarter();

        returnFilter({
            time_type: isSameQuarter ? TimeType.MONTH : TimeType.QUARTER,
            startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
            endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
            exactDate: null,
        });
    };

    const onChangeYear = (date: any, dateString: any) => {
        const startDate = dateString[0] !== '' ? moment(dateString[0]) : null;
        const endDate = dateString[1] !== '' ? moment(dateString[1]) : null;

        const isSameYear = startDate && endDate && startDate.isSame(endDate, 'year');

        returnFilter({
            time_type: isSameYear ? TimeType.MONTH : TimeType.YEAR,
            startDate: startDate ? startDate.startOf('year').format('YYYY-MM-DD') : null,
            endDate: endDate ? endDate.endOf('year').format('YYYY-MM-DD') : null,
            exactDate: null,
        });
    };

    const disabledDate = (current: any) => {
        // Disable dates after the current date
        return current && current > moment().endOf('day');
    };

    return (
        <SpaceStyled size="middle" wrap style={{ width: '100%' }}>
            <SearchInput onChangeSearch={(search) => returnFilter({ search })} placeholderSearch="Nhập tên sản phẩm" />

            <SelectComponent
                onChange={(item: any) => {
                    returnFilter({ gardenId: item?.value, areaId: null });
                    setValueGarden(item?.value);
                    setCheckValue(null);
                }}
                apiUrl="/reports/gardens-select"
                placeholder="Tác giả"
            />

            <SelectComponent
                onChange={(item: any) => {
                    returnFilter({ areaId: item?.value });
                    setCheckValue(item?.label);
                }}
                value={checkValue}
                params={{ gardenId: valueGarden }}
                apiUrl="/reports/land-areas"
                placeholder="Phân loại"
            />
            <Select
                placeholder="Chọn quãng thời gian"
                style={{ width: '100%' }}
                allowClear={false}
                onChange={(value: string) => {
                    setValueOptions(value);
                    value === TimeType.MONTH
                        ? returnFilter(initialFilterQuery)
                        : value === TimeType.QUARTER
                        ? returnFilter({
                              time_type: TimeType.MONTH,
                              startDate: startOfQuarter,
                              endDate: endOfQuarter,
                          })
                        : value === TimeType.YEAR
                        ? returnFilter({
                              time_type: TimeType.MONTH,
                              startDate: startOfYear,
                              endDate: endOfYear,
                          })
                        : returnFilter(initialFilterQuery);
                }}
                defaultValue={TimeType.MONTH}
            >
                <Option value={TimeType.MONTH}>Tháng</Option>
                <Option value={TimeType.QUARTER}>Quý</Option>
                <Option value={TimeType.YEAR}>Năm</Option>
            </Select>
            {valueOptions === TimeType.MONTH ? (
                <Tooltip title="Lọc theo tháng" style={{ width: '100%' }}>
                    <StyledRangePicker
                        picker="month"
                        style={{ width: '100%' }}
                        name="dateFilter"
                        format="MM-YYYY"
                        disabledDate={disabledDate}
                        onChange={onChangeMonth}
                        getPopupContainer={getPopupContainer}
                        allowClear={false}
                        defaultValue={[
                            moment(initialFilterQuery.startDate, 'YYYY-MM-DD'),
                            moment(initialFilterQuery.endDate, 'YYYY-MM-DD'),
                        ]}
                        placeholder={['Từ tháng', 'Đến tháng']}
                    />
                </Tooltip>
            ) : valueOptions === TimeType.QUARTER ? (
                <Tooltip title="Lọc theo quý" style={{ width: '100%' }}>
                    <RangePicker
                        picker="quarter"
                        style={{ width: '100%' }}
                        disabledDate={disabledDate}
                        getPopupContainer={getPopupContainer}
                        allowClear={false}
                        defaultValue={[moment(startOfQuarter, 'YYYY-MM-DD'), moment(endOfQuarter, 'YYYY-MM-DD')]}
                        name="dateFilter"
                        onChange={onChangeQuarter}
                        placeholder={['Từ quý', 'Đến quý']}
                    />
                </Tooltip>
            ) : (
                <Tooltip title="Lọc theo năm" style={{ width: '100%' }}>
                    <RangePicker
                        allowClear={false}
                        disabledDate={disabledDate}
                        defaultValue={[moment(startOfYear, 'YYYY-MM-DD'), moment(endOfYear, 'YYYY-MM-DD')]}
                        getPopupContainer={getPopupContainer}
                        picker="year"
                        style={{ width: '100%' }}
                        onChange={onChangeYear}
                        placeholder={['Từ năm', 'Đến năm']}
                    />
                </Tooltip>
            )}
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
