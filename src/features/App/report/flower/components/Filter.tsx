import RangerPicker from '@/components/RangerPicker';
import SelectComponent from '@/components/SelectComponent';
import { DefaultSelectStyled } from '@/config/global.style';
import { STATUS_SEASON } from '@/contants';
import useCallContext from '@/hooks/useCallContext';
import { Select, Space } from 'antd';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

const { Option } = Select;

const Filter = ({ returnFilter }: { returnFilter: (filter: any) => void }) => {
    const startOfMonth = moment().startOf('month');
    // Lấy ngày hiện tại
    const currentDate = moment();

    // Thiết lập giá trị mặc định từ đầu tháng đến ngày hiện tại
    const defaultValue = [startOfMonth, currentDate];
    const [selectSeasons, setSelectSeasons] = React.useState<any>();
    const [selectGardens, setSelectGardens] = React.useState<any>();
    const [selectFlowers, setSelectFlowers] = React.useState<any>();
    const [valueSeasons, setValueSeasons] = React.useState<any>();
    const [valueGardens, setValueGardens] = React.useState<any>();
    const [valueFlowers, setValueFlowers] = React.useState<any>();
    const { state } = useCallContext();
    const handleChange = (value: any) => {
        returnFilter({ season_status: value });
    };
    const handleChangeAdmin = (value: any) => {
        returnFilter({ type: value });
    };

    return (
        <SpaceStyled size="middle" wrap style={{ width: '100%' }}>
            <SelectComponent
                onChange={(item: any) => {
                    returnFilter(
                        item?.value === undefined
                            ? { seasonId: item?.value, flowerId: '', gardenId: '' }
                            : { seasonId: item?.value }
                    );
                    setSelectSeasons(item?.value);
                    setValueSeasons(item?.label);
                }}
                onClear={() => {
                    setSelectGardens(null);
                    setSelectFlowers(null);
                    setValueFlowers(null);
                    setValueGardens(null);
                }}
                value={valueSeasons}
                params={{ status: 'in_progress', gardenId: selectGardens, flowerId: selectFlowers }}
                apiUrl="/reports/seasons-select"
                placeholder="Vụ mùa"
            />
            <SelectComponent
                onChange={(item: any) => {
                    returnFilter(
                        item?.value === undefined
                            ? { gardenId: item?.value, seasonId: null, flowerId: null }
                            : { gardenId: item?.value }
                    );
                    setSelectGardens(item?.value);

                    setValueGardens(item?.label);
                }}
                onClear={() => {
                    setSelectSeasons(null);
                    setSelectFlowers(null);
                    setValueFlowers(null);
                    setValueSeasons(null);
                }}
                value={valueGardens}
                params={{ flowerId: selectFlowers, seasonId: selectSeasons }}
                apiUrl="/reports/gardens-select"
                placeholder="Chọn vườn"
            />
            <SelectComponent
                // value={storageArr}
                onChange={(item: any) => {
                    returnFilter(
                        item?.value === undefined
                            ? { flowerId: item?.value, gardenId: null, seasonId: null }
                            : { flowerId: item?.value }
                    );
                    setSelectFlowers(item?.value);

                    setValueFlowers(item?.label);
                }}
                onClear={() => {
                    setValueSeasons(null);
                    setValueGardens(null);
                    setSelectSeasons(null);
                    setSelectGardens(null);
                }}
                value={valueFlowers}
                params={{ gardenId: selectGardens, seasonId: selectSeasons }}
                apiUrl="/reports/flowers-select"
                placeholder="Chọn loại cây trồng"
            />

            <DefaultSelectStyled
                placeholder="Trạng thái"
                allowClear
                style={{ width: '100%' }}
                defaultValue={null}
                onChange={handleChange}
            >
                <Option value={STATUS_SEASON.InProgress}>Đang trồng</Option>
                <Option value={STATUS_SEASON.ManyHavests}>Đã thu hoạch</Option>
            </DefaultSelectStyled>

            <RangerPicker
                name="dateFilter"
                tooltipTitle="Lọc theo ngày thu hoạch dự kiến"
                onChange={(name: string, value: string) => {
                    returnFilter({ startDate: value.split(',')[0], endDate: value.split(',')[1] });
                }}
                valueOptions={4}
                defaultValue={defaultValue}
                // defaultValue={params?.fromDate ? [moment(params?.createFrom), moment(params?.toDate)] : null}
            />
        </SpaceStyled>
    );
};

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

export default Filter;
