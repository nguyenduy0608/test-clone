import { currencyFormat } from '@/utils';
interface PointFormatterContext {
    series: {
        color: string;
        name: string;
    };
    y: number;
}
interface FormatterContext {
    value: number;
}
export const OptionsChartTongthu = ({ dataName, dataX1, dataX2 }: any) => {
    return {
        chart: {
            type: 'spline',
        },
        title: {
            text: '<span style="font-size: 20px; ">Tổng thu</span>',
            align: 'center',
        },
        subtitle: {},
        xAxis: {
            categories: date,
            accessibility: {
                description: 'Thời gian trong năm',
            },
            labels: {
                style: {
                    fontSize: '14px', // Điều chỉnh kích thước chữ cho trục X
                },
            },
        },
        credits: {
            enabled: false, // Ẩn chữ highcharts.com
        },
        yAxis: {
            title: {
                text: 'Số tiền',
                style: {
                    fontSize: '14px',
                },
            },
            labels: {
                format: '{value}', // Giữ nguyên giá trị, vì đã thực hiện định dạng trong hàm currencyFormat
                formatter: function (this: FormatterContext): string {
                    return currencyFormat(this.value);
                },
                style: {
                    fontSize: '14px',
                },
            },
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            headerFormat: '<b>{point.x}</b><br>',
            pointFormatter: function (this: PointFormatterContext): string {
                return `<span style="color:${this.series.color}">\u25CF</span> ${this.series.name}: ${this.y.toFixed(
                    1
                )}`;
            },
            style: {
                fontSize: '16px',
            },
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: ['#f50', '#00e887'],
                    lineWidth: 1,
                },
            },
        },
        series: [
            {
                name: 'Ngày',
                marker: {
                    symbol: 'diamond',
                },
                data: dataX2,
                color: '#00e887',
                dataLabels: {
                    style: {
                        fontSize: '16px', // Điều chỉnh kích thước chữ cho nhãn dữ liệu trên biểu đồ
                    },
                },
            },
        ],
    };
};
const date = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
];
const quantity = [1, 12, 4, 10, 3, 15, 13, 10, 4, 6, 23, 5];
