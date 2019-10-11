//index.js
var util = require('../../utils/util.js');
//获取应用实例
const App = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentList: [],
    current: 0,
    date: 0,
    order: 0,
    hidden:true,
    sWidth:0,
    sHeight:0,
    imgUrl:'',
    word:'',
    word_from:'',
    saveUrl:'',
    saveImg:'../../assets/images/download.png',
    qrCode:'https://7465-test1-5i5yh-1259448202.tcb.qcloud.la/qrCode.png',
    qrUrl:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let DATE = util.formatDate(new Date());
    let exact_date = DATE.exact
    let WEEK = util.getDates(20, exact_date);
    let qrUrl = this.data.qrCode;
    //获取手机信息
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sWidth:res.screenWidth,
          sHeight:res.screenHeight
        })
      },
    }),
    wx.getImageInfo({
      src: qrUrl,
      success: res => {
        console.log(res);
        that.setData({
          qrUrl:res.path
        })
      }
    }),
    // console.log(DATE);
    this.setData({
      date: DATE,
      week: WEEK
    });
  },

  getCurrent: function(e) {
    let index = e.detail.current;
    // console.log(e.detail.current);
    this.setData({
      order: index
    })
    // console.log(this.data.date)
  },

  passQuery: function(e) {
    // 传递的参数
    let query = e.currentTarget.dataset['index'];
    console.log(query)
    this.setData({
      today: query
    })
  },

  passChange: function(e) {
    // 传递的参数
    let change = Math.floor(Math.random() * 20);
    var _word = db.collection("word");
    // var that = this;
    console.log(this.data.contentList[change])
    console.log(this.data.contentList[this.data.order])
    let arr = this.data.contentList[this.data.order];
    this.data.contentList[this.data.order] = this.data.contentList[change];
    let arrChange = this.data.contentList[this.data.order];
    // console.log(arrChange)
    // console.log(this.data.contentList);
    this.setData({
      contentList : this.data.contentList
    })
  },
  
  // 生成图片
  passSave:function(){
    // console.log(this.data.qrUrl)
    let sWidth = this.data.sWidth;
    let sHeight = this.data.sHeight;
    let index = this.data.order
    let imgUrl = this.data.contentList[index].image_url;
    let word = this.data.contentList[index].word;
    let week = this.data.week[index]
    let word_from = this.data.contentList[index].word_from;
    let day = this.data.date.day - index;
    let date = this.data.date
    let that = this
    let qrUrl = this.data.qrUrl;
  

    //获取图片的信息
    wx.getImageInfo({
      src: imgUrl,
      success: res => {
        let imgPath = res.path
        // console.log(imgPath);
        const ctx = wx.createCanvasContext('mycanvas');
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, sWidth, sHeight)
        ctx.drawImage(imgPath, 0, 0, sWidth, 280);
        ctx.drawImage(qrUrl,20,400,80,80)
        ctx.setFontSize(15)
        ctx.setFillStyle('black')
        ctx.fillText(week.time, sWidth*0.67, 310)
        ctx.fillText(week.week, sWidth*0.83, 310)
        ctx.setFontSize(120)
        ctx.setFillStyle('white')
        ctx.fillText(day, 20, 300)
        ctx.setFontSize(120)
        ctx.setFillStyle('#F5F5F5')
        ctx.fillText(day, 20, 300)
        //文字的处理
        var chr = word.split("");//这个方法是将一个字符串分割成字符串数组
        var temp = "";
        var row = [];
        ctx.setFontSize(18)
        ctx.setFillStyle("#000")
        for (var a = 0; a < chr.length; a++) {
          if (ctx.measureText(temp).width < 290) {
            temp += chr[a];
          }
          else {
            a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
            row.push(temp);
            temp = "";
          }
        }
        row.push(temp);
        for (var b = 0; b < row.length; b++) {
          ctx.fillText(row[b], sWidth*0.0676, 340 + b * 30);
        }
        ctx.fillText(word_from, sWidth/2+70, 340+b*30+10);
        ctx.draw(true, function(){
          wx.showLoading({
            title: '图片正在生成!',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
            wx.canvasToTempFilePath({
              canvasId: 'mycanvas',
              success: res => {
                let url = []
                url.push(res.tempFilePath)
                wx.previewImage({
                  urls: url,
                })
              }
            }, this)
        })
      },
    })

  },

  //将画布转化成图片
  changeCanvasToImg:function(){
    let that = this;
    setTimeout(res=>{
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: res => {
          that.setData({
            saveUrl:res.tempFilePath
          })
        }
      }, this)
    },100)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var _word = db.collection("word");
    var that = this;
    _word.get().then(res => {
      // console.log(res.data)
      that.setData({
        contentList: res.data,
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})