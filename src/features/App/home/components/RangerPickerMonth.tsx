import { disabledDate } from '@/utils';
import { DatePicker, Tooltip } from 'antd';
import React from 'react';
const { RangePicker } = DatePicker;
import moment from 'moment';
// import 'moment/locale/vi';
import LocaleProvider from 'antd/lib/locale-provider';
const dateFormat = 'MM/YYYY';

// moment.locale('vi');
const DatePickerMonth = ({
    name,
    onChange,
    tooltipTitle = 'Lọc theo tháng',
    placeholderStart = 'Từ tháng',
    placeholderEnd = 'Đến tháng',
    defaultValue,
}: {
    name: string;
    onChange: any;
    tooltipTitle?: string;
    placeholderStart?: string;
    placeholderEnd?: string;
    defaultValue?: any;
}) => {
    return (
        <Tooltip title={tooltipTitle}>
            {/* <LocaleProvider locale={viVN}> */}
            <RangePicker
                // locale={myLocale}
                allowClear={false}
                onChange={(date: any, dateStrings: string[]) => {
                    return onChange(
                        name,
                        date
                            ? `${dateStrings[0].split('/').reverse().join('-')},${dateStrings[1]
                                  .split('/')
                                  .reverse()
                                  .join('-')}`
                            : ''
                    );
                }}
                placeholder={[placeholderStart, placeholderEnd]}
                defaultValue={defaultValue}
                format={dateFormat}
                disabledDate={disabledDate}
                picker="month"
            />
            {/* </LocaleProvider> */}
        </Tooltip>
    );
};

export default React.memo(DatePickerMonth);
