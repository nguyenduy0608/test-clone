import { Button, notification, Row, Space } from 'antd';
import styled from 'styled-components';
import Lottie from 'lottie-react';
import { images } from '@/assets/imagesAssets';

export const notificationSync = (msg: any, title?: string, onClick?: () => void, showDetail = false) =>
    notification['info']({
        message: <div style={{ fontWeight: 'bold', color: '#038fde' }}>{title || ''}</div>,
        description: (
            <div>
                <Row align="middle" justify="space-between" style={{ flexWrap: 'nowrap' }}>
                    <ContentNotiStyled className="gx-mt-2">{msg}</ContentNotiStyled>
                    <NotiContainerStyled>
                        <Lottie style={{ height: '40px' }} animationData={images.bell} />
                    </NotiContainerStyled>
                </Row>
                {showDetail && (
                    <Row justify="end" className="gx-mb-2 gx-mx-2">
                        <Space>
                            <Button type="primary" onClick={onClick}>
                                Xem chi tiết
                            </Button>
                        </Space>
                    </Row>
                )}
            </div>
        ),
        duration: 5,
        placement: 'bottomRight',
        style: {
            padding: '8px 12px 8px 12px ',
        },
    });

const NotiContainerStyled = styled.div`
    width: 50px;
`;

const ContentNotiStyled = styled.div`
    font-size: 14px;
    flex: 1;
    min-height: 3em; /* Chiều cao tối đa tương ứng với 3 dòng */
    overflow: hidden;
    text-overflow: ellipsis; /* Hiển thị dấu '...' khi nội dung bị cắt bớt */
    display: -webkit-box;
    -webkit-line-clamp: 3; /* Số dòng tối đa hiển thị */
    -webkit-box-orient: vertical;
`;
