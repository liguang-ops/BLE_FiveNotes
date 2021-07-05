//app.js
App({
  buf2hex: function (buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
  },
  buf2string: function (buffer) {
    var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
    var str = ''
    for (var i = 0; i < arr.length; i++) {
      str += String.fromCharCode(arr[i])
    }
    return str
  },

  buf2utf8:function(buffer){
    var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
    console.log('类型',typeof(arr))
    var str = ''
    for (var i = 0; i < arr.length; i++) {
      str += '%'+arr[i].toString(16)
    }
    return decodeURIComponent(str)
  },
  
  encodeUtf8:function encodeUtf8(text) {
    var code = encodeURIComponent(text);
    var bytes = [];
    for(var i = 0; i<code.length; i++) {
      var c = code.charAt(i);
      if (c === '%') {
        var hex = code.charAt(i + 1) + code.charAt(i + 2);
        var hexVal = parseInt(hex, 16);
        bytes.push(hexVal);
        i += 2;
      } 
      else bytes.push(c.charCodeAt(0));
      }
    return bytes;
},


  onLaunch: function () {
    this.globalData.SystemInfo = wx.getSystemInfoSync()
    //console.log(this.globalData.SystemInfo)
  },

  globalData: {
    globalUrlIp:"http://backtest-1056345-1257887823.ap-shanghai.run.tcloudbase.com",   //本地测试ip，后期需要改为正式服务器域名
    userInfo: null,
    tabbar: {
      color: "#707070",
      selectedColor: "#66CCFF",
      backgroundColor: "#ffffff",
      borderStyle: "#D5D5D5",
      list: [
        {
          pagePath: "/pages/consultationList/consultationList",
          text: "就诊列表",
          iconPath: "/images/consultationList.png",
          selectedIconPath: "/images/consultationList_selected.png",
          selected: true
        },
        {
          pagePath: "/pages/statistics/statistics",
          text: "统计",
          iconPath: "/images/statistics.png",
          selectedIconPath: "/images/statistics_selected.png",
          selected: false
        },
        {
          pagePath: "/pages/mydevice/mydevice",
          text: "设备",
          iconPath: "/images/device.png",
          selectedIconPath: "/images/device_selected.png",
          selected: false
        }
      ],
      position: "bottom"
    }
  },

  editTabBar: function () {
    var tabbar = this.globalData.tabbar,
      currentPages = getCurrentPages(),
      _this = currentPages[currentPages.length - 1],
      pagePath = _this.__route__;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
})