import { DatePicker, Select, Space } from 'antd';
import React from 'react';
import RangerPickerMonth from './RangerPickerMonth';
import moment from 'moment';
import RangerPicker from '@/components/RangerPicker';
import SearchInput from '@/components/SearchInput';

const Filter = ({ returnFilter, params }: { returnFilter: (filter: any) => void; params?: any }) => {
    return (
        <>
            <Space size="middle" wrap>
                <SearchInput placeholderSearch="Tìm kiếm" onChangeSearch={(search) => returnFilter({ search })} />
            </Space>
        </>
    );
};

export default Filter;
