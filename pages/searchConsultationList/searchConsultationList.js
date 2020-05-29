// pages/searchConsultationList/searchConsultationList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    consultationList: [],
    device_mac:'B0:E2:35:96:60:55',
    isHidden:true
  },
  /**
   * 转到个人详细页
   */
  goDetail: function (e) {
    var that = this;
    console.log('detail e', e)
    var index = e.currentTarget.dataset.index;
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
    if (that.data.tapIndex == 0) {
      wx.showLoading({
        title: '正在发送邮件',
      })
      wx.request({
        url: app.globalData.globalUrlIp +'/sendMailSingle',
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
          if (res.data.status == 1) {
            wx.hideLoading()
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            // wx.redirectTo({
            //   url: '/pages/search/search'
            // })
            wx.navigateBack({
              url: '/pages/search/search'
            })
          }
          else {
            wx.hideLoading()
            wx.showToast({
              title: '失败',
              icon: 'none',
              duration: 2000
            })
            // wx.redirectTo({
            //   url: '/pages/search/search'
            // })
            wx.navigateBack({
              url: '/pages/search/search'
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
  download: function (e) {
    var that = this;
    that.setData({
      patient_id: e.currentTarget.id
    })
    console.log('patient_id', that.data.patient_id)
    wx.showActionSheet({
      itemList: ['单条下载'],
      success: function (res) {
        if (res.tapIndex == 0) {
          that.setData({
            isHidden: false,
            tapIndex: 0
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getStorage({
      key: 'search_name',
      success: function(res) {
        that.setData({
          search_name:res.data
        })
        wx.getStorage({
          key: 'device_mac',
          success: function (res) {
            that.setData({
              device_mac: res.data
            })

            wx.request({
              url: app.globalData.globalUrlIp + '/querySearchConsultationList',  //获取指定姓名的患者信息
              data: {
                device_mac: that.data.device_mac,
                search_name: that.data.search_name
              },
              header: {//请求头
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
              },
              method: "POST",
              success: function (res) {
                console.log(res)
                if (res.data.status == 1) {
                  var length = res.data.patients_info.length;
                  if (length != 0) {
                    var info = res.data.patients_info;
                    console.log('info', info)
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
                      else if (info[i].patient_gender == 2) {
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
                    console.log(that.data.consultationList)
                  }

                  else {
                    wx.showToast({
                      title: '无结果',
                      icon: 'none',
                      duration: 2000
                    })
                  }

                }
                else {
                  wx.showToast({
                    title: '搜索失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            })



          },
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