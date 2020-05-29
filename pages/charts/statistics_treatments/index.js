// pages/charts/statistics_patient_numbers/index.js
import F2 from '../../../f2-canvas/lib/f2';
//import data from '../../../data/steps-pan.js'
const app = getApp()
let chart = null;

function formatNumber(n) {
  return String(Math.floor(n * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


function initChart(canvas,width,height, data){
  console.log('start initChart')
  var that=this
  const originDates=[]
  data.forEach(obj => {
    if (obj.date >= '2018-08-01') {
      originDates.push(obj.date);
    }
  });
  const chart = new F2.Chart({
    el: canvas,
    width,
    height,
    animate: false
  });

  chart.source(data, {
    date: {
      type: 'timeCat',
      tickCount: 5,
      values: originDates,
      mask: 'YY-MM-DD'
    },
    nums: {
      //tickCount: 5
    }
  });

  chart.axis('date', {
    tickLine: {
      length: 4,
      stroke: '#cacaca'
    },
    label: {
      fill: '#cacaca'
    },
    line: {
      top: true
    }
  });
  chart.axis('nums', {
    position: 'right',
    label(text) {
      return {
        text: formatNumber(text * 1),
        fill: '#cacaca'
      };
    },
    grid: {
      stroke: '#d1d1d1'
    }
  });
  chart.tooltip({
    showItemMarker: false,
    background: {
      radius: 2,
      padding: [3, 5]
    },
    onShow(ev) {
      const items = ev.items;
      items[0].name = '';
      items[0].value = items[0].value + ' 步';
    }
  });
  chart.interval().position('date*nums').style({
    radius: [2, 2, 0, 0]
  });

  // 定义进度条
  chart.scrollBar({
    mode: 'x',
    xStyle: {
      backgroundColor: '#e8e8e8',
      fillerColor: '#808080',
      offsetY: -2
    }
  });
  chart.interaction('pan');
  chart.render();
  return chart
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    var that=this
    wx.getStorage({
      key: 'device_mac',
      success: function (res) {
        that.setData({
          device_mac: res.data
        })

        wx.request({
          url: app.globalData.globalUrlIp +'/countTreatmentsPatientNumber',
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
            that.chartComponent = that.selectComponent('#myColumnChart');
            console.log('that.chartComponent', that.chartComponent)
            that.chartComponent.init((canvas, width, height) => { initChart(canvas, width, height, data) })
          }
        })
      },
    })
    // wx.request({
    //   url: 'http://192.168.123.189:5000/countTreatmentsPatientNumber',
    //   data: {
    //     device_mac: that.data.device_mac
    //   },
    //   header: {//请求头
    //     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    //   },
    //   method: "POST",
    //   success: function (res) {
    //     console.log(res)
    //     let data = res.data
    //     console.log('data', data)
    //     that.chartComponent = that.selectComponent('#myColumnChart');
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