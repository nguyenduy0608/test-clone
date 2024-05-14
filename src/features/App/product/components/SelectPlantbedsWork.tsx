import AxiosClient from '@/apis/AxiosClient';
import { Notification } from '@/utils';
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
    deletePlantbeds?: any[];
    filterPlantbed?: any;
}

const SelectPlantbedsWork = (props: IProps) => {
    const {
        apiUrl,
        onChange,
        placeholder,
        value,
        params,
        disable = false,
        reload,
        deletePlantbeds,
        filterPlantbed,
    } = props;
    const [data, setData] = React.useState<any[]>([]);
    React.useEffect(() => {
        const options: SelectProps['options'] = [];
        const fetchData = async () => {
            try {
                if (params?.gardenId) {
                    const response = await AxiosClient.get(`${apiUrl}`, { params: { ...params, limit: 980 } });
                    for (let i = 0; i < response?.data?.plantbeds?.length; ++i) {
                        options.push({
                            value: response?.data?.plantbeds[i].id,
                            label: response?.data?.plantbeds[i].name + '-' + response?.data?.plantbeds[i]?.area?.name,
                            area: response?.data?.plantbeds[i].area?.id,
                        });
                    }
                    const deletePlantbedIds = deletePlantbeds?.map((item: any) => item?.id);
                    const finalList = options?.filter((item: any) => filterPlantbed?.includes(item.area));
                    setData(filterPlantbed.length === 0 ? options : finalList);
                } else {
                    setData([]);
                }
            } catch (error) {}
        };
        fetchData();
    }, [params, reload, deletePlantbeds]);
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

export default SelectPlantbedsWork;
