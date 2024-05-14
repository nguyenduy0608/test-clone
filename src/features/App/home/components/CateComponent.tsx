import { Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';

const CateComponent = ({
    titleCate,
    idBook,
    dataCate,
}: {
    titleCate?: string;
    idBook?: number | string;
    dataCate?: any;
}) => {
    const navigate = useNavigate();
    const truncateText = (text: string, maxLines: number) => {
        // Nếu text có nhiều hơn maxLines dòng, thêm dấu ... vào cuối
        const div = document.createElement('div');
        div.innerHTML = text;
        div.style.display = '-webkit-box';
        div.style.overflow = 'hidden';
        div.style.textOverflow = 'ellipsis';
        div.style.webkitLineClamp = `${maxLines}`;

        return div.innerHTML;
    };
    return (
        <>
            <Row justify="space-between" align="middle" style={{ backgroundColor: '#f2f2f2' }}>
                <div
                    style={{
                        backgroundColor: '#0c6',
                        color: '#fff',
                        fontSize: '24px',
                        padding: '0.5rem 3rem 0.5rem 1rem',
                        borderRadius: '0 200px 200px 0',
                    }}
                >
                    {titleCate}
                </div>
                <Col onClick={() => navigate(`/allbook/${idBook}`)}>
                    <span style={{ padding: '0 1rem' }}>Xem tất cả</span>
                </Col>
            </Row>
            <Row gutter={16} justify="center">
                {dataCate?.map((book: any, index: number) => (
                    <Col
                        onClick={() => {
                            navigate(`/detailbook/${book?.id}`);
                        }}
                        key={index}
                        span={4}
                    >
                        <div style={{ textAlign: 'start', padding: '10px' }}>
                            <img
                                src={book?.imageUrl}
                                alt={book?.title}
                                style={{ marginBottom: 10, width: '100%', height: 'auto' }}
                            />
                            <strong style={{ color: '#0c6' }}>{truncateText(book?.title, 2)}</strong>
                            <p style={{ marginBottom: 4, color: '#0c6' }}>{book?.author}</p>
                            <b>{book?.price.toFixed(2)} VNĐ</b>
                        </div>
                    </Col>
                ))}
            </Row>
        </>
    );
};
export default CateComponent;
