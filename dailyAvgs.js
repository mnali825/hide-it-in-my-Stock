var request = require('request');
var timeseries = require("timeseries-analysis");
var regression = require('regression');
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
    var data = raw['Time Series (Daily)'];

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

    for(var obj in data) {
      var open = Number(data[obj]['1. open']);
      var high = Number(data[obj]['2. high']);
      var low = Number(data[obj]['3. low']);
      var close = Number(data[obj]['4. close']);
      var volume = Number(data[obj]['5. volume']);

      var avg = (open + high + low + close)/4;

      days.push(obj);
      dailyOpen.push(open);
      dailyHigh.push(high);
      dailyLow.push(low);
      dailyClose.push(close);
      dailyAvg.push(avg);
      dailyVol.push(volume);

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
    var volAvg50 = average(dailyVol.slice(0,50));

    // GET AVERAGE LAST 25
    var openAvg25 = average(dailyOpen.slice(0,25));
    var highAvg25 = average(dailyHigh.slice(0,25));
    var lowAvg25 = average(dailyLow.slice(0,25));
    var closeAvg25 = average(dailyClose.slice(0,25));
    var allAvg25 = average(dailyAvg.slice(0,25));
    var volAvg25 = average(dailyVol.slice(0,25));

    // GET AVERAGE LAST 7
    var openAvg7 = average(dailyOpen.slice(0,7));
    var highAvg7 = average(dailyHigh.slice(0,7));
    var lowAvg7 = average(dailyLow.slice(0,7));
    var closeAvg7 = average(dailyClose.slice(0,7));
    var allAvg7 = average(dailyAvg.slice(0,7));
    var volAvg7 = average(dailyVol.slice(0,7));

    // GET AVERAGE LAST 3
    var openAvg3 = average(dailyOpen.slice(0,3));
    var highAvg3 = average(dailyHigh.slice(0,3));
    var lowAvg3 = average(dailyLow.slice(0,3));
    var closeAvg3 = average(dailyClose.slice(0,3));
    var allAvg3 = average(dailyAvg.slice(0,3));
    var volAvg3 = average(dailyVol.slice(0,3));

    // GET AVERAGE LAST 2
    var openAvg2 = average(dailyOpen.slice(0,2));
    var highAvg2 = average(dailyHigh.slice(0,2));
    var lowAvg2 = average(dailyLow.slice(0,2));
    var closeAvg2 = average(dailyClose.slice(0,2));
    var allAvg2 = average(dailyAvg.slice(0,2));
    var volAvg2 = average(dailyVol.slice(0,2));

    // GET AVERAGE LAST 1
    var openAvg1 = average(dailyOpen.slice(0,1));
    var highAvg1 = average(dailyHigh.slice(0,1));
    var lowAvg1 = average(dailyLow.slice(0,1));
    var closeAvg1 = average(dailyClose.slice(0,1));
    var allAvg1 = average(dailyAvg.slice(0,1));
    var volAvg1 = average(dailyVol.slice(0,1));

    var allVol = [volAvg1,volAvg2,volAvg3,volAvg7,volAvg25,volAvg50].reverse();
    var volOverTime = [];
    for (i = 0; i < volOverTime.length; i++) {
      volOverTime.push[i,allVol[i]];
    }
    var volRegression = regression.linear(volOverTime).equation[0];

    // FORCASTS
    var topen = new timeseries.main(timeseries.adapter.fromArray(dailyOpen));
    var thigh = new timeseries.main(timeseries.adapter.fromArray(dailyHigh));
    var tlow = new timeseries.main(timeseries.adapter.fromArray(dailyLow));
    var tclose = new timeseries.main(timeseries.adapter.fromArray(dailyClose));
    var tavg = new timeseries.main(timeseries.adapter.fromArray(dailyAvg));
    var tvol = new timeseries.main(timeseries.adapter.fromArray(dailyVol));

    var movingAvgOpen = topen.ma().output();
    var movingAvgHigh = thigh.ma().output();
    var movingAvgLow = tlow.ma().output();
    var movingAvgClose = tclose.ma().output();
    var movingAvgAvg = tavg.ma().output();
    var movingAvgVol = tvol.ma().output();


    var dataSet = tavg.data.slice(0,10);

    // We calculate the AR coefficients of the 10 previous points
    var coeffs = tavg.ARMaxEntropy({
        data: dataSet
    });

    var forecast  = 0;  // Init the value at 0.
    for (var i=0;i<coeffs.length;i++) { // Loop through the coefficients
        forecast -= tavg.data[10-i][1]*coeffs[i];
    }

    // // Now we remove the noise from the data and save that noiseless data so we can display it on the chart
    // tavg.smoother({period:4}).save('smoothed');
     
    // // Find the best settings for the forecasting:
    // var bestSettings = tavg.regression_forecast_optimize(); // returns { MSE: 0.05086675645862624, method: 'ARMaxEntropy', degree: 4, sample: 20 }
     
    // // Apply those settings to forecast the n+1 value
    // var fullForecast = tavg.sliding_regression_forecast({
    //     sample:   bestSettings.sample,
    //     degree:   bestSettings.degree,
    //     method:   bestSettings.method
    // }).output();
    
    // console.log(fullForecast);

    console.log(ticker + ' (Current Price: '+dailyOpen[0]+')');
    console.log(requestTime);
    console.log(info);
    console.log('=================================================');
    console.log("forecast: "+forecast);
    console.log('=================================================');
    // console.log('Volume regression slope: '+volRegression);
    // console.log('=================================================');

    // CHECK IF VOLUME IS GOING DOWN, WHILE PRICE IS INCREASING OR STAYING THE SAME


    // var values1 = [
    //   ['50', openAvg50, highAvg50, lowAvg50, closeAvg50, allAvg50, volAvg50],
    //   ['25', openAvg25, highAvg25, lowAvg25, closeAvg25, allAvg25, volAvg25],
    //   ['7', openAvg7, highAvg7, lowAvg7, closeAvg7, allAvg7, volAvg7],
    //   ['3', openAvg3, highAvg3, lowAvg3, closeAvg3, allAvg3, volAvg3],
    //   ['2', openAvg2, highAvg2, lowAvg2, closeAvg2, allAvg2, volAvg2],
    //   ['1', openAvg1, highAvg1, lowAvg1, closeAvg1, allAvg1, volAvg1]
    // ];

    // console.table(['Range', 'Open', 'High', 'Low', 'Close', 'Average', 'Volume'], values1)

    var values2 = [
      ['Open', openAvg50, openAvg25, openAvg7, openAvg3, openAvg2, openAvg1],
      ['High', highAvg50, highAvg25, highAvg7, highAvg3, highAvg2, highAvg1],
      ['Low', lowAvg50, lowAvg25, lowAvg7, lowAvg3, lowAvg2, lowAvg1],
      ['Close', closeAvg50, closeAvg25, closeAvg7, closeAvg3, closeAvg2, closeAvg1],
      ['Average', allAvg50, allAvg25, allAvg7, allAvg3, allAvg2, allAvg1],
      ['Volume', volAvg50, volAvg25, volAvg7, volAvg3, volAvg2, volAvg1]
    ];

    // console.table(['Marker', '50 Day', '25 Day', '7 Day', '3 Day', '2 Day', '1 Day'], values2);
    // VOLUME COMPARED TO AVERAGE (open, close, high, low) VALUE - 50 day avg : Most Recent
    var volumeChange50day = Math.floor(((dailyVol[0]- dailyVol[50])/dailyVol[50])*10000)/100;
    var priceChange50day = Math.floor(((dailyAvg[0]- dailyAvg[50])/dailyAvg[50])*10000)/100;
    console.log('Volume Change (50 day): '+ volumeChange50day+'%');
    console.log('Price Change: (50 day)'+ priceChange50day+'%\n');
    // var priceChange30day = Math.floor(((dailyAvg[0]-dailyAvg[30])/dailyAvg[30])*10000)/100;
    // var volumeChange30day = Math.floor(((dailyVol[0]-dailyVol[30])/dailyVol[30])*10000)/100;
    // console.log('Volume Change (30 day): '+ priceChange30day+'%');
    // console.log('Price Change (30 day): '+ volumeChange30day+'%\n');
    // var priceChange15day = Math.floor(((dailyAvg[0]-dailyAvg[15])/dailyAvg[15])*10000)/100;
    // var volumeChange15day = Math.floor(((dailyVol[0]-dailyVol[15])/dailyVol[15])*10000)/100;
    // console.log('Volume Change (15 day): '+ priceChange15day+'%');
    // console.log('Price Change (15 day): '+ volumeChange15day+'%\n');
    // var priceChange7day = Math.floor(((dailyAvg[0]-dailyAvg[7])/dailyAvg[7])*10000)/100;
    // var volumeChange7day = Math.floor(((dailyVol[0]-dailyVol[7])/dailyVol[7])*10000)/100;
    // console.log('Volume Change (7 day): '+ priceChange7day+'%');
    // console.log('Price Change (7 day): '+ volumeChange7day+'%\n');
  }
}


var tickerSymbol = ['TSLA', 'FB', 'AMZN','NFLX','GOOGL','AAPL'];

for (i= 0; i < tickerSymbol.length; i++) {
  request('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+tickerSymbol[i]+'&apikey=RVX8WRJR2THGLQ0Q', getAverages);  
}
