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
                    <CateComponent link={books1} idBook={0} titleCate="Sách mới" dataCate={data?.data} />
                    <CateComponent link={books2} idBook={1} titleCate="Sách trinh thám" dataCate={dataBook?.[0]} />
                    <CateComponent idBook={2} link={books3} titleCate="Sách hành động" dataCate={dataBook?.[1]} />
                    <CateComponent idBook={3} link={books4} titleCate="Sách kinh dị" dataCate={dataBook?.[2]} />
                    <CateComponent idBook={4} link={books5} titleCate="Sách tình cảm" dataCate={dataBook?.[3]} />
                    <CateComponent idBook={5} link={books1} titleCate="Sách hài kịch" dataCate={dataBook?.[4]} />
                    <Footer />
                </CardComponent>
            </Container>
        </>
    );
};

export default HomePage;
const books1 = [
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/ivancomotkhonghai01.jpg?v=1705552517427',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/nghietduyen01.jpg?v=1705552517103',
    'https://bizweb.dktcdn.net/thumb/large/100/363/455/products/charloteswilbur-100a57c7-a93e-4729-ac47-917a372c4303.jpg?v=1705552516360',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/ba-noi-gangxto-01-61a3b797-f956-4186-9c9b-357080a93c4e.jpg?v=1710322137943',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/cuu-tinh-xu-cat.jpg?v=1711363518887',
];

// Mảng 2 - Books 2
const books2 = [
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/frannyvazooey01e1711678076198.jpg?v=1711678159250',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/bobaphepthuatumbalaanhsanghien.jpg?v=1716343434287',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/bongdembatxichmon01e1717383369.jpg?v=1717383649093',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/396122984367969245656372973796.jpg?v=1705552515697',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/z48398975736586899037cbeab4b8e.jpg?v=1705552513867',
];

// Mảng 3 - Books 3
const books3 = [
    'https://bizweb.dktcdn.net/thumb/large/100/363/455/products/sua-va-mat-01.jpg?v=1705552513410',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/conchaucuaho25cmscalede1699327.jpg?v=1705552513183',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/z48544142804740f8a0bc6f3898ce3.jpg?v=1705552513040',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/mattroivathep01e1702354533996.jpg?v=1705552509870',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/chienbinhzulue1702624936679.jpg?v=1705552509453',
];

// Mảng 4 - Books 4
const books4 = [
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/moingaydeulagiangsinhe17026249.jpg?v=1705552509227',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/catbuie1705983052885.jpg?v=1705983448807',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/congtumocoie1705983066480.jpg?v=1705983449830',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/phiasaunghicanxnew01-80ba1d6b-9ecf-4695-9dc2-9f7c3d832433.jpg?v=1706084187177',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/ai-biet-dau-ngay-mai-01.jpg?v=1695029467040',
];

// Mảng 5 - Books 5
const books5 = [
    'https://bizweb.dktcdn.net/thumb/large/100/363/455/products/anmangmuoimotchu01.jpg?v=1705552114100',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/anhchanghobbitnew01.jpg?v=1705552113940',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/catruc01.jpg?v=1705552104620',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/thamtuhoangda01.jpg?v=1705552104153',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/thienngavadoi01.jpg?v=1705552104730',
];
