// pages/statistics/statistics.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    charts: [
      { name: 'statistics_treatments', value: '日治疗人数统计' },
      { name: 'statistics_age', value: '年龄统计' },
      { name: 'statistics_gender', value: '性别统计' },
      { name: 'statistics_types', value: '分型统计' },
      { name: 'statistics_music',value: '音乐数量统计'},
      { name: 'statistics_results_music', value: '音乐使用情况' },
      { name: 'statistics_perdoctor_patientnums', value: '医生接诊总人数统计' },
      { name: 'statistics_results_all',value: '整体疗效统计'},
      
    ],
  },

  gotoPage: function (e) {
    var page = e.currentTarget.dataset.page;
    wx.navigateTo({
      url:'../charts/'+page+'/index'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar(); 
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