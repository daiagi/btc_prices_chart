function AjaxGetRequest(url,successFunc,toUSD) {

  convertUTCDateToLocalDate= function (date) {
      return new Date(Date.UTC(date.getFullYear(),
       date.getMonth(), date.getDate(),
        date.getHours(), date.getMinutes(), date.getSeconds()));
       };

  function jsonToDataArrays(Jsonobj,toUSD) {
         var labels = Jsonobj.map(function (e) {return e.time}),
         lastPrices = Jsonobj[Jsonobj.length-1],
         ilsTousd = lastPrices.global_price_usd / lastPrices.global_price_ils ,
         bit2c_func,
         global_func;
         if (toUSD) {

          bit2c_func = function(e) {
             return Number(e.bit2c_price_ils*ilsTousd).toFixed(2);
           };
           global_func = function(e) {
             return Number(e.global_price_usd).toFixed(2);
           };
         }
         else {
          bit2c_func = function(e) {
             return Number(e.bit2c_price_ils).toFixed(2);
           };
           global_func = function(e) {
             return Number(e.global_price_usd/ilsTousd).toFixed(2);
           };
         }

         var bit2c_data = Jsonobj.map(bit2c_func),
            global_data = Jsonobj.map(global_func);


         return {labels : labels,
                 bit2c : bit2c_data,
                 global : global_data};
       }



// parse json to object
  var parseJson=function(string_data,toUSD){
    var data = JSON.parse(string_data);
    data.forEach(function (element){
        element.time = convertUTCDateToLocalDate(new Date(element.time))
    });

    return jsonToDataArrays(data,toUSD);
  };
// ajax call with successFunc
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var d  = parseJson(this.responseText,toUSD);
      if (toUSD === undefined) {toUSD = false}
        successFunc(d);

    }
  };

  xhttp.open('get',url);
  xhttp.send();

};







// on document ready event
$(document).ready(function(){
  url = jsonUrl + '?' + 'days=1';
  AjaxGetRequest(url,initialRender);

})

// on range button click event
function RangeBtnClick(rangeString){
  toUSD = !$('#currency-toggle').prop('checked')
  url = jsonUrl + '?' + rangeString;
   AjaxGetRequest(url,render,toUSD);

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

var jsonUrl = '/json'
