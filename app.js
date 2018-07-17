var moment = require("moment");
var fs = require('fs');
var setup = {
    year: [2018],
    months: [],
    days: [],
    hours: [000,0100,0200,0300,0400,0500,0600,0700,0800,0900,1000,1100,1200,1300,1400,1500,1600,1700,1800,1900,2000,2100,2200,2300],
    webpages: [
        "/index.html",
        "batch/index.html",
        "pentrist/index.html",
        "hotmail/index.html",
        "google/index.html"
    ]
}
for(var i = 0; i <= 24; i++){
    setup.hours.push(i);
}
for(var i = 0; i <= 11; i++){
    setup.months.push(i);
}
for(var i = 0; i <= 31; i++){
    setup.days.push(i);
}

function getWCRWebcontentStat(){
    return {
        TIMESTAMPHOUR: null,
        AGGREGATIONLEVEL: null,
        COUNTER: null,
        PCDURL: null,
        OBJECTTYPE: null,
        IMPRESSIONS: null,
        VISITS: null,
        CUSTOM: null,
        ID: null
    };
}
function getMonthData(data, callback){
    var obj = [];
    data.months.forEach(function(value){
        data.days.forEach(function(valueA){
            data.days.forEach(function(valueB){
                var te = moment([2018, 0, 1])
                    .set('month', value)
                    .set('day', valueA)
                    .set('hour', valueB)
                    .format(moment.HTML5_FMT.DATETIME_LOCAL);
                var newObj = getWCRWebcontentStat();
                newObj.TIMESTAMPHOUR = te.toString();
                callback(newObj);
                obj.push(newObj);
            });
        });
    });
    return obj;
}

var r = getMonthData(setup, function(data){
    data.IMPRESSIONS = Math.floor(Math.random() * 50) + 0;
    var start = (data.VISITS > 0)?2:0;
    data.VISITS = Math.floor(Math.random() * 10) + start;
    data.AGGREGATIONLEVEL = "h";
    data.OBJECTTYPE = "iView";
    data.CUSTOM = setup.webpages[Math.floor(Math.random() * setup.webpages.length) + 0];

});

var json = JSON.stringify(r, null, '\t');
fs.writeFile('hit-hourly.json', json, 'utf8', function(){

});
var e = r.reduce(function(acc, value){
    var x = moment( this.lastTimeStamp).format("YYYY-MM-DD");
    var y = moment(value.TIMESTAMPHOUR).format("YYYY-MM-DD");
    if(x !== y){
        var de = value;
        de.AGGREGATIONLEVEL = "d";
        de.VISITS = acc.VISITS;
        de.IMPRESSIONS = acc.IMPRESSIONS;
        acc.ae.push(de);

        acc.VISITS = 0;
        acc.IMPRESSIONS = 0;
    }else {
        acc.VISITS += value.VISITS;
        acc.IMPRESSIONS += value.IMPRESSIONS;
    }
    this.lastTimeStamp = value.TIMESTAMPHOUR;
    return acc;
}, {
    ae: [],
    VISITS: 0,
    IMPRESSIONS: 0,
    lastTimeStamp: null
})
var json = JSON.stringify(e.ae, null, '\t');
fs.writeFile('hit-daily.json', json, 'utf8', function(){

});
console.log(e);

//moment( value.TIMESTAMPHOUR,"DD-MM-YYYY").isSame(value.TIMESTAMPHOUR,"DD-MM-YYYY");
// r.reduce(function(acc, value){
//     moment( value.TIMESTAMPHOUR,"DD-MM-YYYY");
   
//     console.log(value);
// }, [])
//console.log(r);


