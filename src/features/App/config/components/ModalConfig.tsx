import SaveButton from '@/components/Button/Save.Button';
import FormComponent from '@/components/FormComponent';
import FormItemComponent from '@/components/FormComponent/FormItemComponent';
import ModalComponent from '@/components/ModalComponent';
import UploadComponent from '@/components/Upload';
import { STATUS } from '@/contants';
import useCallContext from '@/hooks/useCallContext';
import { Notification, uuid, wait } from '@/utils';
import { Button, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import { useWatch } from 'antd/lib/form/Form';
import React from 'react';
import { ConfigService } from '../service';
import { rules } from '@/rules';
import { TAB_MOBLIE } from '@/config/theme';
import useWindowSize from '@/hooks/useWindowSize';

interface IProps {
    openModal: any;
    handleCloseForm: any;
    values?: any;
    setValues?: any;
    refetch?: any;
}

const ModalConfig = (props: IProps) => {
    const { openModal, handleCloseForm, values, refetch, setValues } = props;
    const { state, dispatch } = useCallContext();
    const [file, setFile] = React.useState<any>(null);
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [form] = Form.useForm();
    const width = useWindowSize();

    const onClickClosePopup = () => {
        handleCloseForm();
        form.resetFields();
        setValues(null);
        setFile(null);
    };
    const handleSubmit = (data: any) => {
        setLoading(true);
        const dataUpload = {
            name: data.name ? data.name : '',
            description: data.description ? data.description : '',
        };

        if (values?.id) {
            ConfigService.update({ ...dataUpload, unitId: values.id })
                .then((res) => {
                    if (res.status) {
                        onClickClosePopup();
                        Notification('success', 'Cập nhật thành công');
                        form.resetFields();
                        refetch();
                    }
                })
                .finally(() => setLoading(false));
        } else {
            ConfigService.create(dataUpload)
                .then((res) => {
                    if (res.status) {
                        onClickClosePopup();
                        Notification('success', 'Thêm đơn vị thành công');
                        refetch();
                        form.resetFields();
                    }
                })
                .finally(() => setLoading(false));
        }
    };
    React.useEffect(() => {
        if (values) {
            setLoading(true);
            const fieldValues: any = {
                ...values,
            };
            form.setFieldsValue({
                ...fieldValues,
                name: values?.name,
                description: values?.description,
            });
            wait(500).then(() => setLoading(false));
        }
    }, [values?.id]);

    return (
        <ModalComponent
            modalVisible={openModal}
            title={values ? 'Cập nhật đơn vị' : 'Thêm đơn vị mới'}
            loading={isLoading}
        >
            <FormComponent form={form} onSubmit={handleSubmit}>
                <Row gutter={[20, 0]}>
                    <Col span={24}>
                        <Form.Item
                            rules={[rules.required('Vui lòng nhập tên đơn vị!'), rules.validateTitle]}
                            name="name"
                            label="Tên đơn vị"
                            normalize={(value: any) => value.trimStart()}
                        >
                            <Input placeholder="Nhập tên đơn vị" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="description" label="Mô tả" normalize={(value: any) => value.trimStart()}>
                            <Input.TextArea placeholder="Nhập mô tả" style={{ height: 120 }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{ width: '100%' }} justify="end">
                    <Space>
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

export default ModalConfig;
