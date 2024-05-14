import { Modal, Spin } from 'antd';
import React, { CSSProperties } from 'react';
import styled from 'styled-components';
interface IProps {
    title: string;
    modalVisible: boolean;
    children: React.ReactNode;
    width?: number;
    bodyStyle?: CSSProperties;
    loading?: boolean;
    closeIcon?: any;
}

const ModalComponent: React.FC<IProps> = ({
    title,
    modalVisible,
    loading = false,
    children,
    bodyStyle,
    width = 600,
    closeIcon,
}) => {
    return (
        <ModalStyled
            width={width}
            destroyOnClose
            maskClosable={false}
            closable={false}
            footer={null}
            bodyStyle={bodyStyle}
            title={title}
            open={modalVisible}
            centered
            closeIcon={closeIcon}
        >
            <Spin spinning={loading}>{children}</Spin>
        </ModalStyled>
    );
};

const ModalStyled = styled(Modal)`
    & .ant-modal-title {
        text-align: center;
        font-weight: 700;
        font-size: 18px;
    }
`;

export default ModalComponent;
