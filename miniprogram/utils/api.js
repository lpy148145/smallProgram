var n = "https://judouapp.com/api";

module.exports = {
  getRandomSentence: function () {
    return n + "/v5/wx_app/random";
  },
  getDailySentence: function () {
    return n + "/v5/wx_app/daily?";
  },
  contributeSentence: function () {
    return n + "/v2/common/contribute";
  },
  favouriteAction: function (t) {
    return n + "/v5/wx_app/sentences/" + t + "/likes";
  },
  wechatAppLogin: function () {
    return n + "/v5/wx_app/oauth";
  }
};