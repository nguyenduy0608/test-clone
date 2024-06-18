import CardComponent from '@/components/CardComponent';
import CustomScrollbars from '@/components/CustomScrollbars';
import TopBar from '@/components/TopBar';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import { DeleteOutlined, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { homeService } from '../service';
import React from 'react';
import IconAntd from '@/components/IconAntd';
import styled from 'styled-components';
import Footer from './Footer';
import FormComponent from '@/components/FormComponent';
import FormItemComponent from '@/components/FormComponent/FormItemComponent';
import { rules } from '@/rules';
import SelectComponent from '@/components/SelectComponent';
import SelectDistrictComponent from './SelectDistrict';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const OrderPage = () => {
    const [form] = Form.useForm();
    const location = useLocation();
    const dataCart = location?.state?.data?.data;
    console.log('🚀 ~ OrderPage ~ dataCart:', dataCart);
    const [page, setPage] = React.useState(1);
    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['orders', location], () =>
        axios.get(`http://localhost:5243//api/Cart/getBuyingCartsByUserId`, { params: { userId: 1 } })
    );

    const initialDisplayCount = 3;
    const [displayCount, setDisplayCount] = React.useState(initialDisplayCount);
    const [showAll, setShowAll] = React.useState(false);

    const handleShowMore = () => {
        // Hiển thị tất cả các phần tử
        setShowAll(true);
        setDisplayCount(dataCart.length);
    };

    const handleShowLess = () => {
        // Thu gọn lại hiển thị chỉ 3 phần tử ban đầu
        setShowAll(false);
        setDisplayCount(initialDisplayCount);
    };
    const handleSubmit = () => {};
    return (
        <div
            style={{
                height: 'calc(100% - 0px)',
                flex: 1,
                backgroundColor: '#fff',
            }}
        >
            <CustomScrollbars>
                <div style={{ marginLeft: '10%', fontSize: 24, color: '#0e6', marginTop: '5vh', marginBottom: '2vh' }}>
                    Đặt hàng
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '80%' }}>
                        <Row>
                            <Col span={16}>
                                <strong style={{ fontSize: 16, color: '#0e6' }}>THÔNG TIN ĐƠN HÀNG</strong>
                                <FormComponent form={form} layoutType="vertical" onSubmit={handleSubmit}>
                                    <Row style={{ flexDirection: 'row' }} gutter={[20, 0]}>
                                        <Col span={24}>
                                            <FormItemComponent
                                                label={<b>Họ và tên</b>}
                                                inputField={<Input placeholder="Vui lòng nhập họ tên" />}
                                            />
                                            <FormItemComponent
                                                rules={[
                                                    rules.required('Vui lòng nhập số điện thoại!'),
                                                    rules.validateTitle,
                                                ]}
                                                name="name"
                                                normalize={(value: any) => value.trimStart()}
                                                label={<b>Số điện thoại</b>}
                                                inputField={<Input placeholder="Nhập số điện thoại" />}
                                            />

                                            <FormItemComponent
                                                rules={[rules.validateEmail]}
                                                name="email"
                                                normalize={(value: any) => value.trimStart()}
                                                label="Email"
                                                inputField={<Input autoComplete="off" placeholder="Nhập email" />}
                                            />
                                            <FormItemComponent
                                                rules={['Vui lòng nhập địa chỉ nhận!']}
                                                name="content"
                                                label={<b>Địa chỉ nhận</b>}
                                                inputField={
                                                    <Input.TextArea
                                                        style={{ width: '100%', minHeight: '10vh' }}
                                                        placeholder="Nhập địa chỉ nhận"
                                                    />
                                                }
                                            />
                                            <FormItemComponent
                                                rules={['Vui lòng chọn tỉnh/thành!']}
                                                name="content"
                                                label={<b>Tỉnh/thành</b>}
                                                inputField={<SelectDistrictComponent placeholder="Chọn tỉnh/thành" />}
                                            />
                                            {/* <FormItemComponent
                                                rules={['Vui lòng chọn quận/huyện!']}
                                                name="content"
                                                label={<b>Quận/huyện</b>}
                                                inputField={<SelectComponent apiUrl="" placeholder="Chọn quận/huyện" />}
                                            />
                                            <FormItemComponent
                                                rules={['Vui lòng chọn phường/xã!']}
                                                name="content"
                                                label={<b>Phường/xã</b>}
                                                inputField={<SelectComponent apiUrl="" placeholder="Chọn phường/xã" />}
                                            /> */}
                                            <FormItemComponent
                                                rules={['Vui lòng nhập ghi chú!']}
                                                name="content"
                                                label={<b>Ghi chú</b>}
                                                normalize={(value: any) => value?.trimStart()}
                                                inputField={
                                                    <Input.TextArea
                                                        style={{ minHeight: '150px', whiteSpace: 'pre-wrap' }}
                                                        placeholder="Nhập ghi chú"
                                                    />
                                                }
                                            />
                                            <Row justify="end" align="bottom">
                                                <Button
                                                    style={{ width: '40%', color: '#fff', backgroundColor: '#0e6' }}
                                                >
                                                    Đặt hàng
                                                </Button>
                                            </Row>
                                        </Col>
                                    </Row>
                                </FormComponent>
                            </Col>
                            <Col span={8}>
                                <strong style={{ fontSize: 16, color: '#0e6', borderBottom: '1px solid ' }}>
                                    Chi tiết đơn hàng
                                </strong>
                                <div style={{ backgroundColor: '#f8f8f8', padding: 16, marginTop: 8 }}>
                                    {dataCart?.slice(0, displayCount)?.map((data: any, index: number) => (
                                        <div
                                            key={index}
                                            style={{
                                                marginBottom: 20,
                                                paddingBottom: 8,
                                                borderBottom: '1px solid #e5e5e5',
                                                width: '100%',
                                            }}
                                        >
                                            <p style={{ fontSize: 18 }}>{data?.name || '---'}</p>
                                            <p>Mã SP: {data?.id}</p>
                                            <p>Số lượng: {data?.quantity}</p>
                                            <p>Khối lượng: {data?.weight}</p>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    color: 'red',
                                                    width: '100%',
                                                }}
                                            >
                                                {data?.totalPrice || '---'} đ
                                            </div>
                                        </div>
                                    ))}
                                    {!showAll && dataCart?.length > initialDisplayCount && (
                                        <Button
                                            icon={<CaretDownOutlined />}
                                            style={{
                                                width: '100%',
                                                marginBottom: '2vh',

                                                border: 'none',
                                                backgroundColor: '#0e6',
                                                color: '#fff',
                                            }}
                                            onClick={handleShowMore}
                                        >
                                            Xem thêm
                                        </Button>
                                    )}
                                    {showAll && (
                                        <Button
                                            icon={<CaretUpOutlined />}
                                            style={{
                                                width: '100%',
                                                marginTop: 20,
                                                border: 'none',
                                                marginBottom: '2vh',
                                                backgroundColor: '#0e6',
                                                color: '#fff',
                                            }}
                                            onClick={handleShowLess}
                                        >
                                            Thu gọn
                                        </Button>
                                    )}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-end',
                                            alignItems: 'flex-end', // Để căn chỉnh các phần tử con theo chiều dọc
                                            width: '100%',
                                        }}
                                    >
                                        <p>Tổng tiền : {data?.totalPrice} đ</p>
                                        <p>Phí vận chuyển : {data?.totalPrice} đ</p>
                                        <p>
                                            Thanh toán : <strong>{data?.totalPrice} đ</strong>
                                        </p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Footer />
                    </div>
                </div>
            </CustomScrollbars>
        </div>
    );
};

export default OrderPage;
const ColStyled = styled(Col)`
    text-align: center;
    padding: 0;
`;
