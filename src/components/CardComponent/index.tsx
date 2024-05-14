import { BOX_SHADOW, RADIUS } from '@/config/theme';
import { Card } from 'antd';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

const CardComponent = ({
    title,
    extra,
    children,
    bodyStyle,
}: {
    title?: string | ReactNode;
    extra?: ReactNode;
    children?: ReactNode;
    bodyStyle?: React.CSSProperties;
}) => {
    return (
        <CardStyled bodyStyle={{ ...bodyStyle }} title={title} extra={extra}>
            {children}
        </CardStyled>
    );
};

const CardStyled = styled(Card)`
    border-radius: 0px;
    box-shadow: ${BOX_SHADOW};
    margin-bottom: 10px;
    & .ant-card-head-wrapper {
        padding: 0 10px;
    }
    /* & .ant-card-extra {
        width: 100%;
    } */
`;

export default React.memo(CardComponent);
