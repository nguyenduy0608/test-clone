import AxiosClient from '@/apis/AxiosClient';
import React from 'react';
import { ALL, MINWIGHT } from '@/config/theme';
import DebounceSelect from '@/components/SelectComponent/DebounceSelect';

function SelectDocument({
    apiUrl,
    params,
    placeholder,
    onChange,
    defaultSelect,
    disabled,
    fieldShow = 'title',
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
                },
            }).then((body) =>
                body?.data
                    .filter((data: any) => data.type === 'guidance') // Lọc chỉ giữ lại các mục có type là 'guidance'
                    .map((data: any) => ({
                        label: fieldShow1 ? `${data[fieldShow]} - ${data[fieldShow1]?.name}` : data[fieldShow],
                        value: data?.id,
                        title: title ? data[title] : '',
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
            onClear={() => {
                // Bắt sự kiện khi người dùng click vào dấu "x" để xóa tất cả
                fetchUserList().then((res) => {
                    return setDefaultOption(res);
                });
            }}
            style={{ width: '100%', minWidth: MINWIGHT }}
        />
    );
}

export default SelectDocument;
