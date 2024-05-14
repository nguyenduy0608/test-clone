import RangerPicker from '@/components/RangerPicker';
import SelectComponent from '@/components/SelectComponent';
import { Select, Space } from 'antd';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

moment.locale('vi');

const Filter = ({ returnFilter }: { returnFilter: (filter: any) => void }) => {
    const [selectSeasons, setSelectSeasons] = React.useState<any>();
    const [selectGardens, setSelectGardens] = React.useState<any>();
    const [selectFlowers, setSelectFlowers] = React.useState<any>();
    const [valueSeasons, setValueSeasons] = React.useState<any>();
    const [valueGardens, setValueGardens] = React.useState<any>();
    const [valueFlowers, setValueFlowers] = React.useState<any>();

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

            <RangerPicker
                name="dateFilter"
                tooltipTitle="Lọc theo ngày bắt đầu thu hoạch thực tế"
                onChange={(name: string, value: string) => {
                    returnFilter({ startDate: value.split(',')[0], endDate: value.split(',')[1] });
                }}
                valueOptions={4}
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
