import { Avatar, Card, Row, Tabs, TabsProps } from 'antd';
import React from 'react';
import styled from 'styled-components';
import Buttons from './Buttons';
import { DataType } from './Garden.Config';
import TabGarden from './TabGarden';
import TabUser from './TabUser';
interface IProps {
    record: DataType;
    refetch: any;
    handleShowModal?: (record: DataType) => void;
}

const Description: React.FC<IProps> = ({ record, refetch }) => {
    const onChange = (key: string) => {};
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thông tin luống',
            children: <TabGarden record={record} refetch={refetch}/>,
        },
        {
            key: '2',
            label: 'Nhân viên trong vườn',
            children: <TabUser record={record} />,
        },
    ];
    return (
        // <Card actions={Buttons({ record, refetch })}>
        <Card>
            <Row>
                <Tabs style={{width: '100%'}} defaultActiveKey="1" items={items} onChange={onChange} />
            </Row>
        </Card>
    );
};

export default React.memo(Description);
