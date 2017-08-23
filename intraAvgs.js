var request = require('request');
var schedule = require('node-schedule');
var timeseries = require("timeseries-analysis");

function getLastTradingDay() {
  var d = new Date()
  var day = d.getDay();
  var date = d.getDate();
  if (day === 6) {
    date = date - 1;
  } else if (day === 0) {
    date = date - 2;
  } 
  var year = d.getFullYear();
  var month = d.getMonth()+1
  if (month < 10) {
    month = '0'+month;
  }
  return year+'-'+month+'-'+date;
}

function percentChange(err, res, body) {
  if (!err && res.statusCode === 200) {
    var raw = JSON.parse(body);
    var meta = raw['Meta Data'];
    var data = raw['Time Series (1min)'];

    var info = meta['1. Information'];
    var ticker = meta['2. Symbol'];
    var requestTime = meta['3. Last Refreshed'];

    var dailyOpen = [];
    var dailyClose = [];
    var dailyHigh = [];
    var dailyLow = [];
    var dailyAvg = [];
    var dailyVol = [];
    var days = [];

    var today = getLastTradingDay()

    for(var obj in data) {
      var date = obj.split(' ')[0];
      if (date === today) {
        var open = Number(data[obj]['1. open']);
        var high = Number(data[obj]['2. high']);
        var low = Number(data[obj]['3. low']);
        var close = Number(data[obj]['4. close']);
        var volume = Number(data[obj]['5. volume']);

        var avg = (open + high + low + close)/4;

        days.push(obj);
        dailyOpen.push(open);
        dailyVol.push(volume);
      } 
    }

    var topen = new timeseries.main(timeseries.adapter.fromArray(dailyOpen));
    var tvol = new timeseries.main(timeseries.adapter.fromArray(dailyVol));

    var tmin = topen.min();
    var tmax = topen.max();

    var minVol = tvol.min();
    var maxVol = tvol.max();

    var open = dailyOpen[dailyOpen.length-1];
    var current = dailyOpen[0];
    var openDiff = ((current - open)/open)*100;
    var minDiff =  ((current - tmin)/tmin)*100;
    var maxDiff =  ((current - tmax)/tmax)*100;

    console.log('Change in last 100 min: '+openDiff);
    console.log('Change from low point: '+minDiff);
    console.log('Change from peak: '+maxDiff);

    if (openDiff <= -0.2 || maxDiff <= -0.2) {
      if (minDiff > 0) {
        console.log("Potential Upward Trend - up "+minDiff+'% from min point');
      } else {
        console.log('Continued downward trend - '+openDiff+'% down from open, and '+maxDiff+'% from peak');  
      }
    } else if (openDiff >= 0.2 || minDiff >= 0.2) {
      if (maxDiff < 0) {
        console.log('Starting to dip - look out for sell point');
      } else {
        console.log('Continued upward trend - '+openDiff+'% up from open, and '+minDiff+'% up from min point');
      }
    } else {
      console.log('Noise');
      // when minDiff < 0.2 || maxDiff > -0.2 && -0.2 > openDiff < 0.2
      // if (openDiff < 0) {
      //   console.log("Slightly Dipping, ")
      // }
    }

  }
}



var rule = new schedule.RecurrenceRule();

rule.minute = new schedule.Range(0, 59, 1);
request('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=TSLA&interval=1min&apikey=RVX8WRJR2THGLQ0Q', percentChange)
schedule.scheduleJob(rule, function(){
  request('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=TSLA&interval=1min&apikey=RVX8WRJR2THGLQ0Q', percentChange)
});