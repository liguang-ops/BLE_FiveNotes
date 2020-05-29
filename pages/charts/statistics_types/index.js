// pages/charts/statistics_types/index.js

import F2 from '../../../f2-canvas/lib/f2';
let chart=null
const app = getApp()
function initChart(canvas, width, height,data) {
  console.log('data input',data)
  const map = {
    '风热侵袭': '42%',
    '肝火上扰': '20%',
    '痰火郁结': '18%',
    '肾精亏损': '15%',
    '脾胃虚弱': '5%',
  };

  data.forEach(obj => {
    if (obj.name == '风热侵袭') { map['风热侵袭'] = obj.percent * 100 + '%' }
    else if (obj.name == '肝火上扰') { map['肝火上扰'] = obj.percent * 100 + '%' }
    else if (obj.name == '痰火郁结') { map['痰火郁结'] = obj.percent * 100 + '%' }
    else if (obj.name == '肾精亏损') { map['肾精亏损'] = obj.percent * 100 + '%' }
    else if (obj.name == '脾胃虚弱') { map['脾胃虚弱'] = obj.percent * 100 + '%' }
  });
  const chart = new F2.Chart({
    el: canvas,
    width,
    height,
    //animate: false
  });
  chart.source(data);
  chart.legend({
    position: 'right',
    itemFormatter(val) {
      return val + '  ' + map[val];
    }
  });
  chart.tooltip(false);
  chart.coord('polar', {
    transposed: true,
    radius: 0.9
  });
  chart.axis(false);
  chart.interval()
    .position('a*percent')
    .color('name', [ '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0'])
    .adjust('stack')
    .style({
      lineWidth: 1,
      stroke: '#fff',
      lineJoin: 'round',
      lineCap: 'round'
    })
    .animate({
      appear: {
        duration: 1200,
        easing: 'bounceOut'
      }
    });

  chart.render();
  return chart;
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    device_mac: 'B0:E2:35:96:60:55',
    opts: {
      lazyLoad: true // 延迟加载组件
    },
    requestData: null // 异步请求获取的数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'device_mac',
      success: function (res) {
        that.setData({
          device_mac: res.data
        })

        wx.request({
          url: app.globalData.globalUrlIp +'/countTypesProportion',
          data: {
            device_mac: that.data.device_mac
          },
          header: {//请求头
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          method: "POST",
          success: function (res) {
            let data = res.data
            console.log('data', data)
            that.chartComponent = that.selectComponent('#myTypesPie');
            console.log('that.chartComponent', that.chartComponent)
            that.chartComponent.init((canvas, width, height) => { initChart(canvas, width, height, data) })
          }
        })
      },
    })

    // wx.request({
    //   url: 'http://192.168.123.189:5000/countTypesProportion',
    //   data: {
    //     device_mac: that.data.device_mac
    //   },
    //   header: {//请求头
    //     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    //   },
    //   method: "POST",
    //   success: function (res) {
    //     let data = res.data
    //     console.log('data', data)
    //     that.chartComponent = that.selectComponent('#myTypesPie');
    //     console.log('that.chartComponent', that.chartComponent)
    //     that.chartComponent.init((canvas, width, height) => { initChart(canvas, width, height, data) })
    //   }
    // })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})