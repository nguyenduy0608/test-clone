import SaveButton from '@/components/Button/Save.Button';
import FormComponent from '@/components/FormComponent';
import FormItemComponent from '@/components/FormComponent/FormItemComponent';
// import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ModalComponent from '@/components/ModalComponent';
import Wrapper from '@/features/Auth/Wrapper';
import { rules } from '@/rules';
import { Notification, getRandomInteger } from '@/utils';
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { authorServices } from '../services';
import axios from 'axios';
import moment from 'moment';
const apiUrl = 'http://localhost:5243/api/authors';

const initialValue = {
    name: '',
    address: '',
    genre: '',
    status: '',
    birthDate: '',
};

const AuthorForm = ({
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
                birthDate: moment(values.birthDate),
                address: values.address,
                status: values.status,
                genre: values.genre,
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
                id: values?.id,
                birthDate: moment(data.birthDate),
            };
            axios
                .put(`${apiUrl}/${values?.id}`, dataUpload)
                .then((res) => {
                    Notification('success', 'Cập nhật tác giả thành công');
                    handleCloseForm();
                    formReset();
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            const dataUpload = {
                id: getRandomInteger(),
                birthDate: moment(data?.birthDate),
                ...data,
            };
            axios
                .post(apiUrl, dataUpload)
                .then((res) => {
                    if (res.status) {
                        Notification('success', 'Thêm tác giả thành công');
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
                <ModalComponent title={values ? 'Sửa tác giả' : 'Thêm tác giả'} modalVisible={modalVisible} width={600}>
                    <FormComponent form={form} onSubmit={handleSubmit}>
                        <Row style={{ flexDirection: 'row' }} gutter={[20, 0]}>
                            <FormItemComponent
                                rules={[rules.required('Vui lòng nhập tên tác giả!')]}
                                name="name"
                                label="Tên tác giả"
                                normalize={(value: any) => value.trimStart()}
                                inputField={<Input placeholder="Nhập tên tác giả" />}
                            />
                            <FormItemComponent
                                // rules={[rules.required('Vui lòng chọn ngày sinh tác giả!')]}
                                name="birthDate"
                                label="Ngày sinh"
                                inputField={
                                    <DatePicker
                                        onChange={(value) => {
                                            setDatas(value);
                                        }}
                                        style={{ width: '100%' }}
                                        placeholder="Chọn ngày sinh"
                                    />
                                }
                            />

                            <FormItemComponent
                                rules={[rules.required('Vui lòng nhập địa chỉ tác giả!')]}
                                name="address"
                                label="Địa chỉ"
                                normalize={(value: any) => value.trimStart()}
                                inputField={
                                    <Input.TextArea style={{ height: 150 }} placeholder="Nhập địa chỉ tác giả" />
                                }
                            />
                            <FormItemComponent
                                rules={[rules.required('Vui lòng nhập số điện thoại khách hàng!')]}
                                name="genre"
                                label="Thể loại truyện"
                                normalize={(value: any) => value.trimStart()}
                                inputField={<Input placeholder="Nhập thể loại truyện" />}
                            />
                            {values && (
                                <FormItemComponent
                                    rules={[rules.required('Vui lòng chọn trạng thái khách hàng!')]}
                                    name="status"
                                    label="Trạng thái"
                                    inputField={
                                        <Select placeholder="Chọn trạng thái">
                                            <Select.Option value={true}>Hoạt động</Select.Option>
                                            <Select.Option value={false}>Ngừng hoạt động</Select.Option>
                                        </Select>
                                    }
                                />
                            )}
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
export default AuthorForm;
