import { LikeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import React from 'react';
import { Avatar, Button, List, Popconfirm, Space, Tag } from 'antd';
import { images } from '@/assets/imagesAssets';
import { Notification, momentToStringDate } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { documentService } from '../services';
import IconAntd from '@/components/IconAntd';
import { NEWS_STATUS } from '@/contants';

interface IProps {
    data: any;
    refetch: any;
}
const ItemDocument = (props: IProps) => {
    const { data, refetch } = props;
    const navigator = useNavigate();
    return (
        <List
            itemLayout="vertical"
            size="large"
            pagination={{
                onChange: (page) => {
                },
                pageSize: 12,
            }}
            dataSource={data?.data}
            renderItem={(item: any) => (
                (
                    <List.Item
                        key={item.id}
                        actions={[
                            <div style={{marginTop: '10px'}}>
                                <Button
                                    style={{ border: 'none' }}
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        navigator(`/document/form/${item?.id}`);
                                    }}
                                />
                                <Popconfirm
                                    placement="left"
                                    onConfirm={async () => {
                                        await documentService.delete({ documentId: Number(item.id) }).then((res) => {
                                            if (res.status) {
                                                refetch();
                                                Notification('success', 'Xoá tài liệu thành công');
                                            }
                                        });
                                    }}
                                    title="Bạn có chắc chắn muốn xoá?"
                                >
                                    <Button style={{ border: 'none' }} icon={<IconAntd icon="DeleteOutlined" />} />
                                </Popconfirm>
                            </div>,
                        ]}
                        extra={<video width={272} src={item?.video} />}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.thumbnail || images.avatar} />}
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between',width: '25%' }}>
                                    <div>{item.id}</div>
                                    <div>
                                        <Tag color="#cd201f">{item?.status === NEWS_STATUS.POST ? "Đăng bài" : "Lưu nháp"}</Tag>
                                    </div>
                                </div>
                            }
                            description={momentToStringDate(item.createdAt, 'dateTime')}
                        />
                        <div>
                            {item?.gardens?.map((it: any) => (
                                <Tag color="success">{it?.name}</Tag>
                            ))}
                        </div>
                        <strong>Tài liệu: {item.title}</strong>
                    </List.Item>
                )
            )}
        />
    );
};
export default ItemDocument;
