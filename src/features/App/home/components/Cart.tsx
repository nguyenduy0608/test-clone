import CardComponent from '@/components/CardComponent';
import CustomScrollbars from '@/components/CustomScrollbars';
import TopBar from '@/components/TopBar';
import { Button, Col, InputNumber, Row } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { homeService } from '../service';
import React from 'react';
import IconAntd from '@/components/IconAntd';
import styled from 'styled-components';
import { books } from '../page';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const navigator = useNavigate();
    const [page, setPage] = React.useState(1);
    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['detailbook'], () => homeService.get({ page }));
    return (
        <div
            style={{
                height: 'calc(100% - 0px)',
                flex: 1,
                backgroundColor: '#fff',
            }}
        >
            <CustomScrollbars>
                <div style={{ marginLeft: '10%', fontSize: 24, color: '#0e6', marginTop: '5vh' }}>Giỏ hàng</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '80%' }}>
                        <Row>
                            <Col span={15} style={{ paddingRight: 0 }}>
                                <p
                                    style={{
                                        width: '100%',
                                        fontSize: 16,
                                        fontWeight: 600,
                                        padding: '16px 0px 16px 0',
                                        borderBottom: '1px solid rgba(128, 128, 128, 0.5)',
                                    }}
                                >
                                    Sản phẩm
                                </p>
                            </Col>
                            <ColStyled span={3}>
                                <p
                                    style={{
                                        width: '100%',
                                        fontSize: 16,
                                        padding: '16px 0 16px 0',

                                        fontWeight: 600,
                                        borderBottom: '1px solid rgba(128, 128, 128, 0.5)',
                                    }}
                                >
                                    Số lượng
                                </p>
                            </ColStyled>
                            <ColStyled span={3}>
                                <p
                                    style={{
                                        width: '100%',
                                        fontSize: 16,
                                        fontWeight: 600,
                                        padding: 16,
                                        borderBottom: '1px solid rgba(128, 128, 128, 0.5)',
                                        textAlign: 'center', // Để căn giữa nội dung của <p>
                                    }}
                                >
                                    Thành tiền
                                </p>
                            </ColStyled>
                            <ColStyled span={3}>
                                <p
                                    style={{
                                        width: '100%',
                                        fontSize: 16,
                                        fontWeight: 600,
                                        padding: 16,
                                        borderBottom: '1px solid rgba(128, 128, 128, 0.5)',
                                    }}
                                >
                                    Xóa
                                </p>
                            </ColStyled>
                        </Row>
                        {books?.map((dataCart: any) => (
                            <Row key={dataCart.id}>
                                <Col span={15} style={{ paddingRight: 0 }}>
                                    <Row>
                                        <Col span={4}>
                                            <img
                                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy54cHAKK49Xth38I6y7EGBQ25vjaLHC6gDA&s"
                                                width={100}
                                                height={100}
                                                style={{ objectFit: 'cover' }}
                                                alt="Book Cover"
                                            />
                                        </Col>
                                        <Col span={20}>
                                            <p style={{ fontSize: 16, fontWeight: 600 }}>
                                                {dataCart?.title ||
                                                    'Gia Đình Gãi Ngứa: Tuyển Tập Ký Ức Tuổi Thơ - Vẩn Vơ Hiện Tại'}
                                            </p>
                                            <p style={{ color: 'gray', fontSize: 14 }}>
                                                Mã sản phẩm : {dataCart?.id || '---'}
                                            </p>
                                            <p style={{ fontSize: '18px' }}>
                                                <span style={{ color: '#0c6' }}>{dataCart?.price || '99.000 đ'}</span>{' '}
                                                <span style={{ textDecoration: 'line-through', color: 'gray' }}>
                                                    {dataCart?.voucher || '10.000 đ'}
                                                </span>
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                                <ColStyled span={3}>
                                    <InputNumber defaultValue={1} />
                                </ColStyled>
                                <ColStyled span={3}>
                                    <span style={{ color: '#0c6', textAlign: 'center' }}>
                                        {dataCart?.price || '99.000 đ'}
                                    </span>
                                </ColStyled>
                                <ColStyled span={3}>
                                    <Button onClick={() => {}} icon={<DeleteOutlined />} style={{ border: 'none' }} />
                                </ColStyled>
                            </Row>
                        ))}
                        <Row justify="end">
                            <Col span={10} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <p style={{ fontSize: 20, marginBottom: 16 }}>Tạm tính: {data?.total || 1000000} VNĐ</p>
                                <Button
                                    style={{
                                        backgroundColor: '#0c6',
                                        width: '70%',
                                        color: '#fff',
                                        marginBottom: 8,
                                        marginRight: 0,
                                    }}
                                    onClick={() =>
                                        navigator('/order', {
                                            state: {
                                                data,
                                            },
                                        })
                                    }
                                >
                                    Đặt hàng
                                </Button>
                                <Button style={{ marginBottom: 8, width: '70%' }}>Chọn thêm sản phẩm</Button>
                            </Col>
                        </Row>
                        <Footer />
                    </div>
                </div>
            </CustomScrollbars>
        </div>
    );
};

export default CartPage;
const ColStyled = styled(Col)`
    text-align: center;
    padding: 0;
`;
