export const Nhomsanpham = (x1: any) => {
    return {
        chart: {
            type: 'column',
            title: {
                // Thêm title trống để tắt đi
                text: '',
            },
        },
        title: {
            text: '',
            align: 'left',
        },
        xAxis: {
            categories: [
                'Truyện trinh thám',
                'Truyện kinh dị',
                'Truyện hành động',
                'Truyện hài kịch',
                'Truyện tình cảm',
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
                colors: ['#00e887'],
                name: 'Danh mục sản phẩm',
                data: x1, // 12 phần tử
            },
        ],
    };
};
