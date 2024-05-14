import useDebounce from '@/hooks/useDebounce';
import { Input } from 'antd';
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const SearchInputWord = ({
    placeholderSearch,
    onChangeSearch,
    style,
    defaultValue,
    value,
    setSearchValue,
    setIsNameWork,
}: {
    placeholderSearch: string;
    onChangeSearch: (search: string) => void;
    style?: React.CSSProperties;
    defaultValue?: any;
    value?: any;
    setSearchValue?: any;
    setIsNameWork?: any;
}) => {
    const debouncedSearchTerm = useDebounce(value, 300);

    React.useEffect(() => {
        // if (!debouncedSearchTerm) return;
        onChangeSearch && onChangeSearch(debouncedSearchTerm);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm]);

    return (
        <InputStyled
            defaultValue={defaultValue}
            value={value}
            style={style}
            onChange={(e: any) => {
                setIsNameWork('');
                setSearchValue(e.target.value || '');
            }}
            placeholder={placeholderSearch}
            prefix={<SearchOutlined />}
            allowClear
        />
    );
};
const InputStyled = styled(Input)`
    min-width: 285px;
`;

export default SearchInputWord;
