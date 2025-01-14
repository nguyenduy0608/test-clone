import { Select, Spin } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import debounce from '../lodash/lodash_debounce';
import type { SelectProps } from 'antd/es/select';
import { uuid } from '@/utils';

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>;
    debounceTimeout?: number;
    defaultOption?: any;
    value?: any;
}

function DebounceSelect<
    ValueType extends { key?: string; label: React.ReactNode; value: any; name?: string; phoneNumber?: string } = any
>({ fetchOptions, debounceTimeout = 500, defaultOption, value, ...props }: DebounceSelectProps<any>) {
    const [options, setOptions] = useState<ValueType[]>(defaultOption);
    const fetchRef = useRef(0);
    React.useEffect(() => {
        setOptions(defaultOption);
    }, [defaultOption]);
    const debounceFetcher = useMemo(() => {
        const loadOptions = (value: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);

            fetchOptions(value).then((newOptions) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }

                setOptions(newOptions);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);
    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher as any}
            notFoundContent={<>Không có dữ liệu</>}
            showSearch
            value={value}
            {...props}
            options={props?.mode === 'multiple' ? [...options] : [...options]}
        />
    );
}

export default React.memo(DebounceSelect);
