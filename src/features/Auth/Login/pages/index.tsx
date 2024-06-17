import LocalStorage from '@/apis/LocalStorage';
import { Notification, wait } from '@/utils';
import { errorValidPhone } from '@/utils/validation';
import { Button, Form, Input } from 'antd';
import React from 'react';
import styled from 'styled-components';
import Wrapper from '../../Wrapper';
import { authService } from '../../service';
import InfoLogin from '../components/InfoLogin';

const LoginPage = () => {
    const [loading, setLoading] = React.useState(false);
    const [form] = Form.useForm();

    const handleSubmit = async (value: { phone_number: string; password: string }) => {
        setLoading(true);

        if (value.phone_number === '0987654321') {
            LocalStorage.setToken('admin');
        } else {
            LocalStorage.setToken('customer');
        }

        Notification('success', 'Đăng nhập thành công');

        wait(1500).then(() => {
            window.location.reload();
            setLoading(false);
        });
    };
    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <div className="gx-app-login-wrap">
                <BlockStyle>
                    <Wrapper loading={loading}>
                        <div className="gx-app-login-main-content">
                            <InfoLogin />
                            <div className="gx-app-login-content">
                                <Form form={form} onFinish={handleSubmit} className="gx-signin-form gx-form-row">
                                    <Form.Item
                                        name="phone_number"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập tài khoản!' },
                                            errorValidPhone,
                                        ]}
                                    >
                                        <Input placeholder="Nhập tài khoản" />
                                    </Form.Item>
                                    <Form.Item
                                        className="gx-mb-1"
                                        name="password"
                                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                                    >
                                        <Input.Password type="password" placeholder="Nhập mật khẩu" />
                                    </Form.Item>

                                    <Form.Item className="gx-mt-4 gx-d-flex gx-justify-content-end">
                                        <Button type="primary" htmlType="submit" className="gx-mb-0">
                                            Đăng nhập
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    </Wrapper>
                </BlockStyle>
            </div>
        </div>
    );
};
const BlockStyle = styled.div`
    max-width: 820px;
    margin: 0 auto;
`;
export default LoginPage;
