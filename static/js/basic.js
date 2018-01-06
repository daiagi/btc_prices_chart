function AjaxGetRequest(url,successFunc,toUSD) {

  var USDRate = function() {
    apiURL = "https://api.fixer.io/latest?base=ILS&symbols=USD"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        json_obj = JSON.parse(this.responseText);
        return json_obj.rates.USD;
      }
    };

    xhttp.open('get',apiURL,false);
    xhttp.send();
    return xhttp.onreadystatechange()
  };



// parse json to object
  var parseJson=function(string_data,toUSD){
    if (toUSD === undefined) {toUSD = false }
    var data = JSON.parse(string_data);
    data.forEach(function (element){
        element.time = new Date(element.time)
    });
    if (toUSD === true) {
      var ils_to_usd = USDRate();
      data.forEach(function(element) {
        element.bit2c_price = element.bit2c_price*ils_to_usd;
        element.global_price = element.global_price*ils_to_usd;
        // console.log(element);
      });
    };
    return data;
  };
// ajax call with successFunc
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var d  = parseJson(this.responseText,toUSD);
      successFunc(d);
    }
  };

  xhttp.open('get',url);
  xhttp.send();
};

// on document ready event
$(document).ready(function(){
  url = jsonUrl + '?' + 'days=1';
  AjaxGetRequest(url,onLoad);

})

// on range button click event
function RangeBtnClick(rangeString){
  toUSD = !$('#currency-toggle').prop('checked')
  url = jsonUrl + '?' + rangeString;
   AjaxGetRequest(url,updateData,toUSD);

};

var current_range = 'days=1'

$('#currency-toggle').change(function() {
      RangeBtnClick(current_range)
    });

// bind events to range buttons
document.getElementById("btn_1h")
            .addEventListener("click",function(){
              current_range = 'hours=1'
              RangeBtnClick(current_range)});

document.getElementById("btn_12h")
        .addEventListener("click",function(){
          current_range = 'hours=12'
          RangeBtnClick('hours=12')});

document.getElementById("btn_1d")
        .addEventListener("click",function(){
          current_range = 'days=1'
          RangeBtnClick('days=1')});

var jsonUrl = 'http://127.0.0.1:8000/json/'
