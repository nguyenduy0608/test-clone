import IconAntd from '@/components/IconAntd';
import { TAB_SIZE } from '@/config/theme';
import useWindowSize from '@/hooks/useWindowSize';
import { Button, Col, Drawer, Row } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ChatArea from './ChatArea';
import EmptyChatArea from './EmptyChatArea';

export const StyledContainer = styled.div`
    position: relative;
    width: 99%;
    height: 100%;
    max-width: 1600px;
    margin-right: auto;
    margin-left: auto;
    overflow: hidden;
`;

type Props = {
    filterComponent: any;
    setIsStartNewTopic?: any;
    contentComponent?: any;
    headerComponent: any;
    emptyContentComponent: any;
    footerComponent?: any;
};

const Container = ({ filterComponent, setIsStartNewTopic }: Props) => {
    const id = useParams();
    const { width } = useWindowSize();
    const [open, setOpen] = React.useState(false);
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };
    React.useEffect(() => {
        setOpen(true);
    }, [id?.id]);
    return (
        <StyledContainer>
            <Row
                justify="center"
                style={
                    width <= TAB_SIZE
                        ? { width: '100%', height: '100%', margin: 0 }
                        : {
                              width: '100%',
                              height: 'calc(100% - 8px)',
                              backgroundColor: '#dddddd',
                              position: 'absolute',
                              top: '50%',
                              left: '51%',
                              transform: 'translate(-50%, -50%)',
                          }
                }
            >
                <Col
                    style={{
                        backgroundColor: 'white',
                        paddingLeft: 12,
                        height: '100%',
                        paddingRight: 8,
                    }}
                    span={24}
                    lg={6}
                    md={6}
                    xs={width <= TAB_SIZE ? 24 : 4}
                >
                    {typeof filterComponent === 'function' ? filterComponent() : filterComponent}
                </Col>
                {width <= TAB_SIZE ? (
                    <Col
                        span={24}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginLeft: '25px',
                        }}
                    >
                        <strong>Tìm kiếm vườn</strong>
                        <Button type="link" onClick={showDrawer}>
                            <IconAntd icon={'SearchOutlined'} />
                        </Button>
                    </Col>
                ) : (
                    <Col
                        style={{
                            backgroundColor: 'white',
                            height: '100%',
                            padding: 1,
                            boxShadow: '5px 0 15px rgba(0, 0, 0, 0.3)',
                        }}
                        lg={width <= TAB_SIZE ? 24 : 18}
                        md={width <= TAB_SIZE ? 24 : 18}
                        xs={width <= TAB_SIZE ? 24 : 20}
                    >
                        {id?.id ? <ChatArea setIsStartNewTopic={setIsStartNewTopic} /> : <EmptyChatArea />}
                    </Col>
                )}
            </Row>
            {width <= TAB_SIZE && !!id.id ? (
                <DrawerStyled
                    style={{ width: '100%', overflow: 'hidden' }}
                    // title="Basic Drawer"
                    onClose={onClose}
                    open={open}
                    size="large"
                >
                    {id?.id ? <ChatArea setIsStartNewTopic={setIsStartNewTopic} /> : <EmptyChatArea />}
                </DrawerStyled>
            ) : (
                <></>
            )}
        </StyledContainer>
    );
};

export default Container;

const DrawerStyled = styled(Drawer)`
    & .ant-drawer-body {
        overflow: hidden;
    }
    & .ant-drawer-content-wrapper {
        width: 100% !important;
    }
`;
