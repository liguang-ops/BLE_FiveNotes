// pages/mydevice/mydevice.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    device_mac:123456
  },


  changeLogo:function(){
    wx.navigateTo({
      url: '../logo/logo',
    })
  },

  firmwareUpdate:function(){
    wx.showModal({
      content: '固件暂无更新',
      confirmColor: '#66CCFF',
      cancelColor: '#A3A3A3'
    })
  },

  musicUpdate:function(){
    wx.showModal({
      content: '音乐暂无更新',
      confirmColor: '#66CCFF',
      cancelColor:'#A3A3A3'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar(); 
    var that=this;
    wx.getStorage({
      key: 'device_mac',
      success: function(res) {
        that.setData({
          device_mac:res.data
        })
      },
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