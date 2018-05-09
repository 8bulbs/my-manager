//index.js
//获取应用实例
const app = getApp()
const QQMapWX = require('../../libs/qqmap-wx-jssdk.min')
const Map = new QQMapWX({
  key: 'N5ABZ-7EMWG-G3KQU-IH52Q-NPW43-2NBIB'
})
Page({
  data: {
    motto: '做更好的自己',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    locationData: {}
  },
  //事件处理函数
  bindViewTap () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad () { 
    let that = this   
    wx.getSetting({
      success (res) {
        if (!res.authSetting['scope.userLocation']) {	
          wx.authorize({
            scope: 'scope.userLocation',
            success () {
              wx.getLocation({
                type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
                success (res){
                  // success
                  let locationData = {
                    latitude: res.latitude,
                    longitude: res.longitude
                  }
                  this.setData({
                    locationData
                  })
                  that.getAddress()
                  that.getWeather()
                },
                fail () {
                  // fail
                },
                complete () {
                  // complete
                }
              })
            }
          })
        } else {   
          wx.getLocation({
            type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
            success (res){
              // success
              let locationData = {
                latitude: res.latitude,
                longitude: res.longitude
              }
              that.setData({
                locationData
              })
              console.log('that.data.locationData', that.data.locationData)
              that.getAddress()
              that.getWeather()
            },
            fail () {
              // fail
            },
            complete () {
              // complete
            }
          })
        }
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onOpenMap() {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  },
  getAddress () {
    let that = this
    Map.reverseGeocoder({
      location: this.data.locationData,
      success (res) {
          if (res.status === 0) {
            let locationData = that.data.locationData
            locationData.address = res.result.address
            that.setData({locationData})
            console.log(that.data.locationData)
          }
      },
      fail (res) {
          console.log(res)
      },
      complete (res) {
          console.log(res)
      }
  })
  },
  getWeather () {
    let url = 'https://free-api.heweather.com/s6/weather/forecast'
    let location = this.data.locationData.latitude + ',' + this.data.locationData.longitude
    let key = '60018d0decf54ffb8e25286eb56f9490' 
    wx.request({
      url,
      data: {
        location,
        key
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res)
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
})
