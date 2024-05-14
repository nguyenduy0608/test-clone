import RangerPicker from '@/components/RangerPicker';
import SearchInput from '@/components/SearchInput';
import SelectComponent from '@/components/SelectComponent';
import { DefaultSelectStyled } from '@/config/global.style';
import { STATUS_SEASON, TYPE_FLOWER } from '@/contants';
import useCallContext from '@/hooks/useCallContext';
import { Select, Space } from 'antd';

const { Option } = Select;

const FilterHarvest = ({ returnFilter }: { returnFilter: (filter: any) => void }) => {
    const { state } = useCallContext();

    const handleChange = (value: any) => {
        returnFilter({ expenseType: value });
    };

    return (
        <Space size="middle" wrap>
            <DefaultSelectStyled
                placeholder="Loại chi phí"
                allowClear
                style={{ width: '200px' }}
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
                tooltipTitle="Lọc theo ngày thu hoạch"
                onChange={(name: string, value: string) => {
                    returnFilter({ startDate: value.split(',')[0], endDate: value.split(',')[1] });
                }}
                // defaultValue={params?.fromDate ? [moment(params?.createFrom), moment(params?.toDate)] : null}
            />
        </Space>
    );
};

export default FilterHarvest;
