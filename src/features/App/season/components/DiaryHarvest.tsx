import { Button, Card, Col, Descriptions, Image, Modal, Row, Tag } from 'antd';
import React from 'react';
import { useQuery } from 'react-query';
import { seasonsService } from '../services';
import { IFilter } from '@/types';
import { Notification, momentToStringDate } from '@/utils';
import ModalAddDiary from './ModalAddDiary';
import moment from 'moment';
import IconAntd from '@/components/IconAntd';
import FilterDiary from './FilterDiary';
import styled from 'styled-components';
import { STATUS_SEASON } from '@/contants';
import { images } from '@/assets/imagesAssets';
import { TAB_MOBLIE } from '@/config/theme';
import useWindowSize from '@/hooks/useWindowSize';
const initialFilterQuery = {};
interface IProps {
    values: any;
    key: string;
    navigate_id?: any;
    refetchData?: any;
}
export const DiaryHarvest = (props: IProps) => {
    const { values, key, navigate_id, refetchData } = props;
    const [filterQuery, setFilterQuery] = React.useState(initialFilterQuery);
    const [page, setPage] = React.useState(1);
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [dataRecord, setDataRecord] = React.useState();

    const { width } = useWindowSize();
    const {
        data: Diary,
        isLoading,
        refetch,
        isRefetching,
    } = useQuery<any>(['getDiaryHarvest', page, filterQuery, key, navigate_id], () =>
        seasonsService.getDiaryHarvest({ page, ...filterQuery }, navigate_id ? navigate_id : Number(values?.data?.id))
    );
    React.useEffect(() => {
        refetch();
        refetchData();
    }, [navigate_id, Number(values?.data?.id)]);

    const returnFilter = React.useCallback(
        (filter: IFilter) => {
            setPage(1);
            setFilterQuery({ ...filterQuery, ...filter });
        },
        [filterQuery]
    );

    const NameList = (names: any[]) => {
        let displayNames;

        if (names.length <= 3) {
            displayNames = names?.map((it) => it?.name).join(', ');
        } else {
            const truncatedNames = names.slice(0, 3);
            displayNames = truncatedNames?.map((it) => it?.name).join(', ') + '...';
        }

        return <span>{displayNames}</span>;
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <FilterDiary returnFilter={returnFilter} key="filter" />
                {values?.data?.status === STATUS_SEASON.InActive ? (
                    <></>
                ) : (
                    <Button
                        type="primary"
                        onClick={() => {
                            setModalVisible(true);
                        }}
                    >
                        Thêm mới
                    </Button>
                )}
            </div>
            {Diary?.data?.length ? (
                Diary?.data?.map((item: any) => {
                    const daysFromCreatedAtToActualStart = moment(item?.createdAt).diff(
                        moment(item?.season?.actualStart),
                        'days'
                    );
                    const daysWithExtraDay = daysFromCreatedAtToActualStart + 1;
                    return (
                        <Card
                            key={item?.id}
                            size="small"
                            title={<strong>{item?.createdByUser?.fullName}</strong>}
                            extra={
                                <>
                                    {values?.data?.status === STATUS_SEASON.InActive ? (
                                        <></>
                                    ) : (
                                        <Button
                                            type="link"
                                            icon={<IconAntd icon="EditOutlined" />}
                                            onClick={() => {
                                                setDataRecord(item);
                                                setModalVisible(true);
                                            }}
                                        />
                                    )}
                                    <Button
                                        onClick={() => {
                                            Modal.confirm({
                                                title: 'Xóa nhật ký',
                                                content: 'Bạn có chắc chắn muốn xoá nhật ký này?',
                                                onOk: async () => {
                                                    await seasonsService
                                                        .deleteDiary({ diaryId: Number(item?.id) })
                                                        .then((res) => {
                                                            if (res?.status) {
                                                                refetch();
                                                                Notification('success', 'Xoá nhật ký thành công');
                                                            }
                                                        });
                                                },
                                            });
                                        }}
                                        type="link"
                                        icon={<IconAntd icon="DeleteOutlined" />}
                                    />
                                </>
                            }
                            style={{ width: '100%' }}
                        >
                            <Row>
                                <Col span={width <= TAB_MOBLIE ? 24 : 18}>
                                    <DescriptionStyled
                                        title={`Ngày ${daysWithExtraDay} - ${moment(item?.createdAt)
                                            .utcOffset(7)
                                            .format('HH:mm DD/MM/YYYY')}`}
                                        column={1}
                                    >
                                        <Descriptions.Item label="Khu vực">
                                            {NameList(item?.areas) || '--'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Luống">
                                            {NameList(item?.plantbeds) || '--'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Công việc">
                                            <Tag color="green">{item?.task?.name}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Nội dung">
                                            <div style={{ whiteSpace: 'pre-wrap' }}>{item?.content}</div>
                                        </Descriptions.Item>
                                    </DescriptionStyled>
                                    {item?.images?.map((it: any) => {
                                        return (
                                            <span>
                                                <Image
                                                    style={{ width: '150px', height: '150px', margin: '10px' }}
                                                    src={it}
                                                />
                                            </span>
                                        );
                                    })}
                                </Col>
                                <Col span={width <= TAB_MOBLIE ? 24 : 6}>
                                    <div
                                        style={{
                                            margin: '10px 0',
                                            maxHeight: '250px',
                                            boxShadow:
                                                'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
                                        }}
                                    >
                                        <video style={{ width: '100%', height: '200px' }} controls>
                                            <source src={item?.video} type="video/mp4" />
                                        </video>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    );
                })
            ) : (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column-reverse',
                        alignItems: 'center',
                        marginTop: '20px',
                    }}
                >
                    {/* <Image preview={false} width={200} src={images.noData} /> */}
                    <h3 style={{ fontWeight: '700' }}>Không có nhật ký</h3>
                </div>
            )}
            <ModalAddDiary
                dataRecord={dataRecord}
                refetch={refetch}
                openModal={modalVisible}
                values={values}
                setModalVisible={setModalVisible}
                setDataRecord={setDataRecord}
            />
        </div>
    );
};

const DescriptionStyled = styled(Descriptions)`
    & .ant-descriptions-item-label {
        font-weight: bold;
    }
    & .ant-descriptions-item-content {
        font-weight: 500;
    }
`;
