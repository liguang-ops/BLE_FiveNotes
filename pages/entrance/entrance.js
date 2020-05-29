// pages/entrance/entrance.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    device_id: '',
    hidden: true
  },

  /**
    * 弹窗
    */
  showDialogBtn: function () {
    var that = this
    that.setData({
      showModal: true
    })
  },

  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },

  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    var that = this
    that.setData({
      showModal: false
    });
  },

  /**
   * 获取输入数据
   */
  inputMessage: function (e) {
    var that = this
    that.setData({
      device_id: e.detail.value
    })
  },

  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    var that = this
    that.setData({
      device_id: '',
      hidden: true
    })
    that.hideModal();
  },

  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    var that = this
    if(that.data.device_id != ""){
      that.hideModal();
      wx.setStorage({
        key: 'device_mac',
        data: that.data.device_id,
      })
      wx.redirectTo({
        url: '/pages/ble/ble',
      })
    }

    else {
      that.setData({
        hidden: false
      })
    }
  },

  Search:function(){
    wx.redirectTo({
      url: '/pages/ble/ble',
    })
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