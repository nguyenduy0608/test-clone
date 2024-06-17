import CardComponent from '@/components/CardComponent';
import Container from '@/layout/Container';
import { Button, Col, Rate, Row, Select } from 'antd';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { homeService } from '../service';
import CustomScrollbars from '@/components/CustomScrollbars';
import { FaStar } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import Footer from './Footer';
import CateComponent from './CateComponent';
import axios from 'axios';
import { currencyFormat } from '@/utils';
const categoryNames = {
    1: 'Truyện trinh thám',
    2: 'Truyện kinh dị',
    3: 'Truyện hành động',
    4: 'Truyện hài kịch',
    5: 'Truyện tình cảm',
};
const DetailBook = () => {
    const { id } = useParams();
    const [buyingCarts, setBuyingCarts] = useState([]);
    const [idCart, setIdCart] = useState(0);
    const navigator = useNavigate();
    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['products', location], () =>
        axios.get(`http://localhost:5243/api/Products/${id}`, { params: { id } })
    );
    console.log('🚀 ~ DetailBook ~ data:', data);

    const [isStarFilled, setIsStarFilled] = React.useState(false);
    useEffect(() => {
        const fetchBuyingCarts = async () => {
            try {
                const response = await axios.get('http://localhost:5243/api/Cart/getBuyingCartsByUserId?userId=1');
                setBuyingCarts(response.data);
            } catch (error) {
                console.error('Error fetching buying carts:', error);
            }
        };

        fetchBuyingCarts();
    }, []);
    const handleStarClick = () => {
        setIsStarFilled(!isStarFilled); // Đảo ngược trạng thái của isStarFilled
    };
    return (
        <div
            style={{
                height: 'calc(100% - 0px)',
                flex: 1,
            }}
        >
            <CustomScrollbars>
                <div style={{ backgroundColor: '#fff', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '80%' }}>
                        <p
                            style={{
                                margin: '2vh 0 2vh 0',
                                color: '#0c6',
                            }}
                        >{`Vutrutrithuc - Nhà Sách Trên Mạng / ${data?.title}`}</p>
                        <Row>
                            <Col span={6}>
                                <img
                                    width="80%"
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy54cHAKK49Xth38I6y7EGBQ25vjaLHC6gDA&s"
                                />
                            </Col>

                            <Col span={18}>
                                <p style={{ fontSize: 20 }}>
                                    <strong>{data?.data?.name || '---'}</strong>
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'start' }}>
                                    <p style={{ color: '#0c6', marginRight: '2rem' }}>
                                        <strong style={{ color: 'black' }}>Tác Giả :</strong>{' '}
                                        {data?.data?.authorobj?.name || '---'}
                                    </p>
                                    <p style={{ color: '#0c6' }}>
                                        <strong style={{ color: 'black' }}>Phát Hành :</strong>{' '}
                                        {data?.author || 'Nhà xuất bản Kim Đồng'}
                                    </p>
                                </div>
                                <div
                                    onClick={handleStarClick}
                                    style={{
                                        width: '100%',
                                        paddingBottom: '8px',
                                        borderBottom: '1px solid rgba(128, 128, 128, 0.5)',

                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <span>Thêm vào yêu thích</span>
                                    <FaStar
                                        style={{
                                            marginLeft: 5,
                                            color: isStarFilled ? 'gold' : 'gray',
                                            cursor: 'pointer',
                                        }}
                                    />
                                </div>
                                <Row
                                    style={{
                                        borderBottom: '1px solid rgba(128, 128, 128, 0.5)',
                                        paddingBottom: '1rem',
                                        marginBottom: '2rem',
                                    }}
                                >
                                    <Col span={12}>
                                        <h1 style={{ color: '#0c6', marginTop: '1rem' }}>
                                            <strong>{data?.price || '132.000'} VNĐ</strong>
                                        </h1>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <p>Giá bìa: {currencyFormat(data?.data?.salePrice) || '164.000'} VNĐ</p>
                                            <p>Tiết kiệm: {data?.savings || '12.000'} VNĐ</p>
                                        </div>
                                    </Col>
                                    <Col
                                        span={12}
                                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <Select
                                            style={{ padding: '5px 0' }}
                                            onChange={(value) => {
                                                setIdCart(value);
                                            }}
                                            placeholder="Chọn cart"
                                        >
                                            {buyingCarts?.map((cart: any) => {
                                                return <Select.Option key={cart?.id}>{cart?.id}</Select.Option>;
                                            })}
                                        </Select>
                                        <Button
                                            style={{
                                                backgroundColor: '#0c6',
                                                color: 'white',
                                                marginLeft: 8,
                                                width: '50%',
                                                height: '40px',
                                            }}
                                            onClick={async () => {
                                                const res = await axios.put(
                                                    'http://localhost:5243/api/Cart/add-product-to-cart',
                                                    null, // Không cần payload trong thân yêu cầu
                                                    {
                                                        params: {
                                                            cartId: idCart,
                                                            productId: id,
                                                        },
                                                    }
                                                );
                                                if (res?.status) {
                                                    navigator('/cart');
                                                }
                                            }}
                                        >
                                            Đặt hàng
                                        </Button>
                                    </Col>
                                </Row>
                                <div>
                                    <p>
                                        <strong>Bọc Plastic theo yêu cầu</strong>
                                    </p>
                                    <p>Giao hàng miễn phí trong nội thành TP. HCM với đơn hàng từ 200.000 đ trở lên.</p>
                                    <p>Giao hàng miễn phí toàn quốc với đơn hàng từ 350.000 đ trở lên.</p>
                                </div>
                            </Col>
                        </Row>
                        <p
                            style={{
                                padding: '20px 0 8px 0',
                                fontSize: 20,
                                width: '100%',
                                borderBottom: '1px solid rgba(128, 128, 128, 0.5)',
                            }}
                        >
                            Giới thiệu sách
                        </p>
                        <div>
                            <p>
                                <strong>Tên sách:</strong>
                                {data?.data?.name}
                            </p>
                            <p>
                                <strong>Tác giả:</strong>
                                {data?.data?.authorobj?.name}
                            </p>
                            <p>
                                <strong>Dịch giả:</strong> Đom Đóm
                            </p>
                            <p>
                                <strong>Thể loại:</strong> {categoryNames?.[Number(data?.data?.category)]}
                            </p>
                            <p>
                                <strong>Khổ sách:</strong> 14,5 x 20,5 cm
                            </p>
                            <p>
                                <strong>Số trang:</strong> 168
                            </p>
                            <p>
                                <strong>Loại bìa:</strong> bìa mềm
                            </p>
                            <p>
                                <strong>ISBN:</strong> 9786044748696
                            </p>
                            <p>
                                <strong>Đơn vị phát hành:</strong> Công ty TNHH Văn Hóa & Truyền thông Thảo Nguyên –
                                Thương hiệu: KISEKI STUDIO
                            </p>

                            <p>
                                <strong>Sách chia thành 2 phiên bản:</strong>
                            </p>
                            <ul>
                                <li>
                                    <strong>Bản thường:</strong> giá bìa 165.000 VNĐ - Mã code: 8938536458540
                                </li>
                            </ul>

                            <p>
                                <strong>Gồm:</strong>
                            </p>
                            <ul>
                                <li>Sách bìa mềm tay gập</li>
                                <li>1 bookmark trái tim ivory (kẹp trong sách)</li>
                                <li>1 móc khóa chibi tráng gương (quà để rời bên ngoài)</li>
                            </ul>

                            <p>
                                <strong>Lưu ý:</strong> Quà tặng chỉ có ở lượt in đầu
                            </p>
                        </div>
                        <Row justify="center">
                            <Button
                                onClick={() => navigator('/cart')}
                                style={{
                                    backgroundColor: '#0c6',
                                    color: 'white',
                                    marginTop: '1rem',
                                    marginBottom: '1rem',
                                    width: '40%',
                                    height: '50px',
                                }}
                            >
                                Mua
                            </Button>
                        </Row>
                        <CateComponent idBook={4} titleCate="Sách cùng tác giả" dataCate={[]} />
                        <Footer />
                    </div>
                </div>
            </CustomScrollbars>
        </div>
    );
};
export default DetailBook;
