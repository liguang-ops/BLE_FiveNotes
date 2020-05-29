// pages/charts/statistics_age/index.js

import F2 from '../../../f2-canvas/lib/f2';
const app = getApp()

console.log(app.globalData.globalUrlIp)
let chart = null;

function initChart(canvas, width, height, data) {
  console.log('data input', data)
  const map = {
    '18岁以下': '42%',
    '18岁-44岁': '20%',
    '44岁-60岁': '18%',
    '60岁以上': '15%'
  };

  data.forEach(obj => {
    if (obj.name == '18岁以下') { map['18岁以下'] = obj.percent * 100 + '%' }
    else if (obj.name == '18岁-44岁') { map['18岁-44岁'] = obj.percent * 100 + '%' }
    else if (obj.name == '44岁-60岁') { map['44岁-60岁'] = obj.percent * 100 + '%' }
    else if (obj.name == '60岁以上') { map['60岁以上'] = obj.percent * 100 + '%' }
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
    .color('name', ['#2FC25B', '#FACC14', '#F04864', '#8543E0'])
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
          url: app.globalData.globalUrlIp +'/countAgesProportion',
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
            that.chartComponent = that.selectComponent('#myAgesPie');
            console.log('that.chartComponent', that.chartComponent)
            that.chartComponent.init((canvas, width, height) => { initChart(canvas, width, height, data) })
          }
        })
      },
    })

    // wx.request({
    //   url: 'http://192.168.123.189:5000/countAgesProportion',
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
    //     that.chartComponent = that.selectComponent('#myAgesPie');
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