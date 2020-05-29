// pages/charts/statistics_results_music/index.js
import F2 from '../../../f2-canvas/lib/f2';
let chart = null;

function initChart(canvas, width, height) {
  const data = [
    { state: '自编音乐', type: '风热侵袭', nums: 200 },
    { state: '自编音乐', type: '肝火上扰', nums: 100 },
    { state: '自编音乐', type: '痰火郁结', nums: 20 },
    { state: '自编音乐', type: '肾精亏损', nums: 60 },
    { state: '自编音乐', type: '脾胃虚弱', nums: 80 },
    { state: '非自编音乐', type: '风热侵袭', nums: 250 },
    { state: '非自编音乐', type: '肝火上扰', nums: 130 },
    { state: '非自编音乐', type: '痰火郁结', nums: 130 },
    { state: '非自编音乐', type: '肾精亏损', nums: 60 },
    { state: '非自编音乐', type: '脾胃虚弱', nums: 50 },
    { state: '阿是乐', type: '风热侵袭', nums: 30 },
    { state: '阿是乐', type: '肝火上扰', nums: 40 },
    { state: '阿是乐', type: '痰火郁结', nums: 200 },
    { state: '阿是乐', type: '肾精亏损', nums: 130 },
    { state: '阿是乐', type: '脾胃虚弱', nums: 40 },
  ];
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  chart.source(data, {
    'nums': {
      tickCount: 5
    }
  });
  chart.coord({
    transposed: true
  });
  chart.axis('state', {
    line: F2.Global._defaultAxis.line,
    grid: null
  });
  chart.axis('nums', {
    line: null,
    grid: F2.Global._defaultAxis.grid,
    label(text, index, total) {
      const textCfg = {
        text: text / 1000 + ' k'
      };
      if (index === 0) {
        textCfg.textAlign = 'left';
      }
      if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });
  chart.tooltip({
    custom: true, // 自定义 tooltip 内容框
    onChange(obj) {
      const legend = chart.get('legendController').legends.top[0];
      const tooltipItems = obj.items;
      const legendItems = legend.items;
      const map = {};
      legendItems.map(item => {
        map[item.name] = Object.assign({}, item);
      });
      tooltipItems.map(item => {
        const { name, value } = item;
        if (map[name]) {
          map[name].value = (value);
        }
      });
      legend.setItems(Object.values(map));
    },
    onHide() {
      const legend = chart.get('legendController').legends.top[0];
      legend.setItems(chart.getLegendItems().country);
    }
  });
  chart.interval().position('state*nums').color('type').adjust('stack');

  chart.render();
  return chart;
}

Page({


  /**
   * 页面的初始数据
   */
  data: {
    opts: {
      onInit: initChart
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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