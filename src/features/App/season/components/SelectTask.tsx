import AxiosClient from '@/apis/AxiosClient';
import { Select, SelectProps } from 'antd';
import React from 'react';

interface IProps {
    apiUrl: string;
    onChange?: (id: any) => void;
    placeholder?: string;
    value?: any;
    params?: any;
    disable?: boolean;
}

const SelectTask = (props: IProps) => {
    const { apiUrl, onChange, placeholder, value, params, disable = false } = props;
    const [data, setData] = React.useState<any[]>([]);
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AxiosClient.get(`${apiUrl}`, { params: { ...params, limit: 999 } });
                const options: any = response?.data?.tasks?.map((item: any) => {
                    return {
                        value: item.id,
                        label: item?.name,
                    };
                });
                setData(options);
            } catch (error) {}
        };
        fetchData();
    }, [apiUrl]);
    return (
        <Select
            onChange={(item: any) => {
                onChange && onChange(item ? item : undefined);
                // const arr = item.map((it: any) => it);
                // returnFilter({ df_province_ids: arr.join(', ') || '' });
            }}
            tokenSeparators={[',']}
            value={value}
            options={data}
            placeholder={placeholder}
            allowClear
            disabled={disable}
            maxTagCount={3}
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
        />
    );
};

export default SelectTask;
