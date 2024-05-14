import { images } from '@/assets/imagesAssets';
import { ROLE as MYROLE } from '@/contants';
import { momentToStringDate } from '@/utils';
import { Avatar, Card, Col, Descriptions, Image, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { DataTypeAccount } from './Account.Config';
import Buttons from './Buttons';
const API_URL = import.meta.env.VITE_API_URL;
interface IProps {
    record: DataTypeAccount;
    refetch: any;
    handleShowModal?: (record: DataTypeAccount) => void;
}
const ROLE = (value: string) => {
    switch (value) {
        case MYROLE.ROOT_ADMIN:
            return 'Admin quản lý';
        case MYROLE.MANAGER:
            return 'Quản lí';
        case MYROLE.TECHNICIAN:
            return 'Kỹ thuật viên';
        case MYROLE.CARETAKER:
            return 'Nhân viên vườn';
        case MYROLE.MANAGER_TECHNICIAN:
            return 'Quản lí kiêm ktv';
        default:
            return '';
    }
};

const Description: React.FC<IProps> = ({ record, refetch, handleShowModal }) => {
    return (
        <Card className="gx-mb-0" actions={Buttons({ record, handleShowModal, refetch })}>
            <Row>
                <Col span={18}>
                    <Descriptions title="Thông tin tài khoản" column={2}>
                        <Descriptions.Item label="Tên người dùng">{record.fullName || '---'}</Descriptions.Item>
                        <Descriptions.Item label="Email">{record.email || '---'}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{record.phoneNumber || '---'}</Descriptions.Item>
                        <Descriptions.Item label="Giới tính">
                            {record.gender
                                ? record.gender === 'male'
                                    ? 'Nam'
                                    : record.gender === 'female'
                                    ? 'Nữ'
                                    : 'Không xác định'
                                : '---'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">
                            {momentToStringDate(record.dateOfBirth) || '---'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ">{record.address || '---'}</Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col span={6}>
                    <AvatarStyled
                        shape="circle"
                        size={140}
                        icon={<Image preview={false} src={`${record.avatar ? record.avatar : images.logoSideBar}`} />}
                    />
                </Col>
            </Row>
        </Card>
    );
};

const AvatarStyled = styled(Avatar)`
    & .ant-image,
    img.ant-image-img {
        width: 100%;
        height: 100%;
    }
`;

export default React.memo(Description);
