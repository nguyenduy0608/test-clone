import { COLOR, GREEN } from '@/config/theme';
import { Button } from 'antd';
import React from 'react';
import IconAntd from '../IconAntd';

const PrintButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <Button
            icon={<IconAntd icon="PrinterOutlined" size="18px" />}
            key="btn_export"
            className="gx-mb-0"
            onClick={onClick}
            style={{ backgroundColor: GREEN, color: COLOR }}
        >
            In hoá đơn
        </Button>
    );
};

export default PrintButton;
