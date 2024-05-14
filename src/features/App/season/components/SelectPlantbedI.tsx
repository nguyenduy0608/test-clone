import AxiosClient from '@/apis/AxiosClient';
import { Select, SelectProps } from 'antd';
import React from 'react';

interface IProps {
    apiUrl: string;
    onChange?: any;
    placeholder?: string;
    value?: any;
    params?: any;
    deletePlantbeds?: number;
    disable?: boolean;
    selectPlantbeds?: Array<any>;
}

const SelectPlant = (props: IProps) => {
    const { apiUrl, onChange, placeholder, value, params, disable = false, deletePlantbeds, selectPlantbeds } = props;

    const [data, setData] = React.useState<any[]>([]);

    React.useEffect(() => {
        const options: SelectProps['options'] = [];

        const fetchData = async () => {
            try {
                if (params?.areaIds) {
                    const response = await AxiosClient.get(`${apiUrl}`, { params: { ...params, limit: 999 } });
                    for (let i = 0; i < response?.data?.length; ++i) {
                        options.push({
                            ...response?.data[i],
                            value: response?.data[i].id,
                            areaId: response?.data[i].areaId,
                            label:
                                response?.data[i].sid +
                                ' - ' +
                                response?.data[i].name +
                                ' - ' +
                                response?.data[i]?.area?.name,
                        });
                    }

                    setData(options);

                    setTimeout(() => {
                        const filteredOptions = selectPlantbeds
                            ? options.filter((option: any) => !selectPlantbeds.includes(option.value))
                            : options;
                        setData(filteredOptions);
                    }, 50);
                } else {
                    setData([]);
                }
            } catch (error) {}
        };
        fetchData();
    }, [params, selectPlantbeds]);

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
            options={data}
            placeholder={placeholder}
            allowClear={false}
            disabled={disable}
            maxTagCount={3}
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
        />
    );
};

export default SelectPlant;
