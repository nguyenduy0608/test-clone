import { TimeType } from '@/contants';
import { disabledDate } from '@/utils';
import { ConfigProvider, DatePicker, Tooltip } from 'antd';
import 'moment/locale/vi';
import React from 'react';
import styled from 'styled-components';
const { RangePicker } = DatePicker;
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
const dateFormat = 'DD/MM/YYYY';
// moment.locale('vi');

const RangerPicker = ({
    name,
    onChange,
    tooltipTitle = 'Lọc theo thời gian',
    placeholderStart = 'Từ thời gian',
    placeholderEnd = 'Đến thời gian',
    defaultValue,
    disabledDates,
    valueOptions,
    ...props
}: {
    name: string;
    onChange: any;
    tooltipTitle?: string;
    placeholderStart?: string;
    placeholderEnd?: string;
    defaultValue?: any;
    disabledDates?: any;
    valueOptions?: any;
    props?: { dependencies: any };
}) => {
    const getPopupContainer = (trigger: any) => {
        return trigger.parentNode; // Thay đổi vị trí hiển thị của tooltip tại đây
    };
    return (
        <ConfigProvider
        // locale={locale}
        >
            <Tooltip title={tooltipTitle} style={{ width: '100%' }}>
                <RangePickerStyled
                    onChange={(date: any, dateStrings: string[]) => {
                        return onChange(
                            date,
                            date
                                ? `${dateStrings[0].split('/').reverse().join('-')},${dateStrings[1]
                                      .split('/')
                                      .reverse()
                                      .join('-')}`
                                : ''
                        );
                    }}
                    getPopupContainer={getPopupContainer}
                    placeholder={[placeholderStart, placeholderEnd]}
                    defaultValue={defaultValue}
                    format={dateFormat}
                    picker={
                        valueOptions === TimeType.WEEK
                            ? 'week'
                            : valueOptions === TimeType.MONTH
                            ? 'month'
                            : valueOptions === TimeType.QUARTER
                            ? 'quarter'
                            : valueOptions === TimeType.YEAR
                            ? 'year'
                            : 'date'
                    }
                    disabledDate={disabledDates && disabledDate}
                    {...props}
                />
            </Tooltip>
        </ConfigProvider>
    );
};

export default React.memo(RangerPicker);
const RangePickerStyled = styled(RangePicker)`
    width: 100%;
`;
