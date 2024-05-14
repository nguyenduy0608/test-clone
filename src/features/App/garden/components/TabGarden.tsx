import TableComponent from '@/components/TableComponent';
import React from 'react';
import { columnsGarden } from './Garden.Config';
import { Button, Col, Input, Modal, Row } from 'antd';
import { useQuery } from 'react-query';
import { gardenService } from '../services';
import SearchInput from '@/components/SearchInput';
import IconAntd from '@/components/IconAntd';
import { Notification } from '@/utils';

interface IProps {
    record: any;
    refetch: any;
}
const initialFilterQuery = {};
const TabGarden = (props: IProps) => {
    const { record, refetch } = props;
    const [filterQuery, setFilterQuery] = React.useState(initialFilterQuery);
    const [page, setPage] = React.useState(1);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [inputNote, setInputNote] = React.useState<string>('');
    const {
        data,
        isLoading,
        refetch: refectchDetail,
        isRefetching,
    } = useQuery<any>(['gardens', page, filterQuery, record], () =>
        gardenService.detailArea(record?.id, { page, ...filterQuery })
    );

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        const dataUpload = {
            gardenId: record?.id,
            content: inputNote || record.note,
        };
        await gardenService.note(dataUpload).then((res) => {
            if (res?.status) {
                Notification('success', 'Cập nhật ghi chú thành công');
                refetch();
            }
        });
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <TableComponent
                reLoadData={refectchDetail}
                header={
                    <SearchInput
                        style={{ width: '25%' }}
                        onChangeSearch={(search) => setFilterQuery({ search })}
                        placeholderSearch="Nhập khu vực/luống"
                    />
                }
                showTotalResult
                loading={isRefetching || isLoading}
                page={page}
                rowSelect={false}
                onChangePage={(_page) => setPage(_page)}
                // expandedRowRender={rowRender}
                // onRowSelection={onRowSelection}
                dataSource={data?.data?.areasInGarden}
                columns={columnsGarden(page)}
                total={data?.data && data?.paging?.totalItem}
                footer={() => (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>Tổng khu vực: {data?.data?.countAreas}</strong>
                        <strong>Tổng số luống: {data?.data?.countPlantbeds}</strong>
                    </div>
                )}
            />
            {record?.note?.length > 100 ? (
                <Row style={{ marginTop: '10px', marginLeft: '10px' }}>
                    <Col span={1.5}>
                        <strong>Ghi chú:</strong>
                    </Col>
                    <Col span={21}>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{record?.note}</div>
                    </Col>

                    <Col span={0.5}>
                        <Button
                            style={{ paddingBottom: 16 }}
                            type="link"
                            icon={<IconAntd icon={'EditOutlined'} />}
                            onClick={showModal}
                        ></Button>
                    </Col>
                </Row>
            ) : (
                <div style={{ marginTop: '10px', marginLeft: '10px', display: 'flex' }}>
                    <strong>Ghi chú:</strong>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{record?.note}</div>
                    <Button
                        style={{ paddingBottom: 16 }}
                        type="link"
                        icon={<IconAntd icon={'EditOutlined'} />}
                        onClick={showModal}
                    ></Button>
                </div>
            )}

            <Modal title="Ghi chú" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Input.TextArea
                    defaultValue={record?.note}
                    onChange={(e) => setInputNote(e.target.value)}
                    placeholder="Nhập ghi chú"
                    style={{ width: '100%', minHeight: '200px' }}
                />
            </Modal>
        </>
    );
};

export default TabGarden;
