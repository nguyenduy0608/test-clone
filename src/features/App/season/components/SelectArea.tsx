import AxiosClient from '@/apis/AxiosClient';
import { Select, SelectProps } from 'antd';
import React from 'react';

interface IProps {
    apiUrl: string;
    onChange?: any;
    placeholder?: string;
    value?: any;
    params?: any;
    disable?: boolean;
    onDeselect?: any;
    reload?: any;
    selectArea?: Array<any>;
}

const SelectArea = (props: IProps) => {
    const { apiUrl, onChange, placeholder, value, params, disable = false, onDeselect, reload, selectArea } = props;
    const [data, setData] = React.useState<any[]>([]);

    React.useEffect(() => {
        const options: SelectProps['options'] = [];
        const fetchData = async () => {
            try {
                if (params?.gardenId) {
                    const response = await AxiosClient.get(`${apiUrl}`, { params: { ...params, limit: 999 } });
                    for (let i = 0; i < response?.data?.length; ++i) {
                        options.push({
                            ...response?.data[i],
                            value: response?.data[i].id,
                            label: response?.data[i].name,
                        });
                    }

                    const filteredOptions = selectArea
                        ? options.filter((option) => !selectArea.includes(option.value))
                        : options;
                    setData(filteredOptions);
                } else {
                    setData([]);
                }
            } catch (error) {}
        };
        fetchData();
    }, [params, reload]);
    return (
        <Select
            removeIcon={true}
            mode="multiple"
            style={{ width: '100%', minWidth: '200px' }}
            onChange={(item: any, record: any) => {
                onChange && onChange(item ? item : undefined, record ? record : undefined);
            }}
            tokenSeparators={[',']}
            value={value}
            onDeselect={(deselectedValue: any, option: any) => {
                onDeselect && onDeselect(option ? option : undefined);
            }}
            allowClear={false}
            options={data}
            placeholder={placeholder}
            disabled={disable}
            maxTagCount={3}
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
        />
    );
};

export default SelectArea;
