import React from 'react';
import { Row, Col } from 'antd'; // Import các thành phần Row và Col từ Ant Design

const Footer = () => {
    return (
        <div style={{ backgroundColor: '#fff', padding: '20px 0' }}>
            <div style={{ width: '80%', margin: '0 auto' }}>
                {/* Row 1: Mô tả giới thiệu web */}
                <Row justify="start" style={{ marginBottom: '50px' }}>
                    <div style={{ width: '100%', fontSize: 24, marginBottom: 10, borderBottom: '1px solid #364d79' }}>
                        Mua Sách Online Tại Vutrutrithuc.Vn
                    </div>
                    <p style={{ fontSize: 16, lineHeight: '2.5rem' }}>
                        Ra đời từ năm 2011, đến nay <strong>Vutrutrithuc.vn</strong> đã trở thành địa chỉ mua sách
                        online quen thuộc của hàng ngàn độc giả trên cả nước. Với đầu sách phong phú, thuộc các thể
                        loại: Văn học nước ngoài, Văn học trong nước, Kinh tế, Kỹ năng sống, Thiếu nhi, Sách học ngoại
                        ngữ, Sách chuyên ngành,... được cập nhật liên tục từ các nhà xuất bản uy tín trong nước.
                    </p>
                    <p style={{ fontSize: 16, lineHeight: '2.5rem' }}>
                        Ngoài ra, với hình thức <strong>Giao hàng thu tiền tận nơi</strong> và{' '}
                        <strong>Đổi hàng trong vòng 7 ngày</strong> nếu sách có bất kỳ lỗi nào trong quá trình in ấn sẽ
                        giúp Quý khách yên tâm hơn khi mua sắm tại <strong>Vutrutrithuc.vn</strong>
                    </p>
                </Row>

                {/* Row 2: Hỗ trợ khách hàng, Giới thiệu, Tài khoản, Hướng dẫn, Thông tin liên hệ */}
                <Row justify="start">
                    <Col span={5}>
                        <h3>
                            <strong>Hỗ trợ khách hàng</strong>
                        </h3>
                        <p>Câu hỏi thường gặp</p>
                        <p>Liên hệ</p>
                    </Col>
                    <Col span={5}>
                        <h3>
                            <strong>Giới thiệu</strong>
                        </h3>
                        <p>Về chúng tôi</p>
                        <p>Điều khoản sử dụng</p>
                    </Col>
                    <Col span={4}>
                        <h3>
                            <strong> Tài khoản</strong>
                        </h3>
                        <p>Đăng nhập</p>
                        <p>Đăng ký</p>
                    </Col>
                    <Col span={5}>
                        <h3>
                            <strong>Hướng dẫn</strong>
                        </h3>
                        <p>Cách đặt hàng</p>
                        <p>Cách thanh toán</p>
                    </Col>
                    <Col span={5}>
                        <h3>
                            <strong>Thông tin liên hệ</strong>
                        </h3>
                        <p>Địa chỉ: ABC XYZ, Quận 1, TP. HCM</p>
                        <p>Email: contact@example.com</p>
                        <p>Điện thoại: 0123456789</p>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Footer;
