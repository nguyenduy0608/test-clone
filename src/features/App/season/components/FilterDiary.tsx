import RangerPicker from '@/components/RangerPicker';
import SearchInput from '@/components/SearchInput';
import useCallContext from '@/hooks/useCallContext';
import { Select, Space } from 'antd';

const { Option } = Select;

const FilterDiary = ({ returnFilter }: { returnFilter: (filter: any) => void }) => {
    const { state } = useCallContext();
    return (
        <Space size="middle" wrap>
            <SearchInput onChangeSearch={(search) => returnFilter({ search })} placeholderSearch="Người tạo" />

            <RangerPicker
                valueOptions={4}
                name="dateFilter"
                tooltipTitle="Lọc theo ngày tạo"
                onChange={(name: string, value: string) => {
                    returnFilter({ startDate: value.split(',')[0], endDate: value.split(',')[1] });
                }}
                // defaultValue={params?.fromDate ? [moment(params?.createFrom), moment(params?.toDate)] : null}
            />
        </Space>
    );
};

export default FilterDiary;
