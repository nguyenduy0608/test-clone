import SaveButton from '@/components/Button/Save.Button';
import CardComponent from '@/components/CardComponent';
import FormComponent from '@/components/FormComponent';
import FormItemComponent from '@/components/FormComponent/FormItemComponent';
import TopBar from '@/components/TopBar';
import UploadComponent from '@/components/Upload';
import { BOX_SHADOW } from '@/config/theme';
import Container from '@/layout/Container';
import { rules } from '@/rules';
import { Notification, uuid } from '@/utils';
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { DataType, flowerService } from '../services';
import Wrapper from '@/features/Auth/Wrapper';
import { TYPE_FLOWER } from '@/contants';
import { useWatch } from 'antd/lib/form/Form';
const Option = Select;
const TreeForm = () => {
    const [form] = Form.useForm();
    const { id } = useParams();
    const [file, setFile] = React.useState<any>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const typeFlower = useWatch('type', form);
    const handleSubmit = (data: DataType) => {
        setLoading(true);
        if (id) {
            flowerService
                .update({ ...data, flowerId: Number(id) })
                .then((res) => {
                    if (res.status) {
                        Notification('success', 'Cập nhật cây trồng thành công');
                        navigate(location?.state?.prevUrl || -1, { state: location.state });
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            flowerService
                .create(data)
                .then((res) => {
                    if (res.status) {
                        Notification('success', 'Thêm cây trồng thành công');
                        navigate(location?.state?.prevUrl || -1, { state: location.state });
                        navigate('/tree');
                    }
                })
                .finally(() => setLoading(false));
        }
    };

    React.useEffect(() => {
        if (!id) return;
        flowerService.detail(+id, { include: 'plantbeds' }).then((res) => {
            if (res.status) {
                const fieldValues: DataType = {
                    ...res.data,
                };
                form.setFieldsValue({
                    ...fieldValues,
                });
                setFile(res?.data?.thumbnail || '');
            }
        });
    }, [id]);
    return (
        <Wrapper loading={loading}>
            <FormComponent form={form} onSubmit={handleSubmit} layoutType="vertical">
                <TopBar
                    back
                    title={id ? `Cập nhật cây trồng` : 'Thêm cây trồng'}
                    extra={[<SaveButton key="addTree" htmlType="submit" />]}
                />
                <Container>
                    <CardComponent>
                        <Row gutter={[20, 0]}>
                            <FormItemComponent
                                rules={[rules.required('Vui lòng nhập mã cây trồng!'), rules.validateCode]}
                                name="sid"
                                normalize={(value: any) => value.trim()}
                                label="Mã cây trồng"
                                inputField={<Input placeholder="Nhập mã cây trồng" onBlur={async (e) => {
                                    if (!(e.target.value.length > 6)) return;
                                    const result = await flowerService.checkExitsFlower(e.target.value);
                                    if (result) {
                                        form.setFields([
                                            {
                                                name: 'sid',
                                                errors: ['Mã cây trồng đã tồn tại'],
                                            },
                                        ]);
                                    }
                                }}/>}
                            />
                            <FormItemComponent
                                rules={[rules.required('Vui lòng nhập tên cây trồng!'), rules.validateTitle]}
                                name="name"
                                normalize={(value: any) => value.trimStart()}
                                label="Tên cây trồng"
                                inputField={<Input placeholder="Nhập tên cây trồng" />}
                            />
                            <FormItemComponent
                                rules={[rules.required('Vui lòng chọn loại cây!')]}
                                name="type"
                                label="Loại cây"
                                inputField={
                                    <Select placeholder="Chọn loại cây" style={{ width: '50%' }}>
                                        <Option value={TYPE_FLOWER.GROW_ONE}>Thu một lần</Option>
                                        <Option value={TYPE_FLOWER.GROWN_MANY_TIMES}>Thu nhiều lần</Option>
                                        <Option value={TYPE_FLOWER.PERENNIAL}>Lâu năm</Option>
                                    </Select>
                                }
                            />

                            <FormItemComponent
                                rules={[rules.required('Vui lòng chọn ảnh!')]}
                                label="Ảnh"
                                name="thumbnail"
                                inputField={
                                    <UploadComponent
                                        accept=".png, .jpg, .jpeg"
                                        isUploadServerWhenUploading
                                        uploadType="single"
                                        listType="picture-card"
                                        maxLength={1}
                                        onSuccessUpload={(file: any) => {
                                            setFile(file?.absoluteUrl);
                                            form.setFieldsValue({
                                                thumbnail: file?.absoluteUrl,
                                            });
                                        }}
                                        isShowFileList
                                        initialFile={
                                            file && [
                                                {
                                                    url: file,
                                                    uid: uuid(),
                                                    name: 'image',
                                                },
                                            ]
                                        }
                                    />
                                }
                            />

                            <FormItemComponent
                                name="description"
                                normalize={(value: any) => value.trimStart()}
                                label="Mô tả"
                                inputField={<Input.TextArea style={{minHeight: '250px'}} placeholder="Nhập mô tả" />}
                            />
                        </Row>
                        <Row align="middle"></Row>
                    </CardComponent>
                </Container>
            </FormComponent>
        </Wrapper>
    );
};

const ColStyled = styled(Col)`
    /* border: 1px solid; */
    border-radius: 10px;
    display: flex;
    margin-top: 25px !important;
    padding: 20px 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* box-shadow: ${BOX_SHADOW} !important; */
`;

export default TreeForm;
