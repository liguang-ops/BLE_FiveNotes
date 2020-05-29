// pages/charts/statistics_results_per/index.js
import F2 from '../../../f2-canvas/lib/f2';
let chart = null;
function initChart(canvas, width, height,data,that) {

  var chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source(data);
  chart.legend({
    position: 'right'
  });
  chart.tooltip(false);
  chart.coord('polar', {
    transposed: true,
    radius: 0.85,
    innerRadius: 0.618
  });
  chart.axis(false);
  chart
    .interval()
    .position('a*percent')
    .color('name', ['#2FC25B','#FACC14'])
    .adjust('stack')
    .style({
      lineWidth: 1,
      stroke: '#fff',
      lineJoin: 'round',
      lineCap: 'round'
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
            message: data.name + ': ' + data.percent*100 + '%'
          })
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
    message:'',
    device_mac:'B0:E2:35:96:60:55',
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
          url: 'http://192.168.123.189:5000/countGendersProportion',
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
            that.chartComponent = that.selectComponent('#myGendersPie');
            console.log('that.chartComponent', that.chartComponent)
            that.chartComponent.init((canvas, width, height) => { initChart(canvas, width, height, data, that) })
          }
        })
      }
    })
    // wx.request({
    //   url: 'http://192.168.123.189:5000/countGendersProportion',
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
    //     that.chartComponent = that.selectComponent('#myGendersPie');
    //     console.log('that.chartComponent', that.chartComponent)
    //     that.chartComponent.init((canvas, width, height) => { initChart(canvas, width, height, data, that) })
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