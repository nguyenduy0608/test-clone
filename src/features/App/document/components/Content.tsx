import { Col, Row, Space } from 'antd';
import React from 'react';
import styled from 'styled-components';
import NewsEditor from '../components/Editor';
const Content = ({
    image,
    disabled,
    handleCallbackContent,
    refContent,
    title,
}: {
    image: string;
    disabled?: boolean;
    handleCallbackContent: any;
    refContent?: string;
    title?: string;
}) => {
    const [content, setContent] = React.useState('');
    React.useEffect(() => {
        setContent(refContent || '');
    }, [refContent]);
    return (
        <Row style={{ flexDirection: 'row', flexWrap: 'nowrap', width: '100%', margin: 0 }}>
            <Col style={{ flex: 1 }}>
                <NewsEditor
                    disabled={disabled}
                    handleCallbackContent={handleCallbackContent}
                    handleCallbackContentNotDebounce={(value: string) => {
                        setContent(value);
                    }}
                    refContent={refContent}
                />
            </Col>
        </Row>
    );
};

const StatusbarStyled = styled.div`
    background-color: #fff;
    & * {
        color: black !important;
        font-weight: bold !important;
    }
`;

const TitleStyled = styled.div`
    font-size: 15px;
    background-color: #fff;
    padding: 10px 12px;
    font-weight: 600;
    color: black;
`;

export default React.memo(Content);
