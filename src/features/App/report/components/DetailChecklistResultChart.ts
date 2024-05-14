interface FormatterContext {
    point: any;
}
export const totalResultParams = (data?: any, setIsPassClicked?: any) => {
    // Tạo mảng màu dynamic cho các ô khác
    const fixedColors = [
        '#FF0000',
        '#FF7F00',
        '#FFFF00',
        '#00FF00',
        '#00FFFF',
        '#8B00FF',
        '#FF00FF',
        '#FF6347',
        '#FF4500',
        '#FFD700',
        '#9ACD32',
        '#7FFF00',
        '#32CD32',
        '#228B22',
        '#808000',
        '#2E8B57',
        '#008000',
        '#20B2AA',
        '#008080',
        '#4682B4',
        '#000080',
        '#4B0082',
        '#800080',
        '#CD5C5C',
        '#F08080',
        '#FA8072',
        '#E9967A',
        '#FFA07A',
        '#DC143C',
        '#FF8C00',
        '#FFA500',
        '#FFD700',
        '#FFFF00',
        '#ADFF2F',
        '#7CFC00',
        '#7FFF00',
        '#32CD32',
        '#00FF00',
        '#00FA9A',
        '#90EE90',
        '#00FF7F',
        '#3CB371',
        '#2E8B57',
        '#808000',
        '#008000',
        '#556B2F',
        '#6B8E23',
        '#FAEBD7',
        '#FFE4B5',
        '#FFDAB9',
        '#FFEFD5',
        '#FFE4E1',
        '#FFA07A',
        '#FF7F50',
        '#FF6347',
        '#FF4500',
        '#FF0000',
        '#FF69B4',
        '#FF1493',
        '#DB7093',
        '#C71585',
        '#BA55D3',
        '#800080',
        '#8A2BE2',
        '#4B0082',
        '#483D8B',
        '#000080',
        '#7B68EE',
        '#6A5ACD',
        '#4169E1',
        '#4682B4',
        '#00BFFF',
        '#87CEEB',
        '#87CEFA',
        '#00BFFF',
        '#1E90FF',
        '#6495ED',
        '#7B68EE',
        '#4169E1',
        '#0000FF',
        '#0000CD',
        '#00008B',
        '#000080',
        '#191970',
        '#8B008B',
        '#800080',
        '#4B0082',
        '#8A2BE2',
        '#9370DB',
        '#DDA0DD',
        '#DA70D6',
        '#FF00FF',
        '#FF00FF',
        '#BA55D3',
        '#9370DB',
        '#8A2BE2',
        '#9400D3',
        '#9932CC',
        '#8B008B',
        '#800080',
        '#4B0082',
        '#6A5ACD',
        '#483D8B',
    ];
    const colors = data?.map((item: any) =>
        item?.name === 'Dừng canh tác'
            ? '#f50'
            : item?.name === 'Hoàn thành'
            ? '#0fb4ed'
            : fixedColors[data?.indexOf(item)]
    );
    // Kết hợp hai mảng màu lại với nhau
    return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            style: {
                fontFamily: 'Poppins, sans-serif',
            },
            type: 'pie',
        },
        title: {
            text: 'Thống kê vụ mùa',
            style: {
                color: '#064161',
                fontSize: '20px',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '20px',
            },
        },
        tooltip: {
            formatter: function (this: FormatterContext): string {
                return `<b>${this?.point.name}</b>: ${this?.point.y} đợt`;
            },
            // Thêm style cho tooltip
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
        credits: {
            enabled: false,
        },
        accessibility: {
            point: {
                valueSuffix: '%',
            },
        },
        colors: colors,
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
                name: 'Chiếm',
                colorByPoint: true,
                data: data,
            },
        ],
    };
};
