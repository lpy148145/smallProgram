const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date =>{
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  var time = {
    year:year,
    month:month,
    day :day,
    exact: [year, month, day].map(formatNumber).join('-') 
  }
  return time
}

function getDates(days, todate) {
  var dateArry = [];

  for (var i = 0; i < days; i++) {

    var dateObj = dateLater(todate, i);

    dateArry.push(dateObj)

  }
  return dateArry;
}

function dateLater(dates, later) {
  let dateObj = {};
  let show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
  let date = new Date(dates);
  date.setDate(date.getDate() - later);
  let day = date.getDay();
  let yearDate = date.getFullYear();
  let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
  let dayFormate = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  dateObj.time = yearDate + '-' + month;
  dateObj.week = show_day[day];
  return dateObj;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  getDates: getDates
}