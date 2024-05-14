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
import React, { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
// import bcrypt from 'bcrypt';
import accountService from '@/features/App/account/service';
const { Option } = Select;

const initialValue = {
    confirm_password: '',
    new_password: '',
    old_password: '',
};

const ResetPassModal = ({ modalVisible, handleCloseForm }: { modalVisible: boolean; handleCloseForm: any }) => {
    const { state } = useCallContext();
    const [form] = Form.useForm();
    const [loadingModal, setLoadingModal] = React.useState(false);
    const [checkPassWord, setCheckPassWord] = React.useState(true);
    const type = useWatch('type', form);
    const formReset = () => {
        form.setFieldsValue(initialValue);
    };

    const useDebounce = (func: any, delay: any) => {
        const debouncedFunc = useCallback(
            debounce((...args) => func(...args), delay),
            [func, delay]
        );

        return debouncedFunc;
    };
    const handleSubmit = async (data: any) => {
        const dataUpload: any = { ...data };

        const res = await accountService.changePassWord({
            old_password: data.old_password,
            confirm_password: data.confirm_password,
            new_password: data?.new_password,
        });
        if (res.status) {
            Notification('success', 'Đổi mật khẩu thành công');
            handleCloseForm();
            formReset();
        }
    };
    const handleCheckPassword = async (value: any) => {
        try {
            const res = await accountService.getOldPass(value);
            const isValid = res?.data?.isPasswordRight;

            form.setFields([
                {
                    name: 'old_password',
                    errors: isValid ? [] : ['Vui lòng nhập đúng mật khẩu cũ!'],
                },
            ]);

            return isValid; // Trả về giá trị để sử dụng trong hàm validator của rule
        } catch (error) {
            console.error('Error checking password:', error);
            form.setFields([{ name: 'old_password', errors: ['Có lỗi xảy ra khi kiểm tra mật khẩu'] }]);
            return false; // Hoặc xử lý trường hợp lỗi khác nếu cần
        }
    };

    const debouncedCheckPassword = useDebounce(handleCheckPassword, 800); // 1000 milligiây là thời gian debounce
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedCheckPassword(e.target.value);
    };
    useEffect(() => {
        return () => {
            debouncedCheckPassword.cancel();
        };
    }, [debouncedCheckPassword]);
    return (
        <ModalComponent title={'Đổi mật khẩu'} modalVisible={modalVisible} loading={loadingModal} width={400}>
            <FormComponent layoutType="vertical" form={form} onSubmit={handleSubmit}>
                <Row style={{ flexDirection: 'row' }} gutter={[20, 0]}>
                    <Col span={24}>
                        <Row>
                            <FormItemComponent
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu cũ !' },
                                    errorWhiteSpace,
                                    { min: 6, message: 'Cần nhập ít nhất 6 ký tự.' },
                                    async (_: any, value: string) => {
                                        return {
                                            validator(_: any, value: string) {
                                                if (!checkPassWord) {
                                                    return Promise.reject(new Error('Vui lòng nhập đúng mật khẩu cũ!'));
                                                }
                                                return Promise.resolve();
                                            },
                                        };
                                    },
                                ]}
                                name="old_password"
                                label="Mật khẩu cũ"
                                normalize={(value: any) => value.trimStart()}
                                inputField={
                                    <Input.Password
                                        autoComplete="off"
                                        placeholder="Nhập mật khẩu cũ"
                                        onChange={handleInputChange}
                                    />
                                }
                            />
                            <FormItemComponent
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu mới !' },
                                    { min: 6, message: 'Mật khẩu mới cần ít nhất 6 ký tự.' },
                                    ({ getFieldValue }: any) => ({
                                        validator(_: any, value: any) {
                                            const oldPassword = getFieldValue('old_password');
                                            if (oldPassword && oldPassword === value) {
                                                return Promise.reject(
                                                    new Error('Mật khẩu mới không được giống mật khẩu cũ!')
                                                );
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                    errorWhiteSpace,
                                ]}
                                name="new_password"
                                label="Mật khẩu mới"
                                normalize={(value: any) => value.trimStart()}
                                inputField={<Input.Password autoComplete="off" placeholder="Nhập mật khẩu mới" />}
                            />
                            <FormItemComponent
                                rules={[
                                    rules.required('Vui lòng xác nhận mật khẩu!'),
                                    { min: 6, message: 'Nhâp lại mật khẩu mới cần ít nhất 6 ký tự.' },
                                    ({ getFieldValue }: any) => ({
                                        validator(_: any, value: any) {
                                            if (!value || getFieldValue('new_password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu nhập lại không trùng khớp!'));
                                        },
                                    }),
                                ]}
                                name="confirm_password"
                                label="Nhập lại mật khẩu mới"
                                normalize={(value: any) => value.trimStart()}
                                inputField={<Input.Password autoComplete="off" placeholder="Nhập lại mật khẩu mới" />}
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

export default ResetPassModal;
