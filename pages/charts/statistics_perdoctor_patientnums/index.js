// pages/charts/statistics_perdoctor_patientnums/index.js
import F2 from '../../../f2-canvas/lib/f2';
const app = getApp()
function initChart(canvas, width, height,data) {
  const chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  var Global = F2.Global;

  chart.source(data, {
    // num: {
    //   tickCount: 5
    // }
  });
  chart.coord({
    transposed: true
  });
  chart.axis('name', {
    line: Global._defaultAxis.line,
    grid: null
  });
  chart.axis('num', {
    line: null,
    grid: Global._defaultAxis.grid,
    label: function label(text, index, total) {
      var textCfg = {};
      if (index === 0) {
        textCfg.textAlign = 'left';
      } else if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });
  chart.interval().position('name*num');
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
          url: app.globalData.globalUrlIp +'/countPerDoctorPatientNumber',
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
            that.chartComponent = that.selectComponent('#barPerDoctorPatientNum');
            console.log('that.chartComponent', that.chartComponent)
            that.chartComponent.init((canvas, width, height) => { initChart(canvas, width, height, data) })
          }
        })
      },
    })

    // wx.request({
    //   url: 'http://192.168.123.189:5000/countPerDoctorPatientNumber',
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
    //     that.chartComponent = that.selectComponent('#barPerDoctorPatientNum');
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