import IconAntd from '@/components/IconAntd';
import { Avatar, Col, Modal, Row } from 'antd';
import { useEffect, useState } from 'react';
import { getDataMember } from '../service/ChatService';

interface Member {
    id: number;
    fullName: string;
    avatar: string;
}

interface ChatHeaderProps {
    name?: string;
    lastSendMessage?: string | number | Date | undefined;
    avatar?: string | null;
    isLoading: boolean;
    phone?: number;
    id?: string | number;
}

function ChatHeader({ name, lastSendMessage, avatar, isLoading, phone, id }: ChatHeaderProps) {
    const [members, setMembers] = useState<Member[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await getDataMember(id);
                const data = response?.data;
                setMembers(data);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };
        fetchMembers();
    }, [id]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const content = (
        <Col>
            {members?.map((member) => (
                <Row key={member?.id}>
                    <Avatar
                        size={24}
                        src={member?.avatar ? member?.avatar : ''}
                        icon={<IconAntd icon={'UserOutlined'} />}
                    />
                    <span>{member?.fullName}</span>
                </Row>
            ))}
        </Col>
    );

    return (
        <Row
            align="middle"
            style={{
                height: '10%',
                width: '100%',
            }}
        >
            <Col lg={1} md={1} xs={2}>
                {/* Use Tooltip to display members on hover */}
                {/* <Tooltip title={content} onClick={showModal}>
                    <Row justify="center" style={{ width: '100%', height: '100%', paddingLeft: 20 }}>
                        <Avatar size={40} src={avatar ? avatar : ''} icon={<IconAntd icon={'UserOutlined'} />} />
                    </Row>
                </Tooltip> */}
                <Modal
                    width="30%"
                    title="Danh sách thành viên"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    {content}
                </Modal>
            </Col>
            <Col lg={21} md={21} xs={20}>
                <Row>
                    <strong
                        style={{
                            fontSize: 'large',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {name}
                    </strong>
                </Row>
                <Row>
                    <span onClick={showModal} style={{ fontSize: 'small' }}>
                        {lastSendMessage as String} thành viên
                    </span>
                </Row>
            </Col>
        </Row>
    );
}

export default ChatHeader;
