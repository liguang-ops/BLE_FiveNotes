// pages/charts/statistics_music/index.js

import F2 from '../../../f2-canvas/lib/f2';
const app = getApp()
let chart = null;

function initChart(canvas, width, height,data,that) {
  // const data = [
  //   { year: '2001', population: 41.8 },
  //   { year: '2002', population: 25.8 },
  //   { year: '2003', population: 31.7 },
  //   { year: '2004', population: 46 },
  //   { year: '2005', population: 28 }
  // ];

  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source(data);
  chart.coord('polar');
  chart.legend({
    position: 'right'
  });
  chart.axis(false);
  // chart.tooltip({
  //   nameStyle: {
  //     fontSize: 18,
  //   },
  //   valueStyle: {
  //     fontSize: 18,
  //   }, 
  // });
  chart.tooltip(false);
  chart.interval().position('name*num')
    .color('name')
    .style({
      lineWidth: 1,
      stroke: '#fff'
    });


  chart.interaction('pie-select', {
    cancelable: false, // 不允许取消选中
    animate: {
      duration: 300,
      easing: 'backOut'
    },
    onEnd(ev) {
      const { shape, data, shapeInfo, selected } = ev;
      if (shape) {
        if (selected) {
          that.setData({
            message: data.name + ': ' + data.num
          });
        }
      }
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
    wx.request({
      url: app.globalData.globalUrlIp +'/countPerMusicNumber',
      header: {//请求头
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      method: "POST",
      success: function (res) {
        let data = res.data
        console.log('data', data)
        that.chartComponent = that.selectComponent('#roseMusic');
        console.log('that.chartComponent', that.chartComponent)
        that.chartComponent.init((canvas, width, height) => { initChart(canvas, width, height, data,that) })
      }
    })
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