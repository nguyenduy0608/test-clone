import SearchInput from '@/components/SearchInput';
import { TimeType } from '@/contants';
import { DatePicker, Select, Space } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import styled from 'styled-components';

moment.locale('vi');
const { Option } = Select;
const { RangePicker } = DatePicker;
const startOfWeek = moment().startOf('month').format('YYYY-MM-DD');
const endOfWeek = moment().endOf('month').format('YYYY-MM-DD');

const Filter = ({
    setValueStatus,
    initialFilterQuery,
    returnFilter,
    valueOptions,
    setValueOptions,
}: {
    returnFilter: (filter: any) => void;
    valueOptions: any;
    setValueOptions: any;
    setValueStatus?: any;
    initialFilterQuery: any;
}) => {
    const onChangeDate = (date: any, dateString: any) => {
        returnFilter({
            time_type: TimeType.DATE,
            exactDate: null,
            startDate: dateString[0] !== '' ? moment(dateString[0], 'DD-MM-YYYY').format('YYYY-MM-DD') : null,
            endDate: dateString[1] !== '' ? moment(dateString[1], 'DD-MM-YYYY').format('YYYY-MM-DD') : null,
        });
    };

    return (
        <SpaceStyled size="middle" wrap style={{ width: '100%' }}>
            {/* <SearchInput
                onChangeSearch={(search) => returnFilter({ search })}
                placeholderSearch="Nhập tên/SĐT khách hàng"
            /> */}

            {/* <RangePicker
                name="dateFilter"
                format="DD-MM-YYYY"
                style={{ width: '100%' }}
                onChange={onChangeDate}
                allowClear={false}
                defaultValue={[moment(startOfWeek, 'YYYY-MM-DD'), moment(endOfWeek, 'YYYY-MM-DD')]}
            /> */}
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
