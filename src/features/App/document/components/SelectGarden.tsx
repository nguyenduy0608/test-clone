import AxiosClient from '@/apis/AxiosClient';
import { Select, SelectProps } from 'antd';
import React from 'react';
const { Option } = Select;
interface IProps {
    apiUrl: string;
    onChange?: (id: any) => void;
    placeholder?: string;
    value?: number[];
    params?: any;
    disable?: boolean;
    reload?: any;
    check?: number;
}

const SelectGarden = (props: IProps) => {
    const { apiUrl, onChange, placeholder, value, params, disable = false, reload, check } = props;
    console.log('🚀 ~ SelectGarden ~ check:', check);
    const [data, setData] = React.useState<any[]>([]);
    console.log('🚀 ~ SelectGarden ~ data:', data);

    React.useEffect(() => {
        const options: SelectProps['options'] = [];
        if (check === 1) {
            const fetchData = async () => {
                try {
                    const response = await AxiosClient.get(`${apiUrl}`, { params: { ...params, limit: 999 } });
                    for (let i = 0; i < response?.data?.length; ++i) {
                        options.push({
                            value: response?.data[i].id,
                            label: response?.data[i].name,
                            disable: true,
                        });
                    }
                    setData([{ label: 'Chọn tất cả', value: 'all', disable: false }, ...options]);
                } catch (error) {}
            };
            fetchData();
        } else if (check === 2) {
            const fetchData = async () => {
                try {
                    const response = await AxiosClient.get(`${apiUrl}`, { params: { ...params, limit: 999 } });
                    for (let i = 0; i < response?.data?.length; ++i) {
                        options.push({
                            value: response?.data[i].id,
                            label: response?.data[i].name,
                            disable: false,
                        });
                    }
                    setData([{ label: 'Chọn tất cả', value: 'all', disable: true }, ...options]);
                } catch (error) {}
            };
            fetchData();
        } else {
            const fetchData = async () => {
                try {
                    const response = await AxiosClient.get(`${apiUrl}`, { params: { ...params, limit: 999 } });
                    for (let i = 0; i < response?.data?.length; ++i) {
                        options.push({
                            value: response?.data[i].id,
                            label: response?.data[i].name,
                            disable: false,
                        });
                    }
                    setData([{ label: 'Chọn tất cả', value: 'all', disable: false }, ...options]);
                } catch (error) {}
            };
            fetchData();
        }
    }, [check, params, reload]);

    return (
        <Select
            mode="multiple"
            style={{ width: '100%', minWidth: '200px' }}
            onChange={(item: any) => {
                onChange && onChange(item ? item : undefined);
                if (item?.length) {
                    if (item.includes('all')) {
                        data.forEach((option) => {
                            option.disable = option.value !== 'all';
                        });
                    } else {
                        data.forEach((option) => {
                            option.disable = option.value === 'all';
                        });
                    }
                } else {
                    data.forEach((option) => {
                        option.disable = false;
                    });
                }
            }}
            tokenSeparators={[',']}
            value={value}
            placeholder={placeholder}
            allowClear
            disabled={disable}
            maxTagCount={3}
            filterOption={(input, option: any) => (option?.children?.toLowerCase() ?? '').includes(input.toLowerCase())}
            filterSort={(optionA, optionB) =>
                (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
            }
        >
            {data.map((option) => (
                <Option key={option.value} value={option.value} disabled={option.disable} label={option.label}>
                    {option.label}
                </Option>
            ))}
        </Select>
    );
};

export default SelectGarden;
