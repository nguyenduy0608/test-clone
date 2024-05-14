import RangerPicker from '@/components/RangerPicker';
import SearchInput from '@/components/SearchInput';
import { DefaultSelectStyled } from '@/config/global.style';
import { MINWIGHT } from '@/config/theme';
import { TYPE_FLOWER } from '@/contants';
import useCallContext from '@/hooks/useCallContext';
import { IFilter } from '@/types';
import { Select, Space } from 'antd';
import styled from 'styled-components';

const { Option } = Select;

const Filter = ({ returnFilter }: { returnFilter: (filter: any) => void }) => {
    const { state } = useCallContext();
    const handleChange = (value: any) => {
        returnFilter({ status: value });
    };
    const handleChangeTypeTree = (value: any) => {
        returnFilter({ type: value });
    };

    return (
        <SpaceStyled size="middle" wrap style={{ width: '100%' }}>
            <SearchInput
                onChangeSearch={(search) => returnFilter({ search })}
                placeholderSearch="Nhập tên hoặc mã cây trồng"
            />
            <DefaultSelectStyled
                placeholder="Loại cây"
                allowClear
                style={{ width: '100%' }}
                defaultValue={null}
                onChange={handleChangeTypeTree}
            >
                <Option value={TYPE_FLOWER.GROW_ONE}>Thu một lần</Option>
                <Option value={TYPE_FLOWER.GROWN_MANY_TIMES}>Thu nhiều lần</Option>
                <Option value={TYPE_FLOWER.PERENNIAL}>Lâu năm</Option>
            </DefaultSelectStyled>
            <DefaultSelectStyled
                placeholder="Trạng thái"
                allowClear
                style={{ width: '100%' }}
                defaultValue={null}
                onChange={handleChange}
            >
                <Option value={1}>Đang hoạt động</Option>
                <Option value={0}>Ngừng hoạt động</Option>
            </DefaultSelectStyled>
            <RangerPicker
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
