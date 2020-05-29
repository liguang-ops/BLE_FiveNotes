// pages/consultationList/consultationList.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    consultationList:[],
    //device_mac:'',
    services: {},
    characteristics: {},
    connected: true,
    patients_bytes:[],
    isHidden: true,
    recipient_mail:'',
    patient_id:''

  },

  // 搜索入口  
  wxSearchTab: function () {
    wx.navigateTo({
      url: '../search/search'
    })

  },

  /**
   * 获取弹出框输入值
   */

  setValue: function (e) {
    var that = this
    that.setData({
      recipient_mail: e.detail.value
    })
  },


  /**
   * 弹出框确定
   */
  confirm: function () {
    var that = this
    const recipient_mail = that.data.recipient_mail
    that.setData({
      isHidden: true
    })
    if(that.data.tapIndex==0){
      wx.showLoading({
        title: '正在发送邮件',
      })
      wx.request({
        url: app.globalData.globalUrlIp + '/sendMailSingle',    //发送单条信息邮件
        data: {
          patient_id: that.data.patient_id,
          recipient_mail: that.data.recipient_mail
        },
        header: {//请求头
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        method: "POST",
        success: function (res) {
          console.log('send', res)
          if(res.data.status==1){
            wx.hideLoading()
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
          }
          else{
            wx.hideLoading()
            wx.showToast({
              title: '失败',
              icon: 'None',
              duration: 2000
            })
          }
         
        }
      })
    }
    else if (that.data.tapIndex == 1){
      wx.showLoading({
        title: '正在发送邮件',
      })
      console.log('mail',that.data.device_mac)
      wx.request({
        url: app.globalData.globalUrlIp + '/sendMailAll',   //发送所有信息邮件
        data: {
          device_mac: that.data.device_mac,
          recipient_mail: that.data.recipient_mail
        },
        header: {//请求头
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        method: "POST",
        success: function (res) {
          console.log('send', res)
          if (res.data.status == 1) {
            wx.hideLoading()
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
          }
          else {
            wx.hideLoading()
            wx.showToast({
              title: '失败',
              icon: 'None',
              duration: 2000
            })
          }
        }
      })
    }
 
  },


  /**
   * 弹出框取消
   */
  cancel: function () {
    var that = this
    that.setData({
      isHidden: true
    })
  },

  /**
   * 下载记录：单条或多条
   */
  download:function(e){
    var that = this;
    that.setData({
      patient_id: e.currentTarget.id
    })
    console.log('patient_id',that.data.patient_id)
    wx.showActionSheet({
      itemList: ['单条下载','全部下载'],
      success:function(res){
        if(res.tapIndex==0){
          that.setData({
            isHidden: false,
            tapIndex:0
          })
        }
        else if(res.tapIndex==1){
          that.setData({
            isHidden: false,
            tapIndex:1
          })
        }
      }
    })
  },

  /**
   * 转到个人详细页
   */
  goDetail:function(e){
    var that=this;
    console.log('detail e',e)
    var index=e.currentTarget.dataset.index;
    //将点击条目信息本地存储
    wx.setStorage({
      key: 'per_patient_info',
      data: that.data.consultationList[index],
    })
    wx.navigateTo({
      url: '/pages/detailedPatient/detailedPatient',
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.editTabBar(); 
    var list_height = ((app.globalData.SystemInfo.windowHeight - 50) * (750 / app.globalData.SystemInfo.windowWidth)) - 60
    that.setData({
      list_height: list_height
    })
    wx.getStorage({
      key: "device_mac",
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
    var that = this;
    wx.getStorage({
      key: 'connection_mac',
      success: function (res) {
        console.log('res', res.data)
        that.setData({
          connection_mac: res.data
        })
        console.log('本地缓存获取', that.data.connection_mac)
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

                // 读取特征值
                wx.readBLECharacteristicValue({
                  deviceId: that.data.connection_mac,
                  serviceId: '795090c7-420d-4048-a24e-18e60180e23c',
                  characteristicId: '31517c58-66bf-470c-b662-e352a6c80cba',
                  success: function (res) {
                    console.log('readBLECharacteristicValue:', res)
                    console.log('time1', new Date().getTime())
                  }
                })
              },
            })
          },
        })
      },
    })
    console.log('本地缓存获取2', that.data.connection_mac)
    //监听回调，连接状态变化
    wx.onBLEConnectionStateChange(function (res) {
      console.log('consultationList:',res)
      console.log('connectedState',res.connected)
      that.setData({
        connected: res.connected
      })
      if(res.connected==false){
        wx.showModal({
          title: '提示',
          content: '蓝牙已断开',
          showCancel: false
        })
      }
    })

    //监听回调，接收数据
    wx.onBLECharacteristicValueChange(function (res) {
      wx.showLoading({
        title: '正在上传数据',
      })
      var a = res.value
      var data_new = Array.prototype.map.call(new Uint8Array(res.value), x => x)
      if (data_new.toString()!='101,110,100') {
        that.setData({
          patients_bytes: that.data.patients_bytes.concat(data_new)

        })
        //console.log('joined',that.data.patients_bytes)
        wx.readBLECharacteristicValue({
          deviceId: that.data.connection_mac,
          serviceId: '795090c7-420d-4048-a24e-18e60180e23c',
          characteristicId: '31517c58-66bf-470c-b662-e352a6c80cba',
          success: function (res) {
            //console.log('readBLECharacteristicValue:', res.errCode)
          }
        })
      }
      else {
        console.log('length', that.data.patients_bytes.length)
        console.log('time2', new Date().getTime())
        var patients = that.data.patients_bytes
        var str = ''
        for (var i = 0; i < patients.length; i++) {
          str += '%' + patients[i].toString(16)
        }
        that.setData({
          patients: decodeURIComponent(str)
        })
        console.log('all data', that.data.patients)

        wx.request({
          url: app.globalData.globalUrlIp + '/syncAllPatientsInfo',   //同步设备端所有病人信息至云端
          header: {//请求头
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          method: "POST",
          data: {
            'patients': that.data.patients,
            'device_mac': that.data.device_mac
          },
          success: function (res) {
            console.log('upload', res)
            if(res.data.status==1){
              wx.hideLoading()
            }
            else{
              wx.showToast({
                title: '数据上传失败',
                icon:'none',
                duration:1000
              })
            }
          }
        })
      }
    })

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
    //wx.showNavigationBarLoading();
    wx.showLoading({
      title: '正在载入数据',
    })
    var that = this;
    //that.Receive();
    //向服务器获取所有病人信息
    wx.request({
      url: app.globalData.globalUrlIp + '/queryConsultationListWeixin',   //小程序获取所有患者信息 
      data: {
        device_mac: that.data.device_mac
      },
      header: {//请求头
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      method: "POST",
      success: function (res) {
        console.log(res)
        var length = res.data.patients_info.length;
        var info = res.data.patients_info;
        console.log('info',info)
        for (var i = 0; i < length; i++) {
          if (info[i].grade_level == '') {
            info[i].grade_level = '无'
          }
          if (info[i].grade_score == '') {
            info[i].grade_score = '无'
          }
          if (info[i].patient_gender == 1) {
            info[i].patient_gender = '男'
          }
          else if (info[i].patient_gender == 2){
            info[i].patient_gender = '女'
          }
          
          if (info[i].patient_doctor_category1 == 1) {
            info[i].patient_doctor_category1 = '风热侵袭'
          }
          else if (info[i].patient_doctor_category1 == 2) {
            info[i].patient_doctor_category1 = '肝火上扰'
          }
          else if (info[i].patient_doctor_category1 == 3) {
            info[i].patient_doctor_category1 = '痰火郁结'
          }
          else if (info[i].patient_doctor_category1 == 4) {
            info[i].patient_doctor_category1 = '肾精亏损'
          }
          else if (info[i].patient_doctor_category1 == 5) {
            info[i].patient_doctor_category1 = '脾胃虚弱'
          }

          if (info[i].patient_doctor_category2 == null) {
            info[i].patient_doctor_category2 = ''
          }
          else if (info[i].patient_doctor_category2 == 1) {
            info[i].patient_doctor_category2 = '风热侵袭'
          }
          else if (info[i].patient_doctor_category2 == 2) {
            info[i].patient_doctor_category2 = '肝火上扰'
          }
          else if (info[i].patient_doctor_category2 == 3) {
            info[i].patient_doctor_category2 = '痰火郁结'
          }
          else if (info[i].patient_doctor_category2 == 4) {
            info[i].patient_doctor_category2 = '肾精亏损'
          }
          else if (info[i].patient_doctor_category2 == 5) {
            info[i].patient_doctor_category2 = '脾胃虚弱'
          }
        }
        that.setData({
          consultationList: info
        })
        wx.hideLoading()
        console.log(that.data.consultationList)
        // 隐藏导航栏加载框
        //wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
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