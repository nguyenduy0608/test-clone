import RangerPicker from '@/components/RangerPicker';
import SearchInput from '@/components/SearchInput';
import { DefaultSelectStyled } from '@/config/global.style';
import { Select, Space } from 'antd';

const { Option } = Select;

const Filter = ({ returnFilter }: { returnFilter: (filter: any) => void }) => {
    const handleChange = (value: any) => {
        returnFilter({ is_active: value });
    };

    return (
        <Space size="middle" wrap>
            <SearchInput
                onChangeSearch={(search) => returnFilter({ code: search?.trim() })}
                placeholderSearch="Nhập tên màu"
            />
            <DefaultSelectStyled
                placeholder="Trạng thái"
                allowClear
                style={{ width: '200px' }}
                defaultValue={null}
                onChange={handleChange}
            >
                <Option value={1}>Đang hoạt động</Option>
                <Option value={0}>Ngừng hoạt động</Option>
            </DefaultSelectStyled>
            <RangerPicker
                name="dateFilter"
                onChange={(name: string, value: string) => {
                    returnFilter({ fromDate: value.split(',')[0], toDate: value.split(',')[1] });
                }}
            />
        </Space>
    );
};

export default Filter;
