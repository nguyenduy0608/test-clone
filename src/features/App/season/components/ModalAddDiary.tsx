import SaveButton from '@/components/Button/Save.Button';
import FormComponent from '@/components/FormComponent';
import ModalComponent from '@/components/ModalComponent';
import SelectComponent from '@/components/SelectComponent';
import useCallContext from '@/hooks/useCallContext';
import { rules } from '@/rules';
import { Button, Col, Form, Input, Row, Space } from 'antd';
import React from 'react';
import SelectArea from './SelectArea';
import SelectPlant from './SelectPlantbedI';
import { Notification, uuid, wait } from '@/utils';
import { useWatch } from 'antd/lib/form/Form';
import UploadVideoComponent from '@/components/UploadVideo';
import UploadComponent from '@/components/Upload';
import VideoUpload from '@/components/UploadVideos';
import { DataUploadDiary, seasonsService } from '../services';
import { ppid } from 'process';
import { useParams } from 'react-router-dom';
import ComponentSelect from './ComponentSelect';
import SelectTask from './SelectTask';

interface IProps {
    values: any;
    openModal: any;
    setModalVisible: any;
    refetch: any;
    dataRecord: any;
    setDataRecord: any;
}
const ModalAddDiary = (props: IProps) => {
    const { values, openModal, setModalVisible, refetch, dataRecord, setDataRecord } = props;
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [form] = Form.useForm();
    const { id } = useParams();
    const [areaId, setAreaId] = React.useState<string>('');
    const [urlVideo, setUrlVideo] = React.useState<string>('');
    const [urlImage, setUrlImage] = React.useState<any[]>([]);
    // const [iamgeUpload, setImageUpload] = React.useState<any[]>([]);
    const onClickClosePopup = () => {
        setModalVisible(false);
        closeModal();
    };

    const closeModal = () => {
        refetch();
        setUrlImage([]);
        setUrlVideo('');
        form.resetFields();
        setDataRecord(null);
    };
    React.useEffect(() => {
        if (dataRecord) {
            setLoading(true);
            const idsArea = dataRecord?.areas?.map((item: { id: number }) => item.id);
            const arrImage = dataRecord?.images?.map((item: string) => ({
                url: item,
                uid: uuid(),
                name: item,
                absoluteUrl: item,
                originalName: item,
            }));
            setAreaId(idsArea?.join(','));
            setUrlVideo(dataRecord?.video);
            form.setFieldsValue({
                taskId: dataRecord?.taskId,
                areaIds: dataRecord?.areas?.map((item: { id: number }) => item.id),
                plantbedIds: dataRecord?.plantbeds?.map((item: { id: number }) => item.id),
                video: dataRecord?.video,
                content: dataRecord?.content,
                images: arrImage,
            });
            setUrlImage(arrImage);
            wait(500).then(() => setLoading(false));
        }
    }, [dataRecord]);
    // React.useEffect(() => {
    //     const newArr = urlImage?.filter((item: any) => !item.status);
    //     setImageUpload(newArr);
    // }, [urlImage]);
    // console.log('urlImage', urlImage);
    
    const handleSubmit = async (value: DataUploadDiary) => {
        const filteredPaths = urlImage.filter((obj) => !obj.status).map((obj) => obj.absoluteUrl);
        setLoading(true);
        const dataUpload: any = {
            ...value,
            video: urlVideo,
            images: JSON.stringify(filteredPaths),
            taskId: value?.taskId?.value || value?.taskId,
            seasonId: values?.data?.id,
        };

        if (dataRecord) {
            seasonsService
                .updateDiaryHarvest({ ...dataUpload, diaryId: dataRecord.id })
                .then((res) => {
                    if (res.status) {
                        Notification('success', 'Thêm mới nhật ký thành công');
                        closeModal();
                        setModalVisible(false);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            seasonsService
                .createDiaryHarvest(dataUpload)
                .then((res) => {
                    if (res.status) {
                        Notification('success', 'Thêm mới nhật ký thành công');
                        closeModal();
                        setModalVisible(false);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };
    const checkImage = (file: any) => {
        if (file?.name) {
            setUrlImage((prevObjects) =>
                prevObjects.filter((obj) => !obj?.originalName.includes(file.name))
            );
        } else {
            setUrlImage((prev: any) => (prev ? [...prev, file] : [file]));
        }
    };
    React.useEffect(() => {
        form.setFieldsValue({
            video: urlVideo,
        });
    }, [urlVideo]);
    return (
        <ModalComponent
            modalVisible={openModal}
            title={dataRecord ? 'Sửa nhật ký' : 'Thêm nhật ký'}
            loading={isLoading}
            width={800}
        >
            <FormComponent layoutType="vertical" form={form} onSubmit={handleSubmit}>
                <Row gutter={[20, 0]}>
                    <Col span={24}>
                        <Form.Item name="taskId" label="Công việc">
                            <SelectTask
                                onChange={(item: any) => {
                                    // returnFilter({ category_id: item?.key || '' });
                                }}
                                apiUrl={`/diaries/task/${id}`}
                                placeholder="Chọn công việc"
                            />
                        </Form.Item>
                        <Form.Item
                            // rules={[rules.required('Vui lòng chọn khu vực!')]}
                            name="areaIds"
                            label="Khu vực"
                        >
                            <ComponentSelect
                                onChange={(item: any) => {}}
                                apiUrl={`/diaries/areas-plantbeds/${id}`}
                                // params={{ areaIds: areaId }}
                                placeholder="Chọn khu vực"
                                type="areas"
                            />
                        </Form.Item>
                        <Form.Item
                            // rules={[rules.required('Vui lòng chọn luống!')]}
                            name="plantbedIds"
                            label="Luống"
                        >
                            <ComponentSelect
                                onChange={(item: any) => {}}
                                apiUrl={`/diaries/areas-plantbeds/${id}`}
                                // params={{ areaIds: areaId }}
                                placeholder="Chọn luống trồng"
                                type="plantbeds"
                            />
                        </Form.Item>
                        <Form.Item rules={[rules.required('Vui lòng tải hình ảnh!')]} name="images" label="Hình ảnh">
                            <UploadComponent
                                accept=".png, .jpg, .jpeg"
                                isUploadServerWhenUploading
                                uploadType="single"
                                listType="picture-card"
                                onSuccessUpload={(file: any) => {
                                    checkImage(file);
                                    form.setFieldsValue({
                                        images: file,
                                    });
                                }}
                                isShowFileList
                                initialFile={urlImage}
                            />
                        </Form.Item>
                        <Form.Item rules={[rules.required('Vui lòng tải video!')]} name="video" label="Video">
                            <VideoUpload width="600" urlVideo={urlVideo} setUrlVideo={setUrlVideo} />
                        </Form.Item>

                        <Form.Item
                            rules={[rules.required('Vui lòng nhập nội dung!')]}
                            name="content"
                            normalize={(value: any) => value?.trimStart()}
                            label="Nội dung"
                        >
                            <Input.TextArea style={{ minHeight: '250px', whiteSpace: 'pre-wrap' }} placeholder="Nhập nội dung" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{ width: '100%' }} justify="end">
                    <Space style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
                        <Button type="default" onClick={onClickClosePopup}>
                            Đóng
                        </Button>
                        <SaveButton htmlType="submit" />
                    </Space>
                </Row>
            </FormComponent>
        </ModalComponent>
    );
};

export default ModalAddDiary;
