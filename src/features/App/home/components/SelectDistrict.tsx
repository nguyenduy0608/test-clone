import AxiosClient from '@/apis/AxiosClient';
import React from 'react';
import { ALL, MINWIGHT } from '@/config/theme';
import DebounceSelect from '@/components/SelectComponent/DebounceSelect';
import axios, { Axios } from 'axios';

function SelectDistrictComponent({
    params,
    placeholder,
    onChange,
    defaultSelect,
    disabled,
    fieldShow = 'name',
    fieldShow1 = '',
    title = '',
    value,
    onClear,
    mode,
    check,
}: {
    params?: any;
    placeholder: string;
    onChange?: (id: any, defaultOption?: any) => void;
    onClear?: any;
    defaultSelect?: any;
    disabled?: boolean;
    fieldShow?: string;
    fieldShow1?: string;
    value?: any;
    title?: any;
    mode?: any;
    check?: boolean;
}) {
    const [defaultOption, setDefaultOption] = React.useState<any>([]);

    const fetchUserList = React.useCallback(
        async (search?: string) => {
            try {
                const response = await axios.get(
                    'https://api-tinh-thanh-quan-huyen-xa-phuong-viet-nam.p.rapidapi.com/provinces'
                );
                return response?.data?.map((data: any) => ({
                    label: fieldShow1 ? `${data[fieldShow]} - ${data[fieldShow1]?.name}` : data[fieldShow],
                    value: data?.id,
                    title: title ? data[title] : '',
                    data: data,
                    // ...data,
                }));
            } catch (error) {
                console.error('Error fetching user list:', error);
                return []; // Return empty array in case of error
            }
        },
        [params, fieldShow, disabled]
    );
    React.useEffect(() => {
        // if (disabled) return;
        fetchUserList().then((res) => {
            return setDefaultOption(res);
        });
    }, [disabled, params]);
    return (
        <DebounceSelect
            disabled={disabled}
            placeholder={placeholder}
            defaultOption={defaultOption}
            allowClear={true}
            value={value || undefined}
            fetchOptions={fetchUserList}
            onChange={(newValue, defaultOption) => {
                onChange && onChange(newValue ? newValue : undefined, defaultOption);
            }}
            mode={mode}
            onClear={onClear}
            style={{ width: '100%' }}
        />
    );
}

export default SelectDistrictComponent;
