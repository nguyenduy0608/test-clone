import RangerPicker from '@/components/RangerPicker';
import SearchInput from '@/components/SearchInput';
import SearchInputWord from '@/components/SearchInput/SearchInputWord';
import SelectComponent from '@/components/SelectComponent';
import { DefaultSelectStyled } from '@/config/global.style';
import { MINWIGHT } from '@/config/theme';
import { STATUS_WORK, TYPE_FLOWER } from '@/contants';
import useCallContext from '@/hooks/useCallContext';
import { IFilter } from '@/types';
import { Select, Space } from 'antd';
import React, { useEffect } from 'react';
import styled from 'styled-components';

const { Option } = Select;

const Filter = ({ returnFilter }: { returnFilter: (filter: any) => void }) => {
    const [searchValue, setSearchValue] = React.useState<string>('');

    const handleChange = (value: any) => {
        returnFilter({ status: value });
    };

    return (
        <SpaceStyled size="middle" wrap style={{ width: '100%' }}>
            <SearchInput onChangeSearch={(search) => returnFilter({ search })} placeholderSearch="Tên/mã sản phẩm" />
            <DefaultSelectStyled
                placeholder="Trạng thái"
                allowClear
                style={{ width: '100%' }}
                defaultValue={null}
                onChange={handleChange}
            >
                <Option value={STATUS_WORK?.InPending}>Chờ tiếp nhận</Option>
                <Option value={STATUS_WORK.InProgress}>Đang thực hiện</Option>
            </DefaultSelectStyled>
            <DefaultSelectStyled
                placeholder="Phân loại"
                allowClear
                style={{ width: '100%' }}
                defaultValue={null}
                onChange={handleChange}
            >
                <Option value={STATUS_WORK?.InPending}>Bán chạy</Option>
                <Option value={STATUS_WORK.InProgress}>Tồn kho</Option>
            </DefaultSelectStyled>
            <RangerPicker
                valueOptions={4}
                name="dateFilter"
                tooltipTitle="Lọc theo ngày tạo"
                onChange={(name: string, value: string) => {
                    returnFilter({ startDate: value.split(',')[0], endDate: value.split(',')[1] });
                }}

                // defaultValue={params?.fromDate ? [moment(params?.createFrom), moment(params?.toDate)] : null}
            />
        </SpaceStyled>
    );
};

export default Filter;
const SpaceStyled = styled(Space)`
    @media (min-width: 768px) {
        /* Điều chỉnh kích thước khi màn hình có độ rộng từ 768px trở lên */
        & .ant-space-item {
            width: 30%; /* Đặt kích thước mong muốn cho SpaceStyled trên web */
        }
    }
`;
