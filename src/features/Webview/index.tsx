import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import FormComponent from '@/components/FormComponent';
import { errorValidPhone } from '@/utils/validation';
import { Button, Form, Input, Space } from 'antd';
import FormItemComponent from '@/components/FormComponent/FormItemComponent';
import styled from 'styled-components';
import Wrapper from '../Auth/Wrapper';
import { rules } from '@/rules';
import { removeAccount } from './service';
import { Notification } from '@/utils';
interface IParam {
    productId: string;
    userId: string;
}
const RedirectToApp = () => {
    const [loading, setLoading] = React.useState(false);
    const [form] = Form.useForm();
    const onHandleSubmit = async (data: any) => {
        setLoading(true)
        const dataUpload = {phoneNumber: data?.phoneNumber?.toString(), password: data?.password?.toString()}
        await removeAccount.remove(dataUpload).then((res) => {
            if(res.status) {
                Notification('success', 'Xóa tài khoản thành công');
                form.resetFields();
            }
        }).finally(() => setLoading(false))
    };
    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <div className="gx-app-login-wrap">
                <div className="gx-app-login-container">
                    <Wrapper loading={loading}>
                        <BlockStyle>
                        <FormComponent form={form} onSubmit={onHandleSubmit}>
                                <FormItemComponent
                                    label="Tên đăng nhập"
                                    name="phoneNumber"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tên tài khoản!' },
                                        errorValidPhone,
                                    ]}
                                    inputField={<Input placeholder="Nhập tài khoản" />}
                                />
                                <FormItemComponent
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                                    inputField={<Input.Password placeholder="Nhập mật khẩu" />}
                                />

                                {/* <Form.Item
                                        className="gx-mb-1"
                                        name="password"
                                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                                    >
                                        <Input.Password type="password" placeholder="Nhập mật khẩu" />
                                    </Form.Item> */}

                                <Space style={{display: 'flex', justifyContent: 'center'}}>
                                <Button type="primary" htmlType="submit" className="gx-mb-0">
                                    Xóa tài khoản
                                </Button>
                                </Space>
                            </FormComponent>
                        </BlockStyle>
                    </Wrapper>
                </div>
            </div>
        </div>
    );
};
export default RedirectToApp;
const BlockStyle = styled.div`
    max-width: 820px;
    margin: 0 auto;
    background-color: white;
    border-radius: 10px;
    padding: 10px;
`;
const FormPassWord = styled(Form.Item)`
    & .ant-form-item-control-input-content {
        display: flex;
        justify-content: end;
    }
    & ant-input-affix-wrapper ant-input-password ant-input-affix-wrapper-has-feedback {
        width: 86%;
    }
`;
