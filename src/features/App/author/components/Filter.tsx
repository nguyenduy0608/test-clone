import RangerPicker from '@/components/RangerPicker';
import SearchInputWord from '@/components/SearchInput/SearchInputWord';
import { DefaultSelectStyled } from '@/config/global.style';
import { STATUS_WORK } from '@/contants';
import { Select, Space } from 'antd';
import styled from 'styled-components';

const { Option } = Select;

const Filter = ({ returnFilter }: { returnFilter: (filter: any) => void }) => {
    const handleChange = (value: any) => {
        returnFilter({ status: value });
    };

    return (
        <SpaceStyled size="middle" wrap style={{ width: '100%' }}>
            <SearchInputWord
                onChangeSearch={(search: string) => returnFilter(search)}
                placeholderSearch="Tên tác giả"
            />
            <DefaultSelectStyled
                placeholder="Trạng thái"
                allowClear
                style={{ width: '100%' }}
                defaultValue={null}
                onChange={handleChange}
            >
                <Option value={1}>Đang hoạt động</Option>
                <Option value={2}>Ngừng hoạt động</Option>
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
