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
    reload?: any;
}

const SelectSeason = (props: IProps) => {
    const { apiUrl, onChange, placeholder, value, params, disable = false, reload } = props;
    const [data, setData] = React.useState<any[]>([]);

    React.useEffect(() => {
        const options: SelectProps['options'] = [];
        const fetchData = async () => {
            try {
                if (params?.gardenId) {
                    const response = await AxiosClient.get(`${apiUrl}`, {
                        params: { ...params, limit: 999, status: 'in_progess' },
                    });
                    for (let i = 0; i < response?.data?.length; ++i) {
                        options.push({
                            value: response?.data[i].id,
                            label: response?.data[i].fullName + '-' + response?.data[i].flower?.name,
                        });
                    }
                    setData(options);
                } else {
                    setData([]);
                }
            } catch (error) {}
        };
        fetchData();
    }, [params, reload]);
    return (
        <Select
            mode="multiple"
            style={{ width: '100%', minWidth: '200px' }}
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

export default SelectSeason;
