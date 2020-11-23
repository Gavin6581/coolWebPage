$(function () {
    var dom = document.getElementById("container5");
    var myChart = echarts.init(dom);
    var app = {};
    
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#283b56'
                }
            }
        },
        legend: {
            data: ['交易笔数', '交易金额'],
            textStyle: {
                color: "#ccc"
            }
        },

        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                axisLine: {
                    lineStyle: {
                        color: "#ccc",
                        width: 1
                    }
                },
                axisLabel: {
                    margin: 14,
                    height: 70,
                    interval: 0,
                    textStyle: {
                        fontSize: 10,
                        color: "#ccc"
                    }
                },
                axisLabel: {
                    interval: 0,
                    formatter: function (value) {
                        var ret = "";//拼接加\n返回的类目项
                        var maxLength = 3;//每项显示文字个数
                        var valLength = value.length;//X轴类目项的文字个数
                        var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                        if (rowN > 1)//如果类目项的文字大于3,
                        {
                            for (var i = 0; i < rowN; i++) {
                                var temp = "";//每次截取的字符串
                                var start = i * maxLength;//开始截取的位置
                                var end = start + maxLength;//结束截取的位置
                                //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                                temp = value.substring(start, end) + "\n";
                                ret += temp; //凭借最终的字符串
                            }
                            return ret;
                        }
                        else {
                            return value;
                        }
                    },
                    margin: 14,
                    height: 70,
                    interval: 0,
                    textStyle: {
                        fontSize: 10,
                        color: "#ccc"
                    }
                },
                data: (function () {
                    var now = new Date();
                    var res = [];
                    var len = 30;
                    while (len--) {
                        res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
                        now = new Date(now - 2000);
                    }
                    return res;
                })()
            },
            {   
                show:false,
                type: 'category',
                boundaryGap: true,
                axisLine: {
                    lineStyle: {
                        color: "#ccc",
                        width: 1
                    }
                },
                axisLabel: {
                    margin: 14,
                    height: 70,
                    interval: 0,
                    textStyle: {
                        fontSize: 10,
                        color: "#ccc"
                    }
                },
                axisLabel: {
                    interval: 0,
                    formatter: function (value) {
                        var ret = "";//拼接加\n返回的类目项
                        var maxLength = 3;//每项显示文字个数
                        var valLength = value.length;//X轴类目项的文字个数
                        var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                        if (rowN > 1)//如果类目项的文字大于3,
                        {
                            for (var i = 0; i < rowN; i++) {
                                var temp = "";//每次截取的字符串
                                var start = i * maxLength;//开始截取的位置
                                var end = start + maxLength;//结束截取的位置
                                //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                                temp = value.substring(start, end) + "\n";
                                ret += temp; //凭借最终的字符串
                            }
                            return ret;
                        }
                        else {
                            return value;
                        }
                    },
                    margin: 14,
                    height: 70,
                    interval: 0,
                    textStyle: {
                        fontSize: 10,
                        color: "#ccc"
                    }
                },
                data: (function () {
                    var res = [];
                    var len = 30;
                    while (len--) {
                        res.push(10 - len - 1);
                    }
                    return res;
                })()
            }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                name: '交易笔数',
                max: 30,
                min: 0,
                boundaryGap: [0.2, 0.2],
                axisLine: {
                    lineStyle: {
                        color: "#ccc",
                        width: 1
                    }
                },
                axisLabel: {
                    margin: 14,
                    height: 70,
                    interval: 0,
                    textStyle: {
                        fontSize: 10,
                        color: "#ccc"
                    }
                },
            },
            {
                type: 'value',
                scale: true,
                name: '交易金额',
                max: 1200,
                min: 0,
                boundaryGap: [0.2, 0.2],
                axisLine: {
                    lineStyle: {
                        color: "#ccc",
                        width: 1
                    }
                },
                axisLabel: {
                    margin: 14,
                    height: 70,
                    interval: 0,
                    textStyle: {
                        fontSize: 10,
                        color: "#ccc"
                    }
                },
            }
        ],
        series: [
            {
                name: '交易金额',
                type: 'bar',
                barWidth: 10,
                xAxisIndex: 1,
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        barBorderRadius: 5,
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: '#14c8d4' },
                                { offset: 1, color: '#43eec6' }
                            ]
                        )
                    }
                },
                data: (function () {
                    var res = [];
                    var len = 30;
                    while (len--) {
                        res.push(Math.round(Math.random() * 1000));
                    }
                    return res;
                })()
            },
            {
                name: '交易笔数',
                type: 'line',
                barWidth: 10,
                itemStyle: {
                    normal: {
                        barBorderRadius: 5,
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: '#14c8d4' },
                                { offset: 1, color: '#43eec6' }
                            ]
                        )
                    }
                },
                data: (function () {
                    var res = [];
                    var len = 0;
                    while (len < 30) {
                        res.push((Math.random() * 10 + 5).toFixed(1) - 0);
                        len++;
                    }
                    return res;
                })()
            }
        ]
    };

    app.count = 11;
    setInterval(function () {
        axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '');

        var data0 = option.series[0].data;
        var data1 = option.series[1].data;
        data0.shift();
        data0.push(Math.round(Math.random() * 1000));
        data1.shift();
        data1.push((Math.random() * 10 + 5).toFixed(1) - 0);

        option.xAxis[0].data.shift();
        option.xAxis[0].data.push(axisData);
        option.xAxis[1].data.shift();
        option.xAxis[1].data.push(app.count++);

        myChart.setOption(option);
    }, 2100);
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
})