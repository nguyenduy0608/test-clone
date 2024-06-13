import SaveButton from '@/components/Button/Save.Button';
import FormComponent from '@/components/FormComponent';
import FormItemComponent from '@/components/FormComponent/FormItemComponent';
import ModalComponent from '@/components/ModalComponent';
import SelectComponent from '@/components/SelectComponent';
import UploadComponent from '@/components/Upload';
import { GENDER, ROLE, STATUS } from '@/contants';
import useCallContext from '@/hooks/useCallContext';
import { rules } from '@/rules';
import { Notification, uuid, wait } from '@/utils';
import { errorConfirmPassword, errorValidPhone, errorWhiteSpace } from '@/utils/validation';
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import { useWatch } from 'antd/lib/form/Form';
import moment from 'moment';
import React from 'react';
import { DataTypeAccount } from '../component/Account.Config';
import accountService from '../service';
import dayjs from 'dayjs';
import useWindowSize from '@/hooks/useWindowSize';
import { TAB_MOBLIE } from '@/config/theme';
const { Option } = Select;

const initialValue = {
    fullName: '',
    email: '',
    avatar: '',
    phoneNumber: '',
    createdAt: '',
    updatedAt: '',
    password: '',
    type: null,
    dateOfBirth: '',
    gender: null,
    address: '',
    confirmPassword: '',
    gardenId: '',
};

const AccountFormPage = ({
    values,
    modalVisible,
    handleCloseForm,
}: {
    values?: DataTypeAccount | null;
    modalVisible: boolean;
    handleCloseForm: any;
}) => {
    const { state } = useCallContext();
    const [form] = Form.useForm();
    const [file, setFile] = React.useState<any>(null);
    const [loadingModal, setLoadingModal] = React.useState(false);
    const type = useWatch('type', form);
    const { width } = useWindowSize();
    const formReset = () => {
        form.setFieldsValue(initialValue);
    };

    React.useEffect(() => {
        if (values) {
            setLoadingModal(true);
            form.setFieldsValue({
                ...values,
                dateOfBirth: values?.dateOfBirth ? moment(values?.dateOfBirth) : '',
                status: values?.status ? 1 : 0,
            });
            wait(500).then(() => setLoadingModal(false));
            // setStorageArr(newData);
        }
    }, [values]);

    const handleSubmit = React.useCallback(
        async (data: DataTypeAccount) => {
            const dataUpload: any = { ...data };
            // for (const key in dataUpload) {
            //     if (dataUpload[key] === null || dataUpload[key] === '' || dataUpload[key] === undefined) {
            //         delete dataUpload[key];
            //     }
            // }

            if (values) {
                const res = await accountService.update({
                    ...dataUpload,
                    avatar: file || undefined,
                    status: data.status === 1 ? true : false,
                    gardenId: data?.gardenId?.value || data?.gardenId,
                    userId: Number(values?.id),
                    dateOfBirth: data?.dateOfBirth ? dayjs(data?.dateOfBirth).format('YYYY-MM-DD') : null,
                    gender: data?.gender ? data?.gender : null,
                    email: data?.email ? data?.email : undefined,
                    type: 'admin',
                });
                if (res.status) {
                    Notification('success', 'Cập nhật tài khoản thành công');
                    handleCloseForm();
                    formReset();
                }
            } else {
                const res = await accountService.create({
                    ...dataUpload,
                    dateOfBirth: data?.dateOfBirth ? dayjs(data?.dateOfBirth).format('YYYY-MM-DD') : null,
                    avatar: file || undefined,
                    status: true,
                    type: 'admin',
                    phoneNumber: data?.phoneNumber,
                    gardenId: data?.gardenId?.value || data?.gardenId,
                    gender: data?.gender ? data?.gender : null,
                    email: data?.email ? data?.email : undefined,
                });
                if (res.status) {
                    Notification('success', 'Thêm tài khoản thành công');
                    handleCloseForm();
                    formReset();
                }
            }
            setLoadingModal(false);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [values, file]
    );
    return (
        <ModalComponent
            title={values ? 'Cập nhật tài khoản' : 'Thêm tài khoản'}
            modalVisible={modalVisible}
            loading={loadingModal}
            width={800}
        >
            <FormComponent layoutType="vertical" form={form} onSubmit={handleSubmit}>
                <Row style={{ flexDirection: 'row' }} gutter={[20, 0]}>
                    <Col span={width <= TAB_MOBLIE ? 24 : 12}>
                        <Row>
                            <FormItemComponent
                                rules={[rules.required('Vui lòng nhập họ tên !'), rules.validateTitle]}
                                name="fullName"
                                normalize={(value: any) => value.trimStart()}
                                label="Họ tên"
                                inputField={<Input placeholder="Nhập tên" />}
                            />
                            <FormItemComponent
                                rules={[rules.validateEmail]}
                                name="email"
                                normalize={(value: any) => value.trimStart()}
                                label="Email"
                                inputField={<Input autoComplete="off" placeholder="Nhập email" />}
                            />
                            <FormItemComponent
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại !' },
                                    errorValidPhone,
                                    errorWhiteSpace,
                                ]}
                                name="phoneNumber"
                                label="Số điện thoại"
                                normalize={(value: any) => value.trimStart()}
                                inputField={
                                    <Input disabled={!!values} autoComplete="off" placeholder="Nhập số điện thoại" />
                                }
                            />
                            {values && (
                                <FormItemComponent
                                    rules={[rules.required('Vui lòng chọn trạng thái!')]}
                                    name="status"
                                    label="Trạng thái"
                                    inputField={
                                        <Select placeholder="Chọn trạng thái">
                                            <Option value={STATUS.active}>Đang hoạt động</Option>
                                            <Option value={STATUS.unActive}>Ngừng hoạt động</Option>
                                        </Select>
                                    }
                                />
                            )}
                            {!values && (
                                <>
                                    <FormItemComponent
                                        rules={[
                                            rules.required('Vui lòng nhập mật khẩu !'),
                                            {
                                                min: 6,
                                                message: 'Vui lòng nhập từ 6 ký tự!',
                                            },
                                        ]}
                                        name="password"
                                        normalize={(value: any) => value.trimStart()}
                                        label="Mật khẩu"
                                        inputField={<Input.Password autoComplete="off" placeholder="******" />}
                                    />
                                    <FormItemComponent
                                        rules={[rules.required('Vui lòng nhập lại mật khẩu !'), errorConfirmPassword]}
                                        name="confirmPassword"
                                        normalize={(value: any) => value.trimStart()}
                                        label="Xác nhận mật khẩu"
                                        inputField={<Input.Password autoComplete="off" placeholder="******" />}
                                    />
                                </>
                            )}
                        </Row>
                    </Col>

                    <Col span={width <= TAB_MOBLIE ? 24 : 12}>
                        <Row>
                            <FormItemComponent
                                name="dateOfBirth"
                                label="Ngày sinh"
                                inputField={
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        placeholder="Chọn ngày sinh"
                                        style={{ width: '100%', paddingRight: '10px' }}
                                        disabledDate={(current: any) => {
                                            return current && current > moment().endOf('day');
                                        }}
                                    />
                                }
                            />
                            <FormItemComponent
                                name="gender"
                                label="Giới tính"
                                inputField={
                                    <Select
                                        style={{ width: '100%' }}
                                        options={[
                                            { value: GENDER.Male, label: 'Nam' },
                                            { value: GENDER.Female, label: 'Nữ' },
                                            { value: GENDER.Another, label: 'Không xác định' },
                                        ]}
                                        allowClear
                                        placeholder="Giới tính"
                                    />
                                }
                            />
                            <FormItemComponent
                                name="address"
                                label="Địa chỉ"
                                inputField={<Input placeholder="Nhập địa chỉ" />}
                            />

                            <FormItemComponent
                                label="Ảnh đại diện"
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
                                            values?.avatar && [
                                                {
                                                    url: values?.avatar,
                                                    uid: uuid(),
                                                    name: 'avatar',
                                                },
                                            ]
                                        }
                                    />
                                }
                            />
                        </Row>
                    </Col>
                </Row>
                <Row style={{ width: '100%' }} align="bottom">
                    <Space>
                        <Button
                            type="default"
                            onClick={() => {
                                handleCloseForm('notRefresh');
                                formReset();
                            }}
                        >
                            Thoát
                        </Button>
                        <SaveButton htmlType="submit" />
                    </Space>
                </Row>
            </FormComponent>
        </ModalComponent>
    );
};

export default AccountFormPage;
