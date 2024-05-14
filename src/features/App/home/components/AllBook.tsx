import CardComponent from '@/components/CardComponent';
import CustomScrollbars from '@/components/CustomScrollbars';
import TopBar from '@/components/TopBar';
import { Button, Col, InputNumber, Pagination, Row, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { homeService } from '../service';
import React from 'react';
import IconAntd from '@/components/IconAntd';
import styled from 'styled-components';
import { books } from '../page';
import Footer from './Footer';
import { useNavigate, useParams } from 'react-router-dom';

const AllBookPage = () => {
    const [page, setPage] = React.useState(1);
    const { id } = useParams();
    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['detailbook'], () => homeService.get({ page }));
    console.log('🚀 ~ AllBookPage ~ data:', data);
    const navigate = useNavigate();
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
                                <Select style={{ width: '40%', marginLeft: 8 }} placeholder="Chọn cách sắp xếp">
                                    <Select.Option value={0}>Mới trước cũ sau</Select.Option>
                                </Select>
                            }
                        </Row>
                        <Row gutter={16} justify="center">
                            {dataDemo?.map((book: any, index: number) => (
                                <Col
                                    onClick={() => {
                                        navigate(`/detailbook/${book?.id}`);
                                    }}
                                    key={index}
                                    span={5}
                                >
                                    <div style={{ textAlign: 'start', padding: '10px', width: '90%' }}>
                                        <img
                                            src={book?.imageUrl}
                                            alt={book?.title}
                                            style={{ marginBottom: 10, width: '100%', height: 'auto' }}
                                        />
                                        <strong style={{ color: '#0c6' }}>{book?.title}</strong>
                                        <p style={{ marginBottom: 4, color: '#0c6' }}>{book?.author}</p>
                                        <b>{book?.price} VNĐ</b>
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
export const dataDemo = [
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
