import CustomScrollbars from '@/components/CustomScrollbars';
import { PADDING } from '@/config/theme';
import React from 'react';
import styled from 'styled-components';

const Container = ({ children }: { children: React.ReactNode }) => {
    return (
        <ContainerStyled>
            <CustomScrollbars>{children}</CustomScrollbars>
        </ContainerStyled>
    );
};

const ContainerStyled = styled.div`
    padding: ${PADDING};
    height: calc(100% - 68px);
    flex: 1;

    @media (max-width: 768px) {
        height: calc(100% - 68px);
    }
    @media screen and (-webkit-min-device-pixel-ratio: 2) and (max-width: 768px) {
        height: calc(100% - 128px);
    }
`;
export default Container;
