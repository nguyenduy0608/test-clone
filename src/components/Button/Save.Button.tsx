import { images } from '@/assets/imagesAssets';
import { BACKGROUND, COLOR } from '@/config/theme';
import { Button } from 'antd';
import { ButtonHTMLType } from 'antd/lib/button/button';
import Lottie from 'lottie-react';
import IconAntd from '../IconAntd';

const SaveButton = ({
    onClick,
    htmlType = 'button',
    disabled,
}: {
    onClick?: () => void;
    htmlType?: ButtonHTMLType;
    disabled?: boolean;
}) => {
    return (
        <Button
            htmlType={htmlType}
            disabled={disabled}
            className="gx-mb-0"
            type="primary"
            onClick={onClick && onClick}
            style={{ display: 'flex', alignItems: 'center' }}
            icon={<IconAntd icon="SaveOutlined" />}
        >
            Lưu
        </Button>
    );
};

export default SaveButton;
