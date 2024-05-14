import SaveButton from '@/components/Button/Save.Button';
import CardComponent from '@/components/CardComponent';
import FormComponent from '@/components/FormComponent';
import FormItemComponent from '@/components/FormComponent/FormItemComponent';
import LoadingComponent from '@/components/Loading';
import SelectComponent from '@/components/SelectComponent';
import TopBar from '@/components/TopBar';
import VideoUpload from '@/components/UploadVideos';
import { NEWS_STATUS } from '@/contants';
import Container from '@/layout/Container';
import { rules } from '@/rules';
import { Notification, uuid } from '@/utils';
import { Col, Form, Input, Row, Select } from 'antd';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Content from '../components/Content';
import SelectGarden from '../components/SelectGarden';
import { DataType, documentService } from '../services';
import useDebounce from '@/hooks/useDebounce';

const DocumentFormPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = React.useState(false);
    const [urlVideo, setUrlVideo] = React.useState<string>('');
    const [form] = Form.useForm();
    const title = Form.useWatch('title', form);
    const image = Form.useWatch('file', form);
    const type = Form.useWatch('type', form);
    const [checkAll, setCheckAll] = React.useState<boolean>(false);
    const [checkshowAll, setCheckShowAll] = React.useState<number>(0);
    const fileEdit = React.useRef<any>(null);
    const refContent = React.useRef<any>(null);

    const handleSubmit = async (data: DataType) => {
        setLoading(true);
        if (data?.content.trim() === '') return Notification('warning', 'Vui lòng nhập nội dung');
        const dataUpload: DataType = {
            ...data,
            status: data.status,
            title: data?.title,
            content: data?.content,
            assignedToAllGardens: checkAll,
            gardenIds: data?.gardenIds?.map((item: any) => item),
            flowerId: data?.flowerId?.value || data?.flowerId,
        };
        if (checkAll) {
            delete dataUpload.gardenIds;
        }
        if (id) {
            await documentService
                .update({ ...dataUpload, documentId: Number(id) })
                .then((res) => {
                    if (res.status) {
                        Notification('success', 'Cập nhật tài liệu thành công');
                        navigate(location?.state?.prevUrl || -1, { state: location.state });
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            await documentService
                .create(dataUpload)
                .then((res) => {
                    if (res.status) {
                        Notification('success', 'Thêm tài liệu thành công');
                        navigate(location?.state?.prevUrl || -1, { state: location.state });
                    }
                })
                .finally(() => setLoading(false));
        }
    };

    const handleCallbackContent = React.useCallback((content: string) => {
        form.setFieldsValue({ content });
    }, []);
    React.useEffect(() => {
        form.setFieldsValue({
            video: urlVideo,
        });
    }, [urlVideo]);
    React.useEffect(() => {
        if (!id) {
            form.setFieldsValue({
                status: NEWS_STATUS.POST,
            });
            return;
        }

        documentService.detail(Number(id)).then((res) => {
            if (res.status) {
                const fieldValues: any = {
                    ...res.data,
                };
                const arrGarden = res?.data?.gardens?.map((item: { id: number }) => item?.id);
                res?.data?.assignedToAllGardens ? setCheckShowAll(1) : setCheckShowAll(2);
                form.setFieldsValue({
                    ...fieldValues,
                    content: res?.data?.content,
                    title: res?.data?.title,
                    type: res.data?.type,
                    video: res.data?.video,
                    gardenIds: res?.data?.assignedToAllGardens ? ['all'] : arrGarden,
                    flowerId: res?.data?.flowerId,
                });
                setCheckAll(res?.data?.assignedToAllGardens);
                setUrlVideo(res.data?.video);
                fileEdit.current = [{ url: res.data?.video, uid: uuid(), name: 'video' }];
                refContent.current = res.data?.content == 'null' ? '' : res.data?.content;
            }
        });
    }, [id]);

    return (
        <FormComponent form={form} onSubmit={handleSubmit}>
            <TopBar
                back
                title={id ? `Sửa tài liệu` : 'Thêm tài liệu'}
                extra={[<SaveButton key="saveDocument" htmlType="submit" />]}
            />
            <Container>
                <CardComponent>
                    <Row>
                        {/* col bên trái */}
                        <Col xs={24} sm={24} lg={12}>
                            <Row>
                                <FormItemComponent
                                    rules={[rules.required('Vui lòng chọn loại tài liệu!')]}
                                    name="type"
                                    label="Loại tài liệu"
                                    inputField={
                                        <Select disabled={!!id} placeholder="Chọn tài liệu">
                                            <Select.Option value="guidance">Hướng dẫn công việc</Select.Option>
                                            <Select.Option value="technical">Tài liệu kỹ thuật</Select.Option>
                                        </Select>
                                    }
                                />
                                {type === 'guidance' ? (
                                    <></>
                                ) : (
                                    <FormItemComponent
                                        rules={[rules.required('Vui lòng chọn vườn!')]}
                                        name="gardenIds"
                                        label="Vườn"
                                        inputField={
                                            <SelectGarden
                                                onChange={(item: any) => {
                                                    const isCheck = item.includes('all');
                                                    setCheckAll(isCheck);
                                                    // returnFilter({ user_type: item?.value });
                                                }}
                                                check={checkshowAll}
                                                apiUrl="/gardens"
                                                placeholder="Chọn vườn"
                                            />
                                        }
                                    />
                                )}

                                <FormItemComponent
                                    rules={[rules.required('Vui lòng chọn video!')]}
                                    name="video"
                                    label={<div>Video</div>}
                                    inputField={
                                        <VideoUpload width={'350'} urlVideo={urlVideo} setUrlVideo={setUrlVideo} />
                                    }
                                />
                            </Row>
                        </Col>

                        <Col xs={24} sm={24} lg={12}>
                            <Row>
                                <FormItemComponent
                                    rules={[rules.required('Vui lòng nhập tiêu đề!'), rules.validateTitle]}
                                    name="title"
                                    label="Tiêu đề"
                                    normalize={(value: any) => value.trimStart()}
                                    inputField={<Input placeholder="Nhập tiêu đề" />}
                                />
                                {type === 'guidance' ? (
                                    <></>
                                ) : (
                                    <FormItemComponent
                                        rules={[rules.required('Vui lòng chọn cây trồng!')]}
                                        name="flowerId"
                                        label="Cây trồng"
                                        inputField={
                                            <SelectComponent
                                                onChange={(item: any) => {
                                                    // returnFilter({ user_type: item?.value });
                                                }}
                                                apiUrl="/flowers"
                                                placeholder="Chọn cây trồng"
                                            />
                                        }
                                    />
                                )}
                                <FormItemComponent
                                    rules={[rules.required('Vui lòng chọn loại trạng thái!')]}
                                    name="status"
                                    label="Trạng thái"
                                    inputField={
                                        <Select placeholder="Chọn trạng thái">
                                            <Select.Option value={NEWS_STATUS.POST}>Đăng bài</Select.Option>
                                            <Select.Option value={NEWS_STATUS.DRAFT}>Lưu nháp</Select.Option>
                                        </Select>
                                    }
                                />
                            </Row>
                        </Col>
                    </Row>
                    <div>
                        <Row justify="start" style={{ marginLeft: '2px' }}>
                            Nội dung
                            <span style={{ color: 'rgb(255, 77, 79)', fontSize: 24, marginLeft: '2px' }}> *</span>
                        </Row>
                        <Form.Item
                            normalize={(value: any) => value.trimStart()}
                            wrapperCol={{ span: 24 }}
                            name="content"
                            rules={[rules.required('Vui lòng nhập nội dung tài liệu!')]}
                        >
                            <Content
                                refContent={refContent?.current}
                                handleCallbackContent={handleCallbackContent}
                                image={
                                    image
                                        ? URL?.createObjectURL(image)
                                        : fileEdit?.current
                                        ? fileEdit?.current[0]?.url
                                        : ''
                                }
                                title={title}
                            />
                        </Form.Item>
                    </div>
                </CardComponent>
            </Container>
            {loading && <LoadingComponent />}
        </FormComponent>
    );
};

export default DocumentFormPage;
