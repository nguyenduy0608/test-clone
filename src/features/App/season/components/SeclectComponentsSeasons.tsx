import AxiosClient from '@/apis/AxiosClient';
import React from 'react';
import { ALL, MINWIGHT } from '@/config/theme';
import DebounceSelect from '@/components/SelectComponent/DebounceSelect';
import { TYPE_FLOWER } from '@/contants';

function SelectComponentSeasons({
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
    mode,
    check,
}: {
    apiUrl: string;
    params?: any;
    placeholder: string;
    onChange?: (id: any, defaultOption?: any) => void;
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
                body?.data?.map((data: any) => {
                    let flower;
                    data[title] === TYPE_FLOWER.GROWN_MANY_TIMES
                        ? (flower = 'Cây nhiều lần')
                        : data[title] === TYPE_FLOWER.GROW_ONE
                        ? (flower = 'Cây 1 lần')
                        : (flower = 'Cây lâu năm');
                    return {
                        label: fieldShow1 ? `${data[fieldShow]} - ${data[fieldShow1]?.name}` : data[fieldShow],
                        value: data?.id,
                        title: title ? flower : '',
                        data: data,
                        // ...data,
                    };
                })
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
            onClear={() => {
                // Bắt sự kiện khi người dùng click vào dấu "x" để xóa tất cả
                fetchUserList().then((res) => {
                    return setDefaultOption(res);
                });
            }}
            style={{ width: '100%' }}
        />
    );
}

export default SelectComponentSeasons;
