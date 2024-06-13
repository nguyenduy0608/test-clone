export const Column = ({ x1, x2 }: any) => {
    return {
        chart: {
            type: 'column',
        },
        title: {
            text: '',
            align: 'left',
        },
        xAxis: {
            categories: [
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
            ],
            accessibility: {
                description: 'Countries',
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Số lượng',
            },
        },
        tooltip: {
            valueSuffix: ' (1000 MT)',
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
            },
        },
        series: [
            {
                name: 'Chi phí',
                data: x1, // 12 phần tử
            },
            {
                name: 'Lợi nhuận',
                data: x2, // 12 phần tử
            },
        ],
    };
};
