var request = require('request');
require('console.table');

function average(arr) {
  sum = 0;
  arr.forEach(function(ele) {
    sum = sum + ele;
  });
  return Math.round((sum/arr.length)*100)/100
}

function getAverages(err, res, body) {
  if (!err && res.statusCode === 200) {
    var raw = JSON.parse(body);

    var meta = raw['Meta Data'];
    var data = raw['Time Series (1min)'] || raw['Time Series (Daily)'];

    var info = meta['1. Information'];
    var ticker = meta['2. Symbol'];
    var requestTime = meta['3. Last Refreshed'];

    var dailyOpen = [];
    var dailyClose = [];
    var dailyHigh = [];
    var dailyLow = [];
    var dailyAvg = [];
    var days = [];
    var borderColor = [];
    var backgroundColor = [];

    for(var obj in data) {
      var open = Number(data[obj]['1. open']);
      var high = Number(data[obj]['2. high']);
      var low = Number(data[obj]['3. low']);
      var close = Number(data[obj]['4. close']);

      var avg = (open + high + low + close)/4;

      days.push(obj);
      dailyOpen.push(open);
      dailyHigh.push(high);
      dailyLow.push(low);
      dailyClose.push(close);
      dailyAvg.push(avg);
    }

    var high100 = dailyHigh.reduce(function(a,b){
      return Math.max(a,b);
    });
    var high50 = dailyHigh.slice(0,50).reduce(function(a,b){
      return Math.max(a,b);
    });
    var high25 = dailyHigh.slice(0,25).reduce(function(a,b){
      return Math.max(a,b);
    });
    var high7 = dailyHigh.slice(0,7).reduce(function(a,b){
      return Math.max(a,b);
    });
    var high3 = dailyHigh.slice(0,3).reduce(function(a,b){
      return Math.max(a,b);
    });

    var low100 = dailyHigh.reduce(function(a,b){
      return Math.min(a,b);
    });
    var low50 = dailyHigh.slice(0,50).reduce(function(a,b){
      return Math.min(a,b);
    });
    var low25 = dailyHigh.slice(0,25).reduce(function(a,b){
      return Math.min(a,b);
    });
    var low7 = dailyHigh.slice(0,7).reduce(function(a,b){
      return Math.min(a,b);
    });
    var low3 = dailyHigh.slice(0,3).reduce(function(a,b){
      return Math.min(a,b);
    });

    // GET AVERAGES LAST 100
    var openAvg = average(dailyOpen);
    var highAvg = average(dailyHigh);
    var lowAvg = average(dailyLow);
    var closeAvg = average(dailyClose);
    var allAvg = average(dailyAvg);

    // GET AVERAGE LAST 50
    var openAvg50 = average(dailyOpen.slice(0,50));
    var highAvg50 = average(dailyHigh.slice(0,50));
    var lowAvg50 = average(dailyLow.slice(0,50));
    var closeAvg50 = average(dailyClose.slice(0,50));
    var allAvg50 = average(dailyAvg.slice(0,50));

    // GET AVERAGE LAST 25
    var openAvg25 = average(dailyOpen.slice(0,25));
    var highAvg25 = average(dailyHigh.slice(0,25));
    var lowAvg25 = average(dailyLow.slice(0,25));
    var closeAvg25 = average(dailyClose.slice(0,25));
    var allAvg25 = average(dailyAvg.slice(0,25));

    // GET AVERAGE LAST 7
    var openAvg7 = average(dailyOpen.slice(0,7));
    var highAvg7 = average(dailyHigh.slice(0,7));
    var lowAvg7 = average(dailyLow.slice(0,7));
    var closeAvg7 = average(dailyClose.slice(0,7));
    var allAvg7 = average(dailyAvg.slice(0,7));

    // GET AVERAGE LAST 3
    var openAvg3 = average(dailyOpen.slice(0,3));
    var highAvg3 = average(dailyHigh.slice(0,3));
    var lowAvg3 = average(dailyLow.slice(0,3));
    var closeAvg3 = average(dailyClose.slice(0,3));
    var allAvg3 = average(dailyAvg.slice(0,3));

    // GET AVERAGE LAST 2
    var openAvg2 = average(dailyOpen.slice(0,2));
    var highAvg2 = average(dailyHigh.slice(0,2));
    var lowAvg2 = average(dailyLow.slice(0,2));
    var closeAvg2 = average(dailyClose.slice(0,2));
    var allAvg2 = average(dailyAvg.slice(0,2));

    // GET AVERAGE LAST 1
    var openAvg1 = average(dailyOpen.slice(0,1));
    var highAvg1 = average(dailyHigh.slice(0,1));
    var lowAvg1 = average(dailyLow.slice(0,1));
    var closeAvg1 = average(dailyClose.slice(0,1));
    var allAvg1 = average(dailyAvg.slice(0,1));



    console.log(ticker)
    console.log(requestTime)
    console.log(info)
    console.log('=================================================');
    

    var values = [
      ['50', openAvg50, highAvg50, lowAvg50, closeAvg50, allAvg50],
      ['25', openAvg25, highAvg25, lowAvg25, closeAvg25, allAvg25],
      ['7', openAvg7, highAvg7, lowAvg7, closeAvg7, allAvg7],
      ['3', openAvg3, highAvg3, lowAvg3, closeAvg3, allAvg3],
      ['2', openAvg2, highAvg2, lowAvg2, closeAvg2, allAvg2],
      ['1', openAvg1, highAvg1, lowAvg1, closeAvg1, allAvg1],
    ];

    console.table(['Range', 'Open', 'High', 'Low', 'Close', 'Average'], values)

  }
}

// request('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=TSLA&interval=1min&apikey=RVX8WRJR2THGLQ0Q', getAverages);
request('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=TSLA&apikey=RVX8WRJR2THGLQ0Q', getAverages);

