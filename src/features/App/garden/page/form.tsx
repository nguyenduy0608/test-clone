import SaveButton from '@/components/Button/Save.Button';
import CardComponent from '@/components/CardComponent';
import FormComponent from '@/components/FormComponent';
import FormItemComponent from '@/components/FormComponent/FormItemComponent';
import TopBar from '@/components/TopBar';
import Container from '@/layout/Container';
// import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { CloseOutlined } from '@ant-design/icons';
import { rules } from '@/rules';
import { Button, Card, Col, Form, Input, InputNumber, Row, Space } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { BOX_SHADOW, TAB_MOBLIE, TAB_SIZE } from '@/config/theme';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DataType, gardenService } from '../services';
import { Notification } from '@/utils';
import Wrapper from '@/features/Auth/Wrapper';
import useWindowSize from '@/hooks/useWindowSize';

const GardenForm = () => {
    const [form] = Form.useForm();
    const { width } = useWindowSize();
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const changeIds = (data: DataType) => {
        const updatedData = { ...data };

        // Duyệt qua các khu vực và thay đổi trường "id" thành "areaId" nếu tồn tại
        if (updatedData.areas && Array.isArray(updatedData.areas)) {
            updatedData.areas.forEach((area: any, index: number) => {
                if (area.id) {
                    area.areaId = area.id;
                    area.index = index + 1;
                    delete area.id;
                    delete area.updatedBy;
                    delete area.updatedAt;
                    delete area.gardenId;
                    delete area.deletedAt;
                    delete area.createdBy;
                    delete area.createdAt;
                } else {
                    area.index = index + 1;
                }

                // Duyệt qua các luống cây và thay đổi trường "id" thành "plantbedId" nếu tồn tại
                if (area.plantbeds && Array.isArray(area.plantbeds)) {
                    area.plantbeds.forEach((plantbed: any, indexPlant: number) => {
                        if (plantbed.id) {
                            plantbed.plantbedId = plantbed.id;
                            plantbed.index = indexPlant + 1;
                            delete plantbed.id;
                            delete plantbed.createdAt;
                            delete plantbed.createdBy;
                            delete plantbed.deletedAt;
                            delete plantbed.updatedAt;
                            delete plantbed.updatedBy;
                            delete plantbed.areaId;
                        } else {
                            plantbed.index = indexPlant + 1;
                        }
                    });
                }
            });
        }
        return updatedData;
    };

    const handleSubmit = (data: DataType) => {
        setLoading(true);

        if (id) {
            const dataUpload: DataType = changeIds(data);

            gardenService
                .update({ ...dataUpload, gardenId: Number(id) })
                .then((res) => {
                    if (res.status) {
                        Notification('success', 'Cập nhật vườn thành công');
                        navigate(location?.state?.prevUrl || -1, { state: location.state });
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            const dataUpload: DataType = changeIds(data);

            gardenService
                .create(dataUpload)
                .then((res) => {
                    if (res.status) {
                        Notification('success', 'Thêm vườn thành công');
                        navigate('/garden');
                    }
                })
                .finally(() => setLoading(false));
        }
    };

    React.useEffect(() => {
        if (!id) return;
        gardenService.detail(+id, { include: 'plantbeds' }).then((res) => {
            if (res.status) {
                const fieldValues: DataType = {
                    ...res.data,
                };
                form.setFieldsValue({
                    ...fieldValues,
                });
            }
        });
    }, [id]);
    return (
        <Wrapper loading={loading}>
            <FormComponent form={form} onSubmit={handleSubmit}>
                <TopBar
                    back
                    title={id ? `Cập nhật vườn` : 'Thêm vườn'}
                    extra={[<SaveButton key="addOrder" htmlType="submit" />]}
                />
                <Container>
                    <CardComponent>
                        <Row style={{ flexDirection: 'row' }} gutter={[20, 0]}>
                            <Col span={12}>
                                <FormItemComponent
                                    rules={[rules.required('Vui lòng nhập mã vườn!'), rules.validateCode]}
                                    name="sid"
                                    label="Mã vườn"
                                    normalize={(value: any) => value.trimStart()}
                                    inputField={<Input placeholder="Nhập mã vườn" />}
                                />
                                <FormItemComponent
                                    rules={[rules.required('Vui lòng nhập tên vườn!'), rules.validateTitle]}
                                    name="name"
                                    normalize={(value: any) => value.trimStart()}
                                    label="Tên vườn"
                                    inputField={<Input placeholder="Nhập tên vườn" />}
                                />
                            </Col>
                            <Col span={12}>
                                <FormItemComponent
                                    rules={[rules.required('Vui lòng nhập diện tích!')]}
                                    name="acreage"
                                    label="Diện tích"
                                    inputField={
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            addonAfter="M2"
                                            placeholder="Nhập diện tích"
                                            min={0}
                                            max={10000000000}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                            parser={(value: any) => (value ? value.replace(/[^0-9]/g, '') : '')}
                                        />
                                    }
                                />
                                <FormItemComponent
                                    name="address"
                                    label="Địa chỉ"
                                    normalize={(value: any) => value.trimStart()}
                                    inputField={<Input placeholder="Nhập địa chỉ" />}
                                />
                            </Col>
                        </Row>
                        <Row align="middle">
                            <ColStyled span={24}>
                                <Form.List name="areas">
                                    {(fields, { add, remove }) => (
                                        <div
                                            style={{
                                                display: 'flex',
                                                rowGap: 0,
                                                flexDirection: 'column',
                                                width: `${width < TAB_SIZE ? 100 : 75}%`,
                                            }}
                                        >
                                            {fields.map((field) => (
                                                <Card
                                                    size="small"
                                                    title={`Khu vực ${field.name + 1}`}
                                                    key={field.key}
                                                    extra={
                                                        <CloseOutlined
                                                            onClick={() => {
                                                                remove(field.name);
                                                            }}
                                                        />
                                                    }
                                                >
                                                    {/* <FormItemComponent
                                                        rules={[{ required: true, message: 'Nhập mã khu vực' }, rules.validateTitle]}
                                                        label="Mã khu vực"
                                                        normalize={(value: any) => value.trimStart()}
                                                        name={[field.name, 'sid']}
                                                        inputField={<Input placeholder="Mã khu vực" />}
                                                    /> */}
                                                    <FormItemComponent
                                                        rules={[
                                                            { required: true, message: 'Nhập tên khu vực' },
                                                            rules.validateTitle,
                                                        ]}
                                                        label="Tên khu vực"
                                                        normalize={(value: any) => value.trimStart()}
                                                        name={[field.name, 'name']}
                                                        inputField={<Input placeholder="Tên khu vực" />}
                                                    />
                                                    <FormItemComponent
                                                        rules={[{ required: true, message: 'Nhập diện tích' }]}
                                                        label="Diện tích"
                                                        name={[field.name, 'acreage']}
                                                        inputField={
                                                            <InputNumber
                                                                min={0}
                                                                max={10000000000}
                                                                formatter={(value) =>
                                                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                                                                }
                                                                parser={(value: any) =>
                                                                    value ? value.replace(/[^0-9]/g, '') : ''
                                                                }
                                                                style={{ width: '100%' }}
                                                                addonAfter="M2"
                                                                placeholder="Nhập diện tích"
                                                            />
                                                        }
                                                    />
                                                    <FormItemComponent
                                                        label={`${width < TAB_MOBLIE ? '' : 'Luống'}`}
                                                        style={{justifyContent: 'end'}}
                                                        inputField={
                                                            <Form.List name={[field.name, 'plantbeds']}>
                                                                {(subFields, subOpt) => (
                                                                    <div
                                                                        className='âjajajaja'
                                                                        style={{
                                                                            display: 'flex',
                                                                            justifyContent: 'end',
                                                                            flexDirection: 'column',
                                                                            rowGap: 16,
                                                                        }}
                                                                    >
                                                                        {subFields.map(
                                                                            (subField) => (
                                                                                (
                                                                                    <Space key={subField.key} style={{display: 'flex', alignItems: `${width < TAB_SIZE ? 'flex-end' : 'center'}`}}>
                                                                                        <FormItemComponent
                                                                                            rules={[
                                                                                                {
                                                                                                    required: true,
                                                                                                    message:
                                                                                                        'Nhập mã luống',
                                                                                                },
                                                                                                rules.validateId,
                                                                                            ]}
                                                                                            label={`Luống ${
                                                                                                subField.name + 1
                                                                                            }`}
                                                                                            name={[
                                                                                                subField.name,
                                                                                                'sid',
                                                                                            ]}
                                                                                            normalize={(value: any) =>
                                                                                                value.trimStart()
                                                                                            }
                                                                                            inputField={
                                                                                                <Input placeholder="Mã luống" />
                                                                                            }
                                                                                        />
                                                                                        <FormItemComponent
                                                                                            rules={[
                                                                                                {
                                                                                                    required: true,
                                                                                                    message:
                                                                                                        'Nhập tên luống',
                                                                                                },
                                                                                                rules.validateTitle,
                                                                                            ]}
                                                                                            label=""
                                                                                            // noStyle
                                                                                            name={[
                                                                                                subField.name,
                                                                                                'name',
                                                                                            ]}
                                                                                            normalize={(value: any) =>
                                                                                                value.trimStart()
                                                                                            }
                                                                                            inputField={
                                                                                                <Input placeholder="Tên luống" />
                                                                                            }
                                                                                        />

                                                                                        <CloseOutlined
                                                                                            onClick={() => {
                                                                                                subOpt.remove(
                                                                                                    subField.name
                                                                                                );
                                                                                            }}
                                                                                        />
                                                                                    </Space>
                                                                                )
                                                                            )
                                                                        )}
                                                                        <Button
                                                                            type="dashed"
                                                                            onClick={() => subOpt.add()}
                                                                            block
                                                                        >
                                                                            + Thêm luống
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </Form.List>
                                                        }
                                                    />
                                                </Card>
                                            ))}

                                            <Button type="dashed" onClick={() => add()} block>
                                                + Thêm khu vực
                                            </Button>
                                        </div>
                                    )}
                                </Form.List>
                            </ColStyled>
                        </Row>
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

const FormItemStyled = styled(Form.List)`
    & .ant-form-item .ant-row {
        display: flex;
        justify-content: end;
    }
    background-color: red !important;
`;
export default GardenForm;
