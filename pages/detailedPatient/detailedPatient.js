// pages/detailedPatient/detailedPatient.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select1:false,
    select2:false,
    patient_doctor_category1:'',
    patient_doctor_category2:'',
    connected: true,
  },
  /**
   * 下拉框配置开始
   */
  bindShowMsg1:function() {
    this.setData({
      select1: !this.data.select1
    })
  },
  mySelect1:function(e) {
    var that=this
    var name = e.currentTarget.dataset.name
    that.setData({
      patient_doctor_category1: name,
      select1: false
    })
  },
  bindShowMsg2: function () {
    this.setData({
      select2: !this.data.select2
    })
  },
  mySelect2: function (e) {
    var that = this
    var name = e.currentTarget.dataset.name
    that.setData({
      patient_doctor_category2: name,
      select2: false
    })
  },
  /**
   * 下拉框配置结束
   */

  reportBlur:function(e){
    var that=this
    that.setData({
      patient_self_reported:e.detail.value
    })
  },

  historyBlur:function(e){
    var that = this
    that.setData({
      patient_medical_history:e.detail.value
    })
  },

  examinationBlur:function(e){
    var that = this
    that.setData({
      patient_examination:e.detail.value
    })
  },

  btnConfirm:function(){
    var that=this
    //that.getConnectedState()
    that.sendUpdate()
    
  },

  /**
   * 分型与数字间映射
   */
  groupMap: function (group) {
    if (group == '风热侵袭') {
      return 1
    }
    else if (group == '肝火上扰') {
      return 2
    }
    else if (group == '痰火郁结') {
      return 3
    }
    else if (group == '肾精亏损') {
      return 4
    }
    else if (group == '脾胃虚弱') {
      return 5
    }
    else if (group == '') {
      return null
    }
  },

  /**
   * 性别和数字间的映射
   */
  genderMap:function(gender){
    if (gender == '男'){
      return 1
    }
    else if(gender == '女'){
      return 2
    }
  },

  /**
   * 构建传给设备的modify数据,该数据类型为str
   */
  modifyData2Str:function(){
    var that=this
    var modify={
      "type": "change_patient",
      "patient":{
        'patient_name': that.data.patient_name,
        'patient_age': that.data.patient_age,
        'patient_gender': that.genderMap(that.data.patient_gender),
        'patient_doctor_category1': that.groupMap(that.data.patient_doctor_category1),
        'patient_doctor_category2': that.groupMap(that.data.patient_doctor_category2),
        // 'reported': that.data.patient_self_reported,
        // 'history': that.data.patient_medical_history,
        // 'examination': that.data.patient_examination,
      }

    }
    return JSON.stringify(modify)
  },

  /**
   * 向云端上传数据
   */
  upload:function(){
    var that =this
    wx.request({
      url: app.globalData.globalUrlIp + '/updatePatientInfo',   //更新单条病人信息
      data: {
        patient_name: that.data.patient_name,
        patient_age: that.data.patient_age,
        patient_gender: that.genderMap(that.data.patient_gender),
        patient_doctor_category1: that.groupMap(that.data.patient_doctor_category1),
        patient_doctor_category2: that.groupMap(that.data.patient_doctor_category2),
        patient_self_reported: that.data.patient_self_reported,
        patient_medical_history: that.data.patient_medical_history,
        patient_examination: that.data.patient_examination,
        device_mac: that.data.device_mac,

      },
      header: {//请求头
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      method: "POST",
      success: function (res) {
        console.log('updateres:', res.data.status)
        if (res.data.status == 1) {
          that.sendBackUpPatientUpdate('backup_success','云端更新成功通知设备成功')
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000
          })
          
          wx.redirectTo({
            url: '/pages/consultationList/consultationList'
          })
        }
        else {
          that.sendBackUpPatientUpdate('backup_failed','云端更新失败通知设备成功')
          wx.showModal({
            title: '提示',
            content: '网络请求失败',
            showCancel: false
          })
          wx.redirectTo({
            url: '/pages/consultationList/consultationList'
          })
        }
      }
    })
  },

  /**
   * 通过ble向设备发送已修改的数据
   */
  sendUpdate:function(){
    var that = this
    var modifystr = that.modifyData2Str()
    console.log('modifystr:', modifystr)
    var bytes = app.encodeUtf8(modifystr)
    console.log(bytes)

    var nums = parseInt(bytes.length/20)
    console.log('nums:',nums)
    var remainder = bytes.length % 20
    console.log('remainder:', remainder)
    if (that.data.connected) {
      for(var i=0;i<nums;i++){
        var buffer = new ArrayBuffer(20)
        var dataView = new Uint8Array(buffer)
        for (var j = 0; j < 20; j++) {
          dataView[j] = bytes[20*i+j]
        }
        console.log('dataview',dataView)
        
        wx.writeBLECharacteristicValue({
          deviceId: that.data.connection_mac,
          serviceId: '795090c7-420d-4048-a24e-18e60180e23c',
          characteristicId: '0b89d2d4-0ea6-4141-86bb-0c5fb91ab14a',
          value: buffer,
          success: function (res) {
            console.log('发送成功')
          },
          fail:function(res){
            console.log(res)
          }
        })
      }
      //发送最后一包数据
      if(remainder!=0){
        var buffer = new ArrayBuffer(remainder)
        var dataView = new Uint8Array(buffer)
        for (var j = 0; j < remainder; j++) {
          dataView[j] = bytes[20*nums+j]
        }
        wx.writeBLECharacteristicValue({
          deviceId: that.data.connection_mac,
          serviceId: '795090c7-420d-4048-a24e-18e60180e23c',
          characteristicId: '0b89d2d4-0ea6-4141-86bb-0c5fb91ab14a',
          value: buffer,
          success: function (res) {
            console.log('最后一包发送成功')
            that.upload()
          }
        })
      }
    }
    else {
      wx.showModal({
        title: '提示',
        content: '蓝牙已断开',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },


   /**
   * 通过ble向设备发送,云端更新病人是否成功情况
   */
  sendBackUpPatientUpdate:function(status,log){
    var that=this
    var bytes=app.encodeUtf8(status)
    if (that.data.connected){
      var buffer = new ArrayBuffer(bytes.length)
      var dataView = new Uint8Array(buffer)
      for(var i=0;i<status.length;i++)
      {
        dataView[i]=bytes[i]
      }
      wx.writeBLECharacteristicValue({
        deviceId: that.data.connection_mac,
        serviceId: '795090c7-420d-4048-a24e-18e60180e23c',
        characteristicId: '0b89d2d4-0ea6-4141-86bb-0c5fb91ab14a',
        value: buffer,
        success: function (res) {
          console.log(log)
        }
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '蓝牙已断开',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    } 
  },

  /**
   * 获取蓝牙uuid
   */
  getServiceCharacterUUIDAndNotify:function(){
    var that=this
    //获取设备服务
    wx.getBLEDeviceServices({
      deviceId: that.data.connection_mac,
      success: function (res) {
        console.log('服务', res)
        that.setData({
          services: res.services
        })

        //获取服务特征值
        wx.getBLEDeviceCharacteristics({
          deviceId: that.data.connection_mac,
          serviceId: '795090c7-420d-4048-a24e-18e60180e23c',
          success: function (res) {
            console.log('特征值', res)
            that.setData({
              characteristics: res.characteristics
            })
          }
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getStorage({
      key: 'per_patient_info',
      success: function(res) {
        console.log('per_patient_info',res.data)
        that.setData({
          patient_name: res.data.patient_name,
          patient_age: res.data.patient_age,
          patient_gender: res.data.patient_gender,
          treatment_count: res.data.treatment_count,
          grade_score:res.data.grade_score,
          grade_level: res.data.grade_level,
          patient_doctor_category1: res.data.patient_doctor_category1,
          patient_doctor_category2: res.data.patient_doctor_category2,
          patient_self_reported: res.data.patient_self_reproted,
          patient_medical_history: res.data.patient_medical_history,
          patient_examination:res.data.patient_examination
        })
      },
    })
    wx.getStorage({
      key: 'device_mac',
      success: function(res) {
        that.setData({
          device_mac:res.data
        })
      },
    })
    wx.getStorage({
      key: 'connection_mac',
      success: function(res) {
        that.setData({
          connection_mac: res.data
        })
        console.log(that.data.connection_mac)
        that.getServiceCharacterUUIDAndNotify()
        //监听回调，连接状态变化
        wx.onBLEConnectionStateChange(function (res) {
          console.log('connectedState', res)
          that.setData({
            connected: res.connected
          })
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