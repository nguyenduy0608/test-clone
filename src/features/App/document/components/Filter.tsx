import RangerPicker from '@/components/RangerPicker';
import SearchInput from '@/components/SearchInput';
import SelectComponent from '@/components/SelectComponent';
import { DefaultSelectStyled } from '@/config/global.style';
import { MINWIGHT } from '@/config/theme';
import { NEWS_STATUS, ROLE } from '@/contants';
import useCallContext from '@/hooks/useCallContext';
import { Select, Space } from 'antd';
import styled from 'styled-components';

const { Option } = Select;

const Filter = ({ returnFilter }: { returnFilter: (filter: any) => void }) => {
    const { state } = useCallContext();
    const handleChange = (value: any) => {
        returnFilter({ status: value });
    };
    const handleChangeAdmin = (value: any) => {
        returnFilter({ type: value });
    };

    return (
        <SpaceStyled size="middle" wrap style={{ width: '100%' }}>
            <SearchInput
                onChangeSearch={(search) => returnFilter({ search })}
                placeholderSearch="Nhập tên tiêu đề, vườn"
            />
            <DefaultSelectStyled
                placeholder="Trạng thái"
                allowClear
                style={{ width: '100%' }}
                defaultValue={null}
                onChange={handleChange}
            >
                <Option value={NEWS_STATUS.POST}>Đăng bài</Option>
                <Option value={NEWS_STATUS.DRAFT}>Lưu nháp</Option>
            </DefaultSelectStyled>
            <SelectComponent
                onChange={(item: any) => {
                    returnFilter({ flower_id: item?.value });
                }}
                apiUrl="/flowers"
                placeholder="Chọn cây trồng"
            />
            <RangerPicker
                tooltipTitle="Lọc theo ngày tạo"
                name="dateFilter"
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
