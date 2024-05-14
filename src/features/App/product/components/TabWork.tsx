import React from 'react';
import { useQuery } from 'react-query';
import { Col, Descriptions, Row, Tag } from 'antd';

import { workService } from '../services';
import { Notification, currencyFormat, momentToStringDate, removeSecondsFromTime } from '@/utils';
import { STATUS_WORK, TYPE_OPTION } from '@/contants';
import styled from 'styled-components';
import ShowMoreText from 'react-show-more-text';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
interface IProps {
    record: any;
    refetch: any;
}
const initialFilterQuery = {};
const TabWork = (props: IProps) => {
    const { record, refetch } = props;
    const [filterQuery, setFilterQuery] = React.useState(initialFilterQuery);
    const [page, setPage] = React.useState(1);
    const navigator = useNavigate();
    const {
        data,
        isLoading,
        refetch: refectchDetail,
        isRefetching,
    } = useQuery<any>(['works', page, filterQuery, record], () =>
        workService.detailWork(record?.id, { page, ...filterQuery })
    );
    const [showAllContent, setShowAllContent] = React.useState(false);

    return (
        <Row>
            <Col span={24}>
                <Descriptions column={2}>
                    <Descriptions.Item label={<b>Tên</b>}>
                        <span style={{ fontWeight: '500' }}>{data?.data?.garden?.name || '---'}</span>
                    </Descriptions.Item>

                    <Descriptions.Item label={<b>Giá</b>}>{data?.data?.garden?.name || '---'}</Descriptions.Item>

                    <Descriptions.Item label={<b>Danh mục</b>}>
                        <span style={{ fontWeight: '500' }}>
                            {record.repeatType === TYPE_OPTION.NONE
                                ? moment(data?.data?.executionDate).format('DD/MM/YYYY')
                                : record.repeatType === TYPE_OPTION.DAYSOFWEEKS
                                ? data?.data?.daysOfWeek.map((assign: any, index: number, array: any[]) => (
                                      <React.Fragment key={assign?.id}>
                                          {assign === 7 ? 'Chủ nhật' : `Thứ ${assign + 1}`}
                                          {index < array.length - 1 && ', '}
                                      </React.Fragment>
                                  ))
                                : data?.data.repeatType === TYPE_OPTION.DAILY
                                ? 'Hằng ngày'
                                : data?.data.exactDates.map((day: any, index: number, array: any[]) => (
                                      <React.Fragment key={day?.id}>
                                          {moment(day).format('DD/MM/YYYY')}
                                          {index < array.length - 1 && ', '}
                                      </React.Fragment>
                                  )) || '---'}
                        </span>
                    </Descriptions.Item>

                    <Descriptions.Item label={<b>Số lượng</b>}>
                        <span style={{ fontWeight: '500' }}>{data?.quantity || '---'}</span>
                    </Descriptions.Item>

                    <Descriptions.Item label={<b>Trạng thái</b>}>
                        <Tag>{data?.data?.createdByUser?.fullName}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={<b>Mô tả</b>}>
                        <span style={{ fontWeight: '500' }}>
                            <ShowMoreText
                                lines={3} // Số dòng hiển thị trước khi ẩn
                                more={<b>Xem thêm</b>}
                                less={<b>Thu gọn</b>}
                                anchorClass=""
                                width={400}
                            >
                                {data?.data?.content || '---'}
                            </ShowMoreText>
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<b>Hình ảnh</b>}>
                        <img src={data?.image} width={100} height={100}></img>
                    </Descriptions.Item>
                </Descriptions>
            </Col>
        </Row>
    );
};

export default TabWork;
const ColStyled = styled(Descriptions.Item)``;
