import AxiosClient from '@/apis/AxiosClient';
import React from 'react';
import DebounceSelect from './DebounceSelect';
import { ALL, MINWIGHT } from '@/config/theme';

function SelectComponent({
    apiUrl,
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
    apiUrl: string;
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
            return AxiosClient(`${apiUrl}`, {
                params: {
                    ...params,
                    search,
                    limit: ALL,
                    sortBy: 'created_at',
                    sortOrder: 'desc',
                },
            }).then((body) =>
                body?.data?.map((data: any) => ({
                    label: fieldShow1 ? `${data[fieldShow]} - ${data[fieldShow1]?.name}` : data[fieldShow],
                    value: data?.id,
                    title: title ? data[title] : '',
                    data: data,
                    // ...data,
                }))
            );
        },
        [apiUrl, params, fieldShow, disabled]
    );
    React.useEffect(() => {
        // if (disabled) return;
        fetchUserList().then((res) => {
            return setDefaultOption(res);
        });
    }, [disabled, params, apiUrl]);
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

export default SelectComponent;
