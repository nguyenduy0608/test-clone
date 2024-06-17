import TopBar from '@/components/TopBar';
import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import Icon, { ShoppingCartOutlined } from '@ant-design/icons';
import Filter from '../components/Filter';
import { homeService } from '../service';
import CardComponent from '@/components/CardComponent';
import { Button, Carousel, Col, Row } from 'antd';
import CateComponent from '../components/CateComponent';
import Container from '@/layout/Container';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const apiUrl = 'http://localhost:5243/api/Products';

const HomePage = () => {
    const [filterQuery, setFilterQuery] = React.useState<any>({});
    const [page, setPage] = React.useState(1);
    const [dataBook, setDataBook] = React.useState<any>();
    const navigator = useNavigate();
    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['products', page, filterQuery, location], () =>
        axios.get(apiUrl, { params: { page, ...filterQuery } })
    );

    const fetchProductsByCategory = async () => {
        try {
            // Tạo một mảng chứa các lời hứa axios với các giá trị category từ 1 đến 5
            const requests = [1, 2, 3, 4, 5].map((category) =>
                axios.get(`http://localhost:5243/api/Products/search-by-category`, {
                    params: { category },
                })
            );

            // Sử dụng Promise.all để chờ tất cả các lời hứa hoàn thành
            const responses = await Promise.all(requests);

            // Map qua các phản hồi để lấy dữ liệu cần thiết
            const products = responses.map((response) => response.data);
            setDataBook(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    React.useEffect(() => {
        fetchProductsByCategory();
    }, []);
    const contentStyle: React.CSSProperties = {
        height: '70vh',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };

    const returnFilter = React.useCallback(
        (filter: any) => {
            setPage(1);
            setFilterQuery({ ...filterQuery, ...filter });
        },
        [filterQuery]
    );
    return (
        <>
            <TopBar
                title={<Filter params={filterQuery} returnFilter={returnFilter} key="filter" />}
                extra={
                    <Button
                        onClick={() => navigator('/cart')}
                        style={{ border: 'none', marginRight: '2vw' }}
                        icon={<ShoppingCartOutlined style={{ fontSize: 32 }} />}
                    ></Button>
                }
            />
            <Container>
                <CardComponent>
                    <div style={{ width: '80%', marginLeft: '10%', height: 'auto' }}>
                        <Carousel autoplay>
                            <div>
                                <h3 style={contentStyle}>
                                    <img
                                        src="https://newshop.vn/public/uploads/news/10-cuon-sach-hay-nhat-ve-khoa-hoc-min-1.jpg"
                                        alt="booktitle"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Sử dụng objectFit để điều chỉnh kích thước của ảnh
                                    />
                                </h3>
                            </div>
                            <div>
                                <h3 style={contentStyle}>
                                    <img
                                        src="https://newshop.vn/public/uploads/news/bat-mi-7-cuon-sach-kham-pha-the-gioi-vu-tru-hay-nhat-min.jpg"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Điều chỉnh kích thước của ảnh
                                    />
                                </h3>
                            </div>
                            <div>
                                <h3 style={contentStyle}>
                                    <img
                                        src="https://static.tramdoc.vn/image/img.news/0/0/0/11806.jpg?v=1&w=300&h=200&nocache=1"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Điều chỉnh kích thước của ảnh
                                    />
                                </h3>
                            </div>
                            <div>
                                <h3 style={contentStyle}>
                                    <img
                                        src="https://uploads.nguoidothi.net.vn/content/271a90aa-3ef4-4b3c-ac28-8f5530f83668.jpg"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Điều chỉnh kích thước của ảnh
                                    />
                                </h3>
                            </div>
                        </Carousel>
                    </div>
                    <CateComponent idBook={0} titleCate="Sách mới" dataCate={data?.data} />
                    <CateComponent idBook={1} titleCate="Sách trinh thám" dataCate={dataBook?.[0]} />
                    <CateComponent idBook={2} titleCate="Sách hành động" dataCate={dataBook?.[1]} />
                    <CateComponent idBook={3} titleCate="Sách kinh dị" dataCate={dataBook?.[2]} />
                    <CateComponent idBook={4} titleCate="Sách tình cảm" dataCate={dataBook?.[3]} />
                    <CateComponent idBook={5} titleCate="Sách hài kịch" dataCate={dataBook?.[4]} />
                    <Footer />
                </CardComponent>
            </Container>
        </>
    );
};

export default HomePage;
export const books = [
    {
        id: 1,
        title: "Harry Potter and the Sorcerer's Stone",
        author: 'J.K. Rowling',
        price: 12.99,
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy54cHAKK49Xth38I6y7EGBQ25vjaLHC6gDA&s',
    },
    {
        id: 2,

        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        price: 9.99,
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy54cHAKK49Xth38I6y7EGBQ25vjaLHC6gDA&s',
    },
    {
        id: 3,

        title: '1984',
        author: 'George Orwell',
        price: 8.49,
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy54cHAKK49Xth38I6y7EGBQ25vjaLHC6gDA&s',
    },
    {
        id: 4,

        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        price: 7.99,
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy54cHAKK49Xth38I6y7EGBQ25vjaLHC6gDA&s',
    },
    {
        id: 5,

        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        price: 6.99,
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy54cHAKK49Xth38I6y7EGBQ25vjaLHC6gDA&s',
    },
];
