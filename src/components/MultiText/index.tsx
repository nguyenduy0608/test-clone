import { uuid } from '@/utils';
import React from 'react';

interface Props {
    record: any;
    maxLength: number;
}

const TextStorage: React.FC<Props> = ({ record, maxLength = 3 }) => {
    const ellipsis = '...'; // Dấu "..."
    const displayedProvinces = record?.storageUser?.slice(0, maxLength); // Lấy 3 phần tử đầu tiên
    const provincesText = displayedProvinces?.map((itemProvince: any) => itemProvince?.storage?.name)?.join(', ');

    const remainingCount = record?.storageUser?.length - maxLength;
    const remainingText = remainingCount > 0 ? `+${remainingCount}` : '';

    return (
        <div key={uuid()} className="ml-2 text-left">
            {provincesText || '-------'}
            {remainingText && `, ${ellipsis}`}
        </div>
    );
};

export default TextStorage;
