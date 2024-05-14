import CardComponent from '@/components/CardComponent';
import FormComponent from '@/components/FormComponent';
import TopBar from '@/components/TopBar';
import Wrapper from '@/features/Auth/Wrapper';
import Container from '@/layout/Container';
import { Button, Col, Form, Input, Modal, Row, Space, Tabs, TabsProps } from 'antd';
import React, { useState } from 'react';
import SeasonTab from '../components/SeasonTab';
import ExpenseTab from '../components/ExpenseTab';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DataType, SeasonData, seasonsService } from '../services';
import { useQuery } from 'react-query';
import { Notification, wait } from '@/utils';
import moment from 'moment';
import dayjs from 'dayjs';
import HarvestTab from '../components/HarvestTab';
import { STATUS_SEASON, TYPE_FLOWER } from '@/contants';
import { DiaryHarvest } from '../components/DiaryHarvest';
import HarvestTable from '../components/HarvestTable';
import styled from 'styled-components';
import ModalComponent from '@/components/ModalComponent';
import { SET_UNIT } from '@/context/types';
import useCallContext from '@/hooks/useCallContext';
import FormItemComponent from '@/components/FormComponent/FormItemComponent';
import { errorWhiteSpace } from '@/utils/validation';
import SaveButton from '@/components/Button/Save.Button';
import IconAntd from '@/components/IconAntd';
const SeasonEdit = () => {
    const { dispatch, state } = useCallContext();
    const navigator = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [key, setKey] = React.useState<string>('1');
    const [dataHarvest, setDataHarvest] = React.useState<any[]>([]);
    const [timeMany, setTimeMany] = React.useState<any[]>([]);
    const [dataUpload, setDataUpload] = React.useState<any>();
    const [note, setNote] = React.useState<string>('');
    const [form] = Form.useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [isModal, setIsModal] = React.useState<boolean>(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [loadingModal, setLoadingModal] = React.useState(false);

    const { data, isLoading, refetch, isRefetching } = useQuery<any>(['seasonsDetail', id, key], () =>
        seasonsService.detail(Number(id))
    );
    React.useEffect(() => {
        refetch();
    }, [location, state?.callbackNoti]);
    React.useEffect(() => {
        dispatch({
            type: SET_UNIT,
            payload: data?.data?.units,
        });
    }, [data]);
    const onChange = (key: string) => {
        setKey(key);
        form.resetFields();
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'VỤ MÙA',
            children: (
                <SeasonTab id={id} form={form} data={data} key={key} refetch={refetch} setTimeMany={setTimeMany} />
            ),
        },
        {
            key: '2',
            label: 'CHI PHÍ',
            // children: <ExpenseTab form={form} data={data} key={key} />,
            children: <ExpenseTab refetch={refetch} dataHarvest={data} key={key} />,
        },
        {
            key: '3',
            label: 'THU HOẠCH',
            children: <HarvestTab data={data} key={key} setDataHarvest={setDataHarvest} />,
            // children: <HarvestTable datas={data} />
        },
        {
            key: '4',
            label: 'NHẬT KÝ CANH TÁC',
            children: (
                <DiaryHarvest values={data} refetchData={refetch} key={key} navigate_id={location?.state?.navigateId} />
            ),
        },
    ];

    const handleSave = () => {
        form.validateFields().then((values) => {
            // Xử lý logic lưu dữ liệu tùy thuộc vào trường hợp key hiện tại (key)

            switch (key) {
                case '1':
                    let convertTime = [];
                    if (data?.data?.flower?.type === TYPE_FLOWER.PERENNIAL) {
                        convertTime = values?.expectedHarvestStartDates?.map((item: any) =>
                            moment(item).format('YYYY-MM-DD')
                        );
                    }
                    const timeManys = timeMany?.map((item: any) => {
                        if (typeof item?.expectedHarvestStartDates === 'string') {
                            return item?.expectedHarvestStartDates;
                        } else {
                            return moment(item?.expectedHarvestStartDates).format('YYYY-MM-DD');
                        }
                    });

                    const dataUplolad: any = {
                        // ...values,
                        name: values?.name,
                        areaIds: values?.areaIds,
                        usableArea: values?.usableArea,
                        plantbedIds: values?.plantbedIds,
                        unitIds: values?.unitIds,
                        numberOfSeedlings: values?.numberOfSeedlings,
                        plantingDistance: values?.plantingDistance,
                        cuttingLength: Number(values?.cuttingLength) || undefined,
                        numberOfHarvests: values?.numberOfHarvests || undefined,
                        seasonId: Number(id),
                        actualStart: dayjs(values?.actualStart).format('YYYY-MM-DD'),
                        expectedHarvestStartDates:
                            data?.data?.flower?.type === TYPE_FLOWER.GROWN_MANY_TIMES
                                ? timeManys
                                : data?.data?.flower?.type === TYPE_FLOWER.GROW_ONE
                                ? [moment(values?.expectedHarvestStartDates).format('YYYY-MM-DD')]
                                : convertTime,
                        expectedQuantity: Number(values?.expectedQuantity),
                        information: {
                            informationId: data?.data?.information?.id,
                            sowingDate: values?.sowingDate ? dayjs(values?.sowingDate).format('YYYY-MM-DD') : undefined,
                            germinationDate: values?.germinationDate
                                ? dayjs(values?.germinationDate).format('YYYY-MM-DD')
                                : undefined,
                            germinationQuantity: values?.germinationQuantity.toString() || undefined,
                            grownDate: values?.grownDate ? dayjs(values?.grownDate).format('YYYY-MM-DD') : undefined,
                        },
                    };
                    seasonsService.update(dataUplolad).then((res) => {
                        if (res?.status) {
                            Notification('success', 'Cập nhật vụ mùa thành công');
                            navigate(-1);
                        }
                    });
                    // Xử lý lưu dữ liệu cho key === 1
                    break;
                case '2':
                    break;
                case '3':
                    // Xử lý lưu dữ liệu cho key === 3
                    seasonsService.updateHarvest(dataHarvest).then((res) => {
                        if (res?.status) {
                            Notification('success', 'Cập nhật chi phí thành công');
                            // refetch();
                        }
                    });
                    break;
                default:
                    break;
            }
        });
    };
    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 },
        },
    };
    const handleChangeNote = (e: any) => {
        const { value } = e.target;
        if (value.startsWith(' ')) {
            e.target.value = value.trimStart(); // Xóa khoảng trắng đầu tiên
        }

        setNote(value);
    };
    const handleSubmit = async (data: any) => {};
    return (
        <Wrapper loading={loading}>
            <CustomModal
                title={
                    data?.data?.flower?.type === TYPE_FLOWER.GROWN_MANY_TIMES
                        ? data?.data?.harvests?.length === data?.data?.numberOfHarvests
                            ? `Vụ mùa bao gồm ${data?.data?.numberOfHarvests} đợt. Nếu kết thúc đợt thu hoạch này, vụ mùa sẽ được chuyển sang trạng thái hoàn thành. Bạn có chắc chắn muốn kết thúc?`
                            : `Bạn có chắc chắn muốn hoàn thành thu hoạch đợt thứ ${data?.data?.harvests?.length} này không?`
                        : `Bạn có chắc chắn muốn hoàn thành vụ mùa này không?`
                }
                open={modalVisible}
                maskClosable={false}
                closable={false}
                footer={null}
                width={400}
            >
                <FormComponent layoutType="vertical" form={form} onSubmit={handleSubmit}>
                    <Row style={{ width: '100%' }} align="bottom">
                        <Space>
                            <Button
                                type="default"
                                onClick={() => {
                                    setModalVisible(false);
                                    refetch();
                                }}
                            >
                                HỦY
                            </Button>
                            <Button
                                className="gx-mb-0"
                                type="primary"
                                style={{ alignItems: 'center' }}
                                onClick={async () => {
                                    data?.data?.flower?.type === TYPE_FLOWER.GROWN_MANY_TIMES
                                        ? data?.data?.harvests?.length === data?.data?.numberOfHarvests
                                            ? seasonsService.setComplete({ seasonId: Number(id) }).then((res) => {
                                                  if (res?.status) {
                                                      Notification('success', 'Hoàn thành vụ mùa thành công');
                                                      wait(500).then(() => {
                                                          window.location.reload();
                                                      });
                                                  }
                                              })
                                            : seasonsService.harvestComplete({ seasonId: Number(id) }).then((res) => {
                                                  if (res?.status) {
                                                      Notification(
                                                          'success',
                                                          `Hoàn thành đợt thu hoạch thứ ${data?.data?.harvests?.length} thành công`
                                                      );
                                                      wait(500).then(() => {
                                                          window.location.reload();
                                                      });
                                                  }
                                              })
                                        : seasonsService.setComplete({ seasonId: Number(id) }).then((res) => {
                                              if (res?.status) {
                                                  Notification('success', 'Hoàn thành vụ mùa thành công');
                                                  wait(500).then(() => {
                                                      window.location.reload();
                                                  });
                                              }
                                          });
                                }}
                            >
                                OK
                            </Button>
                        </Space>
                    </Row>
                </FormComponent>
            </CustomModal>
            <TopBar
                back
                title="Cập nhật vụ mùa"
                extra={[
                    data?.data?.status === STATUS_SEASON.Completed ? (
                        <DivStyled>Hoàn thành</DivStyled>
                    ) : data?.data?.status === STATUS_SEASON.InActive ? (
                        <DivStyled>Dừng canh tác</DivStyled>
                    ) : (
                        <>
                            <Button
                                disabled={data?.data?.status === STATUS_SEASON.InProgress ? false : true}
                                style={{ background: '#ff4d4f', color: 'white' }}
                                onClick={() => {
                                    setIsModal(true);
                                }}
                            >
                                Dừng canh tác
                            </Button>

                            {data?.data?.harvests?.[data?.data?.harvests.length - 1]?.status === 'completed' ? (
                                <Button
                                    className="gx-mb-0"
                                    style={{ alignItems: 'center' }}
                                    type="primary"
                                    onClick={() => {
                                        Modal.confirm({
                                            title: `Bạn có chắc chắn muốn hoàn thành vụ mùa này không?`,
                                            onOk: async () => {
                                                seasonsService.setComplete({ seasonId: Number(id) }).then((res) => {
                                                    if (res?.status) {
                                                        Notification('success', `Hoàn thành vụ mùa thành công`);
                                                        wait(500).then(() => {
                                                            window.location.reload();
                                                        });
                                                    }
                                                });
                                            },
                                            onCancel: () => {
                                                refetch();
                                            },
                                        });
                                    }}
                                >
                                    Hoàn thành
                                </Button>
                            ) : (
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setModalVisible(true);
                                    }}
                                >
                                    {data?.data?.flower?.type === TYPE_FLOWER.GROWN_MANY_TIMES
                                        ? // ? data?.data?.harvests?.length === data?.data?.numberOfHarvests
                                          //     ? `Hoàn thành vụ mùa `
                                          `Hoàn thành thu hoạch đợt thứ ${data?.data?.harvests?.length}`
                                        : `Hoàn thành vụ mùa `}
                                </Button>
                            )}
                            {data?.data?.flower?.type === TYPE_FLOWER.PERENNIAL &&
                            data?.data?.harvests?.[data?.data?.harvests.length - 1]?.status !== 'completed' ? (
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        Modal.confirm({
                                            title: `Bạn có chắc chắn muốn hoàn thành thu hoạch đợt thứ ${data?.data?.harvests?.length} này không?`,
                                            onOk: async () => {
                                                seasonsService.harvestComplete({ seasonId: Number(id) }).then((res) => {
                                                    if (res?.status) {
                                                        Notification(
                                                            'success',
                                                            `Hoàn thành thu hoạch đợt thứ ${data?.data?.harvests?.length} thành công`
                                                        );
                                                        // refetch();
                                                        wait(500).then(() => {
                                                            window.location.reload();
                                                        });
                                                    }
                                                });
                                            },
                                            onCancel: () => {
                                                refetch();
                                            },
                                        });
                                    }}
                                >
                                    Hoàn thành thu hoạch đợt thứ {data?.data?.harvests?.length}
                                </Button>
                            ) : (
                                <></>
                            )}
                        </>
                    ),
                ]}
            />
            <Container>
                <CardComponent title={data?.data?.name}>
                    <FormComponent form={form} onSubmit={handleSave}>
                        <Tabs
                            defaultActiveKey={location?.state?.isFromNoti || '1'}
                            items={items}
                            onChange={onChange}
                            tabBarExtraContent={
                                key === '4' || key === '2' || key === '3' ? (
                                    <></>
                                ) : (
                                    <>
                                        <Button
                                            danger
                                            onClick={() => {
                                                navigator(-1);
                                            }}
                                        >
                                            Hủy
                                        </Button>
                                        <Button htmlType="submit" type="primary">
                                            Lưu
                                        </Button>
                                    </>
                                )
                            }
                        />
                    </FormComponent>
                </CardComponent>
            </Container>
            <ModalComponent
                modalVisible={isModal}
                title="Dừng canh tác vụ mùa"
                children={
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: '100px',
                        }}
                    >
                        <Input
                            placeholder="Nhập lý do dừng canh tác"
                            value={note.trimStart()}
                            onChange={handleChangeNote}
                        />
                        <Space>
                            <Button
                                type="primary"
                                onClick={async () => {
                                    if (note.trimStart()) {
                                        await seasonsService
                                            .harvestInActive({ seasonId: Number(id), reason: note })
                                            .then((res) => {
                                                if (res?.status) {
                                                    Notification('success', 'Dừng canh tác vụ mùa thành công');
                                                    // refetch();
                                                    wait(500).then(() => {
                                                        window.location.reload();
                                                    });
                                                }
                                            });
                                    } else {
                                        Notification('warning', 'Vui lòng nhập lý do dừng canh tác');
                                    }
                                }}
                            >
                                Lưu
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsModal(false);
                                }}
                                danger
                            >
                                Hủy
                            </Button>
                        </Space>
                    </div>
                }
            />
        </Wrapper>
    );
};

export default SeasonEdit;
const DivStyled = styled.div`
    padding: 10px;
    background: #ff5722;
    color: #ffff;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
`;
const CustomModal = styled(Modal)`
    .ant-modal-header {
        border-bottom: none;
    }
`;
