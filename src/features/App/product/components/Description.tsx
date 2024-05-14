import { Avatar, Card, Row, Tabs, TabsProps } from 'antd';
import React from 'react';
import { DataType } from './Work.Config';
import TabWork from './TabWork';

interface IProps {
    record: DataType;
    refetch: any;
    expanded: any;
}

const Description: React.FC<IProps> = ({ record, refetch, expanded }) => {
    const onChange = (key: string) => {};
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thông tin',
            children: <TabWork record={record} refetch={refetch} />,
        },
    ];
    return (
        <Card>
            <Row>
                <Tabs style={{ width: '100%' }} defaultActiveKey="1" items={items} onChange={onChange} />
            </Row>
        </Card>
    );
};

export default React.memo(Description);
