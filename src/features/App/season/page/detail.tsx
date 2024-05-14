import CardComponent from '@/components/CardComponent';
import TopBar from '@/components/TopBar';
import { Button, Tabs, TabsProps } from 'antd';
import React from 'react';
import styled from 'styled-components';
import GeneralInformation from '../components/GeneralInformation';
import PlantingInformation from '../components/PlantingInformation';
import Container from '@/layout/Container';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { seasonsService } from '../services';
import { useQuery } from 'react-query';
import { STATUS_SEASON } from '@/contants';
import { Notification } from '@/utils';
import useCallContext from '@/hooks/useCallContext';

const SeasonDetail = () => {
    const location = useLocation();
    const { state } = useCallContext();
    const navigator = useNavigate();
    const { id } = useParams();
    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['seasonsDetail', id], () =>
        seasonsService.detail(Number(id))
    );
    React.useEffect(() => {
        refetch();
    }, [location, state?.callbackNoti]);
    const onChange = (key: string) => {};
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'THÔNG TIN CHUNG',
            children: <GeneralInformation data={data} />,
        },
        {
            key: '2',
            label: 'THÔNG TIN GIEO TRỒNG',
            children: <PlantingInformation data={data} refetch={refetch} />,
        },
    ];
    const handleDelete = async () => {
        const res = await seasonsService.delete({ seasonId: Number(id) });
        if (res.status) {
            Notification('success', 'Xóa thành công');
            navigator(`/season`);
        }
    };
    return (
        <>
            <TopBar
                back
                title={'Chi tiết vụ mùa'}
                extra={[
                    <>
                        <Button
                            type="primary"
                            onClick={() => {
                                navigator(`/season/edit/${id}`);
                            }}
                        >
                            Cập nhật
                        </Button>
                        {data?.data?.status === STATUS_SEASON.InProgress ? (
                            <Button onClick={handleDelete} danger>
                                Xóa
                            </Button>
                        ) : (
                            <></>
                        )}
                    </>,
                ]}
            />
            <Container>
                <CardComponent
                    title={data?.data?.name || ''}
                    extra={
                        data?.data?.status === STATUS_SEASON.InProgress ? (
                            <DivStyledCompleted>Đang trồng</DivStyledCompleted>
                        ) : data?.data?.status === STATUS_SEASON.Completed ? (
                            <DivStyled>Hoàn thành</DivStyled>
                        ) : data?.data?.status === STATUS_SEASON.InActive ? (
                            <DivStyled>Dừng canh tác</DivStyled>
                        ) : (
                            ''
                        )
                    }
                >
                    <Tabs defaultActiveKey={location?.state?.isFromNoti || '1'} items={items} onChange={onChange} />
                </CardComponent>
            </Container>
        </>
    );
};
const DivStyled = styled.div`
    padding: 10px;
    background: #ff5722;
    color: #ffff;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
`;
const DivStyledCompleted = styled.div`
    padding: 10px;
    background: green;
    color: #ffff;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
`;
export default SeasonDetail;
