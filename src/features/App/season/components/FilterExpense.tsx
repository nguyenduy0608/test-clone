import RangerPicker from '@/components/RangerPicker';
import SearchInput from '@/components/SearchInput';
import SelectComponent from '@/components/SelectComponent';
import { DefaultSelectStyled } from '@/config/global.style';
import { TAB_MOBLIE } from '@/config/theme';
import { STATUS_SEASON, TYPE_FLOWER } from '@/contants';
import useCallContext from '@/hooks/useCallContext';
import useWindowSize from '@/hooks/useWindowSize';
import { Select, Space } from 'antd';
import styled from 'styled-components';

const { Option } = Select;

const FilterExpense = ({
    returnFilter,
    harvestId,
    setChangingId,
}: {
    returnFilter: (filter: any) => void;
    harvestId?: any;
    setChangingId?: any;
}) => {
    const { state } = useCallContext();
    const { width } = useWindowSize();
    const handleChange = (value: any) => {
        setChangingId(harvestId);
        returnFilter({ expenseType: value, harvestId: harvestId });
    };

    return (
        <SpaceStyled
            size="middle"
            style={
                width <= TAB_MOBLIE
                    ? { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }
                    : { width: '100%', display: 'flex', flexDirection: 'row' }
            }
        >
            <DefaultSelectStyled
                placeholder="Loại chi phí"
                allowClear
                style={{ width: '100%' }}
                defaultValue={null}
                onChange={handleChange}
                options={[
                    {
                        value: 'land_rents',
                        label: 'Chi phí thuê đất',
                    },
                    {
                        value: 'labor_costs',
                        label: 'Chi phí nhân công',
                    },
                    {
                        value: 'fertilizers_costs',
                        label: 'Chi phí phân bón',
                    },
                    {
                        value: 'pakaging_costs',
                        label: 'Chi phí đóng gói',
                    },
                    {
                        value: 'another_costs',
                        label: 'Chi phí khác',
                    },
                    {
                        value: 'cultivars_costs',
                        label: 'Chi phí hạt giống',
                    },
                    {
                        value: 'pesticides_costs',
                        label: 'Chi phí thuốc trừ sâu',
                    },
                ]}
            />
            <RangerPicker
                name="dateFilter"
                tooltipTitle="Lọc theo ngày phát sinh"
                onChange={(name: string, value: string) => {
                    setChangingId(harvestId);
                    returnFilter({
                        startDate: value.split(',')[0],
                        endDate: value.split(',')[1],
                        harvestId: harvestId,
                    });
                }}
                // defaultValue={params?.fromDate ? [moment(params?.createFrom), moment(params?.toDate)] : null}
            />
        </SpaceStyled>
    );
};

export default FilterExpense;
const SpaceStyled = styled(Space)`
    display: flex;
    & .ant-space-item {
        width: 100%;
    }
    @media (min-width: 768px) {
        /* Điều chỉnh kích thước khi màn hình có độ rộng từ 768px trở lên */
        & .ant-space-item {
            width: 100%; /* Đặt kích thước mong muốn cho SpaceStyled trên web */
        }
    }
`;
