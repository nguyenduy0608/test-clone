import { currencyFormat } from '@/utils';

interface PointFormatterContext {
    options: {
        name: string;
    };
    color: string;
    series: {
        color: string;
        data: {
            name: string;
        };
    };
    y: number;
}
interface FormatterContext {
    value: number;
}
interface IDataDonut {
    percentageEmptyDays: number;
    percentagePlantingDays: number;
}
export const OptionsDonutChart = ({ data }: any) => {
    return {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0,
            },
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
        },
        title: {
            text: '<span style="font-size: 20px; ">Tỷ lệ bán hàng</span>',
            align: 'center',
        },

        tooltip: {
            pointFormatter: function (this: PointFormatterContext): string {
                let total = 0;
                if (Array.isArray(this?.series?.data)) {
                    total = this?.series?.data?.reduce((sum: number, point: any) => sum + point.y, 0);
                }
                const percentage = (this.y / total) * 100;
                const formattedPercentage = Number.isInteger(percentage)
                    ? Math.round(percentage)
                    : percentage.toFixed(1);
                return `<span style="color:${this.color}">\u25CF</span> <b>${this.options.name}</b>:  (${formattedPercentage}%)<br/>`;
            },

            headerFormat: '',
            pointFormat: `<span style="color:{point.color}">\u25CF</span> <b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)<br/>`,
            style: {
                fontSize: '16px',
            },
        },

        legend: {
            itemStyle: {
                font: '9pt Trebuchet MS, Verdana, sans-serif',
            },
            itemHoverStyle: {
                color: 'gray',
            },
        },
        accessibility: {
            point: {
                valueSuffix: '%',
            },
        },
        credits: {
            enabled: false, // Ẩn chữ highcharts.com
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<br>{point.y}',
                    distance: -50,
                    filter: {
                        property: 'percentage',
                        operator: '>',
                        value: 4,
                    },
                    style: {
                        fontSize: '18px', // Điều chỉnh kích thước font chữ ở đây
                    },
                },
                showInLegend: true,
            },
        },

        series: [
            {
                minPointSize: 10,
                innerSize: '20%',
                zMin: 0,
                name: 'countries',
                borderRadius: 5,
                data: [
                    {
                        name: 'Tồn kho',
                        y: data?.percentageEmptyDays || 3,
                    },

                    {
                        name: 'Bán chạy',
                        y: data?.percentagePlantingDays || 7,
                    },
                ],
                colors: ['#f50', '#00e887'],
                dataLabels: {
                    enabled: true,
                    format: '{point.percentage:.1f}%',
                    distance: -30,
                    color: 'white',
                    style: {
                        fontSize: '18px', // Điều chỉnh kích thước chữ
                        fontWeight: 'bold', // Đặt chữ in đậm
                    },
                },
            },
        ],
    };
};
