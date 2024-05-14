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
const apiUrl = 'https://b121-2405-4802-1cae-d580-e0cf-60e4-dc25-b862.ngrok-free.app/api/Products';
const ProductForm = () => {
    interface ExactType {
        name: String | Number;
        exactDates: String;
    }
    const [form] = Form.useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [file, setFile] = React.useState<any>(null);

    const fieldValuesRef = React.useRef<any>();
    const location = useLocation();
    const handleSubmit = (data: any) => {
        setLoading(true);

        if (id) {
            const dataUpload = {
                ...data,
            };
            axios
                .put(apiUrl + `/${id}`, dataUpload)
                .then((res) => {
                    if (res.status) {
                        Notification('success', 'Cập nhật công việc thành công');
                        navigate(location?.state?.prevUrl || -1, { state: location.state });
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            const dataUpload = {
                name: data.name || '',
            };
            axios
                .post(apiUrl, dataUpload)
                .then((res) => {
                    if (res.status) {
                        Notification('success', 'Thêm công việc thành công');
                        navigate('/work');
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
        workService.detailWork(Number(id), { page: 1 }).then((res: any) => {
            if (res.status) {
                fieldValuesRef.current = res.data;
                const fieldValues: any = {
                    ...res.data,
                };

                form.setFieldsValue({
                    name: fieldValues?.name,
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
                                        label={<b>Ảnh sản phẩm</b>}
                                        inputField={
                                            <UploadComponent
                                                accept=".png, .jpg, .jpeg"
                                                isUploadServerWhenUploading
                                                uploadType="single"
                                                listType="picture-card"
                                                maxLength={1}
                                                onSuccessUpload={(file: any) => {
                                                    setFile(file?.relativeUrl);
                                                }}
                                                isShowFileList
                                                initialFile={
                                                    []
                                                    // values?.avatar && [
                                                    //     {
                                                    //         url: values?.avatar,
                                                    //         uid: uuid(),
                                                    //         name: 'avatar',
                                                    //     },
                                                    // ]
                                                }
                                            />
                                        }
                                    />
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
                                            <SelectDocument
                                                // value={params?.search ? { value: params?.search } : undefined}
                                                onChange={(item: any) => {}}
                                                apiUrl="/documents"
                                                placeholder="Chọn danh mục"
                                            />
                                        }
                                    />

                                    <FormItemComponent
                                        rules={['Vui lòng nhập giá sản phẩm!']}
                                        name="content"
                                        label={<b>Giá sản phẩm</b>}
                                        inputField={
                                            <InputNumber style={{ width: '100%' }} placeholder="Nhập giá sản phẩm" />
                                        }
                                    />
                                    <FormItemComponent
                                        rules={['Vui lòng nhập số lượng sản phẩm!']}
                                        name="content"
                                        label={<b>Số lượng sản phẩm</b>}
                                        inputField={
                                            <InputNumber
                                                style={{ width: '100%' }}
                                                placeholder="Nhập số lượng sản phẩm"
                                            />
                                        }
                                    />
                                    <FormItemComponent
                                        rules={['Vui lòng nhập tên tác giả!']}
                                        name="content"
                                        label={<b>Tên tác giả</b>}
                                        inputField={
                                            <InputNumber style={{ width: '100%' }} placeholder="Nhập tên tác giả" />
                                        }
                                    />
                                    {id && (
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
                                    )}
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
