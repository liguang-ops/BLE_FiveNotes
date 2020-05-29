
// pages/charts/statistics_results/index.js
import F2 from '../../../f2-canvas/lib/f2';

let chart = null;

function initChart(canvas, width, height,data) {
  console.log('input',data)
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  chart.source(data, {
    nums: {
      //tickCount: 5
    }
  });
  chart.tooltip({
    showItemMarker: false,
    onShow(ev) {
      const { items } = ev;
      items[0].name = null;
      items[0].name = items[0].title;
      items[0].value = items[0].value;
    }
  });
  chart.interval().position('name*nums');
  chart.render();
  return chart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    device_mac:'B0:E2:35:96:60:55',
    opts: {
      onInit: initChart
    }
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
          url: 'http://192.168.123.189:5000/countResultAll',
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
            that.chartComponent = that.selectComponent('#columnResultAll');
            console.log('that.chartComponent', that.chartComponent)
            that.chartComponent.init((canvas, width, height) => { initChart(canvas, width, height, data) })
          }
        })
      },
    })
    // wx.request({
    //   url: 'http://192.168.123.189:5000/countResultAll',
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
    //     that.chartComponent = that.selectComponent('#columnResultAll');
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