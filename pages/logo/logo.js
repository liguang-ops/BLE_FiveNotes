// pages/logo/logo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgFilepath:'/images/hospital.jpg',
    showName:'上海市中医院',
    originalName:'上海市中医院',
    isHidden:true,
    device_mac:''
  },


  /**
   * 更改医院logo
   */
  changeImg:function(){
    var that=this
    wx.chooseImage({
      count:1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        that.setData({
          imgFilepath: res.tempFilePaths[0]
        })
        const fs = wx.getFileSystemManager()
        fs.readFile({
          filePath: res.tempFilePaths[0],
          encoding:'base64',
          success:function(res){
            console.log('base64:',res)
            that.setData({
              imgBase64:res.data
            })
            console.log("base64Length:",res.data.length)
          }
        })
      },

    })
  },


   /**
   * 更改设备名称
   */
  changeName:function(){
    var that=this
    that.setData({
      isHidden:false
    })
  },

  /**
   * 获取弹出框输入值
   */

  setValue:function(e){
    var that=this
    that.setData({
      originalName:e.detail.value
    })
  },


  /**
   * 弹出框确定
   */

  confirm:function(){
    var that=this
    var originalName=this.data.originalName
    that.setData({
      showName: originalName,
      isHidden:true
    })
  },


/**
 * 弹出框取消
 */
  cancel:function(){
    var that=this
    that.setData({
      isHidden:true
    })
  },

  /**
   * 修改完成，上传数据，并返回
   */
  btnConfirm:function(){

  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getStorage({
      key: 'device_mac',
      success: function(res) {
        that.setData({
          device_mac:res.data
        })
        console.log('缓存mac',that.data.device_mac)
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