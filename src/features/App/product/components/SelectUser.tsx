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
    showSearch?: any;
}

const SelectUser = (props: IProps) => {
    const { apiUrl, onChange, placeholder, value, params, disable = false, reload, showSearch } = props;
    const [data, setData] = React.useState<any[]>([]);

    React.useEffect(() => {
        const options: SelectProps['options'] = [];
        const fetchData = async () => {
            try {
                if (params?.gardenId) {
                    const response = await AxiosClient.get(`${apiUrl}`, { params: { ...params, limit: 999 } });
                    for (let i = 0; i < response?.data?.length; ++i) {
                        options.push({
                            value: response?.data[i].id,
                            label: response?.data[i].fullName,
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
            }}
            showSearch={props.showSearch}
            tokenSeparators={[',']}
            value={value}
            options={data}
            placeholder={placeholder}
            allowClear
            disabled={disable}
            maxTagCount={2}
            filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').includes(input.toLowerCase())}
            filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
        />
    );
};

export default SelectUser;
