import AxiosClient from '@/apis/AxiosClient';
import { Notification } from '@/utils';
import { Select, SelectProps } from 'antd';
import React from 'react';

interface IProps {
    apiUrl: string;
    // onChange?: (id: any) => void;
    onChange?: any;
    placeholder?: string;
    value?: any;
    params?: any;
    disable?: boolean;
    reload?: any;
    onDeselect?: any;
}

const SelectAreaWork = (props: IProps) => {
    const { apiUrl, onChange, placeholder, value, params, disable = false, reload, onDeselect } = props;
    const [data, setData] = React.useState<any[]>([]);

    React.useEffect(() => {
        const options: SelectProps['options'] = [];
        const fetchData = async () => {
            try {
                if (params?.gardenId) {
                    const response = await AxiosClient.get(`${apiUrl}`, { params: { ...params } });
                    for (let i = 0; i < response?.data?.areas?.length; ++i) {
                        options.push({
                            ...response?.data?.areas[i],
                            value: response?.data?.areas[i].id,
                            label: response?.data?.areas[i].name,
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
            onChange={(item: any, record) => {
                onChange && onChange(item ? item : undefined, record ? record : undefined);
            }}
            onDeselect={(deselectedValue: any, option: any) => {
                onDeselect && onDeselect(option ? option : undefined);
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

export default SelectAreaWork;
