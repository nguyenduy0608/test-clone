import { BACKGROUND, COLOR, GREEN } from '@/config/theme';
import { Button } from 'antd';
import React from 'react';
import IconAntd from '../IconAntd';

const ActiveButton = ({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) => {
    return (
        <Button
            type="text"
            className="gx-mb-0"
            style={{
                fontSize: '16px',
                color: `${COLOR}`,
                background: `#038fde`,
            }}
            onClick={onClick}
            disabled={disabled}
        >
            <IconAntd icon="CheckCircleOutlined" />
            Bật hoạt động
        </Button>
    );
};

export default React.memo(ActiveButton);
