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
import SelectComponent from '@/components/SelectComponent';
import SelectAuthorComponent from '../../product/components/SelectAuthor';

const apiUrl = 'http://localhost:5243/api/Customers';

const initialValue = {
    name: '',
    address: '',
    phoneNumber: '',
};

const BuyForm = ({
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

    const formReset = () => {
        form.setFieldsValue(initialValue);
    };

    const handleSubmit = (data: any) => {
        setLoading(true);

        const dataUpload = {
            ...data,
        };
        console.log('🚀 ~ handleSubmit ~ dataUpload:', dataUpload);
        axios
            .put(
                `http://localhost:5243/api/Cart/add-product-to-cart?cartId=${dataUpload?.name?.value}&productId=${dataUpload?.phoneNumber?.value}`
            )
            .then((res) => {
                Notification('success', 'Mua sản phẩm thành công');
                handleCloseForm();
                formReset();
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <Wrapper loading={loading}>
                <ModalComponent title={'Thêm khách hàng'} modalVisible={modalVisible} width={600}>
                    <FormComponent form={form} onSubmit={handleSubmit}>
                        <Row style={{ flexDirection: 'row' }} gutter={[20, 0]}>
                            <FormItemComponent
                                rules={[rules.required('Vui lòng nhập tên khách hàng!')]}
                                name="name"
                                label="Giỏ hàng"
                                inputField={
                                    <SelectAuthorComponent
                                        apiUrl={`http://localhost:5243/api/Cart/user/${values?.id}`}
                                        placeholder="Chọn"
                                    />
                                }
                            />

                            <FormItemComponent
                                rules={[rules.required('Vui lòng nhập số điện thoại khách hàng!')]}
                                name="phoneNumber"
                                label="Sản phẩm"
                                inputField={
                                    <SelectAuthorComponent
                                        apiUrl={`http://localhost:5243/api/Products`}
                                        placeholder="Chọn"
                                    />
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
export default BuyForm;
