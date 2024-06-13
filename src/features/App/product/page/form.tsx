import SaveButton from '@/components/Button/Save.Button';
import CardComponent from '@/components/CardComponent';
import FormComponent from '@/components/FormComponent';
import FormItemComponent from '@/components/FormComponent/FormItemComponent';
import TopBar from '@/components/TopBar';
import Container from '@/layout/Container';
import UploadComponent from '@/components/Upload';
import { TYPE_OPTION } from '@/contants';
import Wrapper from '@/features/Auth/Wrapper';
import { rules } from '@/rules';
import { Notification } from '@/utils';
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import SelectDocument from '../components/SelectDocument';
import { workService } from '../services';
import axios from 'axios';
import SelectComponent from '@/components/SelectComponent';
import SelectAuthorComponent from '../components/SelectAuthor';
const apiUrl = 'http://localhost:5243/api/Products';
const ProductForm = () => {
    interface ExactType {
        name: String | Number;
        exactDates: String;
    }
    const [form] = Form.useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const fieldValuesRef = React.useRef<any>();
    const location = useLocation();
    const handleSubmit = (data: any) => {
        setLoading(true);

        if (id) {
            const dataUpload = {
                ...data,
                id: id,
                authorobj: { id: data?.author?.key },
            };
            axios
                .put(apiUrl + `/${id}`, dataUpload)
                .then((res) => {
                    if (res.status) {
                        Notification('success', 'Cập nhật sản phẩm thành công');
                        navigate(location?.state?.prevUrl || -1, { state: location.state });
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            const dataUpload = {
                ...data,
                authorobj: { id: data?.author?.key },
            };
            axios
                .post(apiUrl, dataUpload)
                .then((res) => {
                    if (res.status) {
                        Notification('success', 'Thêm sản phẩm thành công');
                        navigate('/product');
                    }
                })
                .finally(() => setLoading(false));
        }
    };
    React.useEffect(() => {
        form.setFieldsValue({
            repeatType: TYPE_OPTION.NONE,
        });
        if (!id) return;
        axios.get(`${apiUrl}/${id}`).then((res: any) => {
            if (res.status) {
                fieldValuesRef.current = res.data;
                const fieldValues: any = {
                    ...res.data,
                };
                console.log('🚀 ~ axios.get ~ fieldValues:', fieldValues);

                form.setFieldsValue({
                    name: fieldValues?.name,
                    category: fieldValues?.category,
                    description: fieldValues?.description,
                    price: fieldValues?.price,
                    author: fieldValues?.authorobj?.id,
                    totalQuantity: fieldValues?.totalQuantity,
                });
            }
        });
    }, [id]);

    return (
        <>
            <Wrapper loading={loading}>
                <FormComponent form={form} onSubmit={handleSubmit}>
                    <TopBar
                        back
                        title={id ? `Cập nhật sản phẩm` : 'Thêm sản phẩm'}
                        extra={[<SaveButton key="addOrder" htmlType="submit" />]}
                    />
                    <Container>
                        <CardComponent bodyStyle={{ height: '100%' }}>
                            <Row style={{ flexDirection: 'row' }} gutter={[20, 0]}>
                                <Col span={24}>
                                    <FormItemComponent
                                        rules={[rules.required('Vui lòng nhập tên sản phẩm!'), rules.validateTitle]}
                                        name="name"
                                        normalize={(value: any) => value.trimStart()}
                                        label={<b>Tên sản phẩm</b>}
                                        inputField={<Input placeholder="Nhập tên sản phẩm" />}
                                    />

                                    <FormItemComponent
                                        name="category"
                                        label={<b>Danh mục</b>}
                                        inputField={
                                            <Select>
                                                <Select.Option value={1}>Truyện trinh thám</Select.Option>
                                                <Select.Option value={2}>Truyện kinh dị</Select.Option>
                                                <Select.Option value={3}>Truyện hành động</Select.Option>
                                                <Select.Option value={4}>Truyện hài kịch</Select.Option>
                                                <Select.Option value={5}>Truyện tình cảm</Select.Option>
                                            </Select>
                                        }
                                    />
                                    {/* <FormItemComponent
                                        name="category"
                                        label={<b>Phân loại</b>}
                                        inputField={
                                            <SelectDocument
                                                // value={params?.search ? { value: params?.search } : undefined}
                                                onChange={(item: any) => {}}
                                                apiUrl="/documents"
                                                placeholder="Chọn danh mục"
                                            />
                                        }
                                    /> */}
                                    <FormItemComponent
                                        // rules={['Vui lòng nhập giá sản phẩm!']}
                                        name="salePrice"
                                        label={<b>Giá sản phẩm</b>}
                                        inputField={
                                            <InputNumber style={{ width: '100%' }} placeholder="Nhập giá sản phẩm" />
                                        }
                                    />
                                    <FormItemComponent
                                        // rules={['Vui lòng nhập giá sản phẩm!']}
                                        name="originalPrice"
                                        label={<b>Giá nhập</b>}
                                        inputField={
                                            <InputNumber
                                                style={{ width: '100%' }}
                                                placeholder="Nhập giá gốc sản phẩm"
                                            />
                                        }
                                    />
                                    <FormItemComponent
                                        // rules={['Vui lòng nhập số lượng sản phẩm!']}
                                        name="totalQuantity"
                                        label={<b>Số lượng sản phẩm</b>}
                                        inputField={
                                            <InputNumber
                                                style={{ width: '100%' }}
                                                placeholder="Nhập số lượng sản phẩm"
                                            />
                                        }
                                    />
                                    <FormItemComponent
                                        // rules={['Vui lòng nhập tên tác giả!']}
                                        name="author"
                                        label={<b>Tên tác giả</b>}
                                        inputField={
                                            <SelectAuthorComponent
                                                apiUrl="http://localhost:5243/api/authors"
                                                placeholder="Nhập tên tác giả"
                                            />
                                        }
                                    />
                                    {/* {id && (
                                        <FormItemComponent
                                            name="status"
                                            label={<b>Trạng thái</b>}
                                            inputField={
                                                <Select placeholder="Chọn trạng thái">
                                                    <Select.Option value={1}> Đang hoạt động</Select.Option>
                                                    <Select.Option value={2}> Ngừng hoạt động</Select.Option>
                                                </Select>
                                            }
                                        />
                                    )} */}
                                    <FormItemComponent
                                        rules={['Vui lòng nhập mô tả!']}
                                        name="description"
                                        label={<b>Mô tả</b>}
                                        normalize={(value: any) => value?.trimStart()}
                                        inputField={
                                            <Input.TextArea
                                                style={{ minHeight: '150px', whiteSpace: 'pre-wrap' }}
                                                placeholder="Nhập mô tả"
                                            />
                                        }
                                    />
                                </Col>
                            </Row>
                        </CardComponent>
                    </Container>
                </FormComponent>
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
export default ProductForm;
