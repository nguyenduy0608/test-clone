import CardComponent from '@/components/CardComponent';
import CustomScrollbars from '@/components/CustomScrollbars';
import TopBar from '@/components/TopBar';
import { Button, Col, InputNumber, Pagination, Row, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { homeService } from '../service';
import React, { useState } from 'react';
import IconAntd from '@/components/IconAntd';
import styled from 'styled-components';
import Footer from './Footer';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { currencyFormat } from '@/utils';
const apiUrl = 'http://localhost:5243/api/Products';

const AllBookPage = () => {
    const [page, setPage] = React.useState(1);
    const { id } = useParams();
    const [filter, setFilter] = useState(0);
    const [dataBook, setDataBook] = useState<any>([]);
    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['books', page, location], () =>
        axios.get(apiUrl, { params: { page } })
    );
    console.log('🚀 ~ AllBookPage ~ data:', data);
    const newData = data?.data;
    const navigate = useNavigate();
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

    const getBooksToDisplay = () => {
        if (id === '0') {
            return data?.data || [];
        }
        if (['1', '2', '3', '4', '5'].includes(id)) {
            return dataBook[parseInt(id) - 1] || [];
        }
        return [];
    };

    const booksToDisplay = getBooksToDisplay();

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
                        <p
                            style={{
                                margin: '2vh 0 2vh 0',
                                fontSize: '20px',
                            }}
                        >
                            <strong>{data?.title || 'Danh sách'}</strong>
                        </p>
                        <Row
                            style={{ backgroundColor: '#f2f2f2', padding: 8, marginBottom: 8 }}
                            justify="end"
                            align="middle"
                        >
                            Xem theo :{' '}
                            {
                                <Select
                                    onChange={(value) => {
                                        setFilter(value);
                                    }}
                                    style={{ width: '40%', marginLeft: 8 }}
                                    placeholder="Chọn cách sắp xếp"
                                >
                                    <Select.Option value={0}>Mới trước cũ sau</Select.Option>
                                    <Select.Option value={1}>Theo tên</Select.Option>
                                </Select>
                            }
                        </Row>
                        <Row gutter={16} justify="center">
                            {filter === 0
                                ? booksToDisplay.map((book: any, index: number) => (
                                      <Col
                                          onClick={() => {
                                              navigate(`/detailbook/${book?.id}`);
                                          }}
                                          key={index}
                                          span={5}
                                      >
                                          <div style={{ textAlign: 'start', padding: '10px', width: '90%' }}>
                                              <img
                                                  src={imageUrls[index]}
                                                  alt={book?.title}
                                                  style={{ marginBottom: 10, width: '100%', height: 'auto' }}
                                              />
                                              <strong style={{ color: '#0c6' }}>{book?.name}</strong>
                                              <p style={{ marginBottom: 4, color: '#0c6' }}>{book?.authorobj?.name}</p>
                                              <b>{currencyFormat(book?.salePrice)} VNĐ</b>
                                          </div>
                                      </Col>
                                  ))
                                : booksToDisplay
                                      .sort((a: any, b: any) => a.name.localeCompare(b.name)) // Sắp xếp mảng theo book.name
                                      .map((book: any, index: number) => (
                                          <Col
                                              onClick={() => {
                                                  navigate(`/detailbook/${book?.id}`);
                                              }}
                                              key={index}
                                              span={5}
                                          >
                                              <div style={{ textAlign: 'start', padding: '10px', width: '90%' }}>
                                                  <img
                                                      src={imageUrls[index]}
                                                      alt={book?.title}
                                                      style={{ marginBottom: 10, width: '100%', height: 'auto' }}
                                                  />
                                                  <strong style={{ color: '#0c6' }}>{book?.name}</strong>
                                                  <p style={{ marginBottom: 4, color: '#0c6' }}>
                                                      {book?.authorobj?.name}
                                                  </p>
                                                  <b>{currencyFormat(book?.salePrice)} VNĐ</b>
                                              </div>
                                          </Col>
                                      ))}
                        </Row>
                        <Row
                            style={{ backgroundColor: '#f2f2f2', padding: 8, marginBottom: 8 }}
                            justify="end"
                            align="middle"
                        >
                            <Pagination
                                style={{ alignContent: 'center' }}
                                size="small"
                                total={50}
                                showSizeChanger
                                showQuickJumper
                            />
                        </Row>
                        <Footer />
                    </div>
                </div>
            </CustomScrollbars>
        </div>
    );
};

export default AllBookPage;

export const imageUrls = [
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/ivancomotkhonghai01.jpg?v=1705552517427',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/nghietduyen01.jpg?v=1705552517103',
    'https://bizweb.dktcdn.net/thumb/large/100/363/455/products/charloteswilbur-100a57c7-a93e-4729-ac47-917a372c4303.jpg?v=1705552516360',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/ba-noi-gangxto-01-61a3b797-f956-4186-9c9b-357080a93c4e.jpg?v=1710322137943',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/cuu-tinh-xu-cat.jpg?v=1711363518887',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/frannyvazooey01e1711678076198.jpg?v=1711678159250',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/bobaphepthuatumbalaanhsanghien.jpg?v=1716343434287',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/bongdembatxichmon01e1717383369.jpg?v=1717383649093',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/396122984367969245656372973796.jpg?v=1705552515697',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/z48398975736586899037cbeab4b8e.jpg?v=1705552513867',
    'https://bizweb.dktcdn.net/thumb/large/100/363/455/products/sua-va-mat-01.jpg?v=1705552513410',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/conchaucuaho25cmscalede1699327.jpg?v=1705552513183',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/z48544142804740f8a0bc6f3898ce3.jpg?v=1705552513040',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/mattroivathep01e1702354533996.jpg?v=1705552509870',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/chienbinhzulue1702624936679.jpg?v=1705552509453',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/moingaydeulagiangsinhe17026249.jpg?v=1705552509227',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/catbuie1705983052885.jpg?v=1705983448807',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/congtumocoie1705983066480.jpg?v=1705983449830',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/phiasaunghicanxnew01-80ba1d6b-9ecf-4695-9dc2-9f7c3d832433.jpg?v=1706084187177',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/ai-biet-dau-ngay-mai-01.jpg?v=1695029467040',
    'https://bizweb.dktcdn.net/thumb/large/100/363/455/products/anmangmuoimotchu01.jpg?v=1705552114100',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/anhchanghobbitnew01.jpg?v=1705552113940',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/catruc01.jpg?v=1705552104620',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/thamtuhoangda01.jpg?v=1705552104153',
    'https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/thienngavadoi01.jpg?v=1705552104730',
];
