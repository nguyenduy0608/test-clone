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
export const OptionsChartCost = ({ dataName, dataX1, dataX2 }: any) => {
    const maxCategories = 12;
    const shortenedCategories =
        dataName?.length > maxCategories ? dataName?.filter((_: any, index: number) => index % 2 === 0) : dataName;
    return {
        chart: {
            type: 'spline',
        },
        title: {
            text: '',
        },
        subtitle: {},
        xAxis: {
            categories: dataName,
            accessibility: {
                description: 'Thời gian trong năm',
            },
            labels: {
                style: {
                    fontSize: '14px', // Điều chỉnh kích thước chữ cho trục X
                },
            },
            tickInterval: Math?.ceil(dataName?.length / maxCategories),
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
                return `<span style="color:${this.series.color}">\u25CF</span> ${this.series.name}: ${currencyFormat(
                    this.y
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
                name: 'Chi phí',
                marker: {
                    symbol: 'square',
                },
                data: dataX1,
                color: '#f50',
                dataLabels: {
                    style: {
                        fontSize: '16px', // Điều chỉnh kích thước chữ cho nhãn dữ liệu trên biểu đồ
                    },
                },
            },
            {
                name: 'Lợi nhuận',
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
