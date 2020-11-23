// 自调用函数
(function () {
    // 封装函数
    var setFont = function () {
        // 获取html元素
        var html = document.documentElement;
        // var html = document.querySelector('html');
        // 获取宽度
        var width = html.clientWidth;
        // 如果小于1024，那么就按1024
        if (width < 1024){
            width = 1024; 
        }
        // 如果大于1920，那么就按1920
        if (width > 1920) {
            width = 1920;
        }
        // 计算
        var fontSize = width / 80 + 'px';
        // 设置给html
        html.style.fontSize = fontSize;
    }
    setFont();
    // onresize：改变大小事件
    window.onresize = function () {
        setFont();
    }

})();

// tab切换
(function () {

    $('.monitor').on('click', '.tabs a', function () {
        // 点击谁给谁加类名，其他去除类名
        $(this).addClass('active').siblings().removeClass('active');
        // 把对应的content显示，其他的隐藏
        var index = $(this).attr('data-index');
        // 显示
        $('.content').eq(index).show().siblings('.content').hide();

    });


    // 滚动复制一份
    $('.monitor .marquee').each(function () {
        // 拿到了marquee里面的所有row
       var rows = $(this).children().clone();
        // 追加进去
        $(this).append(rows);
        // 父.append(子)==>子.appendTo(父)
        // $('ul').append($('<li>li</li>'));==>$('<li>li</li>').appendTo('ul');
    });
})();

(function () {
    // 返回对象
    var myChart = echarts.init(document.querySelector('.pie'));
    // 配置
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
       
        series: [
            {
                name: '面积模式',
                type: 'pie',
                radius: ['10%','70%'],
                center: ['50%', '50%'],
                roseType: 'area',
                data: [
                    { value: 20, name: '云南' },
                    { value: 26, name: '北京' },
                    { value: 24, name: '山东' },
                    { value: 25, name: '河北' },
                    { value: 20, name: '江苏' },
                    { value: 25, name: '浙江' },
                    { value: 30, name: '四川' },
                    { value: 42, name: '湖北' }
                ],
                labelLine : {
                    length : 8,
                    length2 : 10,
                },
            }
        ],
        color:['#006cff', '#60cda0', '#ed8884', '#ff9f7f', '#0096ff', '#9fe6b8', '#32c5e9', '#1d9dff'],
        label : {
            fontSize : 10
        },
        

    };
    myChart.setOption(option);

})();


(function () {
    var item = {
        name:'',
        value: 1200,
        // 柱子颜色
        itemStyle: {
          color: '#254065'
        },
        // 鼠标经过柱子颜色
        emphasis: {
          itemStyle: {
            color: '#254065'
          }
        },
        // 工具提示隐藏
        tooltip: {
          extraCssText: 'opacity:0'
        }
      }
    var option = {
        tooltip: {
            trigger: 'item',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            // 距离 上右下左 的距离
            top: '6%',
            right: '3%',
            bottom: '3%',
            left: '0%',
            // 是否包含文本
            containLabel: true,
            // 显示边框
            show: true,
            // 边框颜色
            borderColor: 'rgba(0, 240, 255, 0.3)'
          },
        xAxis: [
            {
                // 使用类目，必须有data属性
                type: 'category',
                // 使用 data 中的数据设为刻度文字
                data: ['上海', '广州', '北京', '深圳', '合肥', '', '......', '', '杭州', '厦门', '济南', '成都', '重庆'],
                // 刻度设置
                axisTick: {
                  // true意思：图形在刻度中间
                  // false意思：图形在刻度之间
                  alignWithLabel: true,
                  alignWithLabel: false,
                  show: false
                },        
               // 文字
                axisLabel: {
                  color: '#4c9bfd'
                }
              }
        ],
        yAxis: [
            {
                // 使用数据的值设为刻度文字
                type: 'value',
                // 刻度设置
                axisTick: {
                  show: false
                },
                // 文字
                axisLabel: {
                  color: '#4c9bfd'
                },
                splitLine: {
                    lineStyle: {
                    color: 'rgba(0, 240, 255, 0.3)'
                    }
                 }
              }
        ],
        series: [
            {
                name: '直接访问',
                type: 'bar',
                barWidth: '60%',
                data: [2100,1900,1700,1560,1400,item,item,item,900,750,600,480,240],
                itemStyle: {
                    // 提供的工具函数生成渐变颜色
                    color: new echarts.graphic.LinearGradient(
                      // (x1,y2) 点到点 (x2,y2) 之间进行渐变
                      0, 0, 0, 1,
                      [
                        {offset: 0, color: 'red'}, // 0 起始颜色
                        {offset: 1, color: 'blue'}  // 1 结束颜色
                      ]
                    )
                  }
            }
            
        ]
    };

    var myChart = echarts.init(document.querySelector('.bar'));
    myChart.setOption(option);

})();

// 订单
(function () {
    // 数据
    var data = {
        // 属性，成员，键
        day365: { orders: '20,301,987', amount: '99834' },
        day90: { orders: '301,987', amount: '9834' },
        day30: { orders: '1,987', amount: '3834' },
        day1: { orders: '987', amount: '834' }
      }
    
    // 获取h4
    var h4orders = $('.order .data h4:eq(0)');
    var h4amount = $('.order .data h4:eq(1)');

    // 点击的时候，获取当前a的自定义属性，
    // 根据这个属性在data里面查找对应的对象，把这个对象设置到页面上既可
    $('.order').on('click','.filter a',function () {
        // 添加类名
        $(this).addClass('active').siblings().removeClass('active');
        // data-key：点击谁就获取谁的
        var key = $(this).attr('data-key');
        // var key = $(this).data('key');
        var val = data[key];// 如果键名是可以的，必须用对象[属性]
        // console.log(val);
        // 设置内容
        h4orders.html( val.orders );
        h4amount.html( val.amount );
    });

    var index = 0;
    // 启动定时器
    window.setInterval(function () {
        index++;
        if (index > 3) {
            index = 0;
        }
        // 自动触发事件
        $('.order .filter a').eq(index).click();
    },1000);

})();

(function () {
    var option = {
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisTick: {
              show: false // 去除刻度线
            },
            axisLabel: {
              color: '#4c9bfd' // 文本颜色
            },
            axisLine: {
              show: false // 去除轴线
            },
            boundaryGap: false  // 去除轴内间距
          },
        yAxis: {
            type: 'value',
            axisTick: {
              show: false  // 去除刻度
            },
            axisLabel: {
              color: '#4c9bfd' // 文字颜色
            },
            splitLine: {
              lineStyle: {
                color: '#012f4a' // 分割线颜色
              }
            }
          },
        series: [{
            name:'预期销售额',
            data: [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#00f2f1'  // 线颜色
            }
          },{
            name:'实际销售额',
            data: [40, 64, 191, 324, 290, 330, 310, 213, 180, 200, 180, 79],
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#ed3f35'  // 线颜色
            }
          }],
            // 设置网格样式
        grid: {
            show: true,// 显示边框
            top: '20%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            borderColor: '#012f4a',// 边框颜色
            containLabel: true // 包含刻度文字在内
        },
        legend: {
            textStyle: {
              color: '#4c9bfd' // 图例文字颜色
               //  fontSize
            },
            right: '10%' // 距离右边10%
          },
    };
    // $(jQ对象)==>DOM对象
    var myChart = echarts.init(document.querySelector('.line'))
    myChart.setOption(option);

    // 数据
    var data = {
        year: [
          [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
          [40, 64, 191, 324, 290, 330, 310, 213, 180, 200, 180, 79]
        ],
        quarter: [
          [23, 75, 12, 97, 21, 67, 98, 21, 43, 64, 76, 38],
          [43, 31, 65, 23, 78, 21, 82, 64, 43, 60, 19, 34]
        ],
        month: [
          [34, 87, 32, 76, 98, 12, 32, 87, 39, 36, 29, 36],
          [56, 43, 98, 21, 56, 87, 43, 12, 43, 54, 12, 98]
        ],
        week: [
          [43, 73, 62, 54, 91, 54, 84, 43, 86, 43, 54, 53],
          [32, 54, 34, 87, 32, 45, 62, 68, 93, 54, 54, 24]
        ]
      }
    // 点击的时候获取自定义属性，通过这个属性，到data里面取出我们要用的数据
    // 之后吧这个数据，是一个数组，第一个数组给series第一个数据，同理第二个给第二个
    $('.sales').on('click','.caption a',function () {
        $(this).addClass('active').siblings('a').removeClass('active');
        // 获取自定义属性
        var arr = data[$(this).attr('data-type')];
        // console.log(arr);
        // 设置修改option配置
        option.series[0].data = arr[0];
        option.series[1].data = arr[1];
        //修改完成之后，在此设置 
        myChart.setOption(option);
    });

    // 一样
    var index = 0;
    // 定时器
    var dsq = window.setInterval(function () {
        index++;
        if (index > 3) {
            index = 0;
        }
        $('.sales .caption a').eq(index).click();
    },1000);

    // 鼠标进入停止
    // mouseover == mouseenter
    // mouseout == mouseleave
    $('.line').mouseenter(function () {
        // console.log('哇哈哈');
        window.clearInterval(dsq);
    });
    // 鼠标离开启动
    $('.line').mouseleave(function () {
        dsq = window.setInterval(function () {
            index++;
            if (index > 3) {
                index = 0;
            }
            $('.sales .caption a').eq(index).click();
        },1000);
    });
})();


(function () {
    // 配置项
    var option = {
        series: [
          {
            type: 'pie',
            radius: ['130%', '150%'],  // 放大图形
            center: ['48%', '80%'],    // 往下移动  套住75%文字
            label: {
              show: false,
            },
            startAngle: 180,
            hoverOffset: 0,
            data: [
                { value: 100 }, // 不需要名称
                { value: 100,}, // 不需要名称
                { value: 200, itemStyle: { color: 'transparent' } } // 透明隐藏第三块区域
            ]
          }
        ]
      };
      var myChart = echarts.init(document.querySelector('.gauge'));
      myChart.setOption(option);

    
})();

(function () {
    // 数据
    var data = [
        { name: '可爱多', num: '9,086' },
        { name: '娃哈哈', num: '8,341' },
        { name: '喜之郎', num: '7,407' },
        { name: '八喜', num: '6,080' },
        { name: '小洋人', num: '6,724' },
        { name: '好多鱼', num: '2,170' },
      ];
    // 鼠标进入li的时候，我们把数据随机排序，把这个新数组放到页面上
    $('.province').on('mouseenter', '.sup li', function () {
        // 添加类名
        $(this).addClass('active').siblings().removeClass('active');
        // 数组从新排列
        var randomDate = data.sort(function () {return 0.5 - Math.random()});
        // <li><span>数据</span><span> 数据<s class="icon-up"></s></span></li>
        // 遍历数组，遍历出来一个，就创建一个li
        var html = '';
        randomDate.forEach(function (val) {
            // 当前项
            // val = { name: '可爱多', num: '9,086' }
        html += `<li><span>${val.name}</span><span>${val.num}<s class="icon-up"></s></span></li>`;
        });
        // console.log(html);
        // 放到sub里面
        $('.province .sub').html(html);
    });

    // 默认让第一个li触发一次事件
    $('.province .sup li').eq(0).mouseenter();

    var index = 0;
    // 开启定时器
    window.setInterval(function () {
        index++;
        if (index > 4) {
            index = 0;
        }
        $('.province .sup li').eq(index).mouseenter();
    },1000);
})();

