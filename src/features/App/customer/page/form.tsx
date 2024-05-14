import SaveButton from '@/components/Button/Save.Button';
import FormComponent from '@/components/FormComponent';
import FormItemComponent from '@/components/FormComponent/FormItemComponent';
// import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ModalComponent from '@/components/ModalComponent';
import Wrapper from '@/features/Auth/Wrapper';
import { rules } from '@/rules';
import { Notification, getRandomInteger, uuid } from '@/utils';
import { Button, Col, Form, Input, Row, Space } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { customerServices } from '../services';
import axios from 'axios';

const apiUrl = 'https://b121-2405-4802-1cae-d580-e0cf-60e4-dc25-b862.ngrok-free.app/api/Customers';

const initialValue = {
    name: '',
    address: '',
    phoneNumber: '',
};

const CustomerForm = ({
    modalVisible,
    handleCloseForm,
    values,
}: {
    modalVisible: boolean;
    handleCloseForm?: any;
    values?: any;
}) => {
    console.log('🚀 ~ values:', values);
    const [form] = Form.useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [datas, setDatas] = React.useState<any>();
    React.useEffect(() => {
        if (values) {
            form.setFieldsValue({
                name: values.name,
                phoneNumber: values.phoneNumber,
                address: values.address,
            });
        }
    }, [values]);
    const formReset = () => {
        form.setFieldsValue(initialValue);
    };

    const handleSubmit = (data: any) => {
        setLoading(true);

        if (values) {
            const dataUpload = {
                ...data,
            };
            axios
                .put(`${apiUrl}/${values?.id}`, dataUpload)
                .then((res) => {
                    if (res.status) {
                        Notification('success', 'Cập nhật khách hàng thành công');
                        handleCloseForm();
                        formReset();
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            const dataUpload = {
                id: getRandomInteger(),
                name: data.name || '',
            };
            axios
                .post(apiUrl, dataUpload)
                .then((res) => {
                    if (res.status) {
                        Notification('success', 'Thêm khách hàng thành công');
                        handleCloseForm();
                        formReset();
                    }
                })
                .finally(() => setLoading(false));
        }
    };

    return (
        <>
            <Wrapper loading={loading}>
                <ModalComponent
                    title={values ? 'Sửa khách hàng' : 'Thêm khách hàng'}
                    modalVisible={modalVisible}
                    width={600}
                >
                    <FormComponent form={form} onSubmit={handleSubmit}>
                        <Row style={{ flexDirection: 'row' }} gutter={[20, 0]}>
                            <FormItemComponent
                                rules={[rules.required('Vui lòng nhập tên khách hàng!')]}
                                name="name"
                                label="Tên khách hàng"
                                normalize={(value: any) => value.trimStart()}
                                inputField={<Input placeholder="Nhập tên khách hàng" />}
                            />

                            <FormItemComponent
                                rules={[rules.required('Vui lòng nhập số điện thoại khách hàng!')]}
                                name="phoneNumber"
                                label="Số điện thoại"
                                normalize={(value: any) => value.trimStart()}
                                inputField={<Input placeholder="Nhập số điện thoại khách hàng" />}
                            />
                            <FormItemComponent
                                rules={[rules.required('Vui lòng nhập địa chỉ khách hàng!')]}
                                name="address"
                                label="Địa chỉ"
                                normalize={(value: any) => value.trimStart()}
                                inputField={
                                    <Input.TextArea style={{ height: 200 }} placeholder="Nhập địa chỉ khách hàng" />
                                }
                            />
                        </Row>
                        <Row style={{ width: '100%' }} justify="end" align="bottom">
                            <Space>
                                <Button
                                    type="default"
                                    onClick={() => {
                                        formReset();
                                        handleCloseForm();
                                    }}
                                >
                                    Thoát
                                </Button>
                                <SaveButton htmlType="submit" />
                            </Space>
                        </Row>
                    </FormComponent>
                </ModalComponent>
            </Wrapper>
        </>
    );
};

const ParentContainer = styled.div`
    .ant-radio-inner::after {
        top: 11px;
        left: 11px;
    }
`;
const ColWeek = styled(Col)`
    padding-bottom: 6px;
`;
export default CustomerForm;
