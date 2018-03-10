function AjaxGetRequest(url,successFunc,toUSD) {

  convertUTCDateToLocalDate= function (dateString) {
      var date = new Date(dateString);
      return new Date(Date.UTC(date.getFullYear(),
       date.getMonth(), date.getDate(),
        date.getHours(), date.getMinutes(), date.getSeconds()));
       };

  function jsonToDataArrays(Jsonobj,toUSD) {
         var labels = Jsonobj.priceData.map(function (e) {return convertUTCDateToLocalDate(e.time)}),
         ilsTousd = Jsonobj.ilsTousd ,
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

         var bit2c_data = Jsonobj.priceData.map(bit2c_func),
            global_data = Jsonobj.priceData.map(global_func);


         return {labels : labels,
                 bit2c : bit2c_data,
                 global : global_data};
       }



// parse json to data obkect
   parseJson=function(string_data,toUSD){
    var data = JSON.parse(string_data);
    return jsonToDataArrays(data,toUSD);
  };


// ajax call with successFunc
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      latestResponse_string = this.responseText
      var dataObject  = parseJson(latestResponse_string,toUSD);
        successFunc(dataObject);

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
  var toUSD = !$('#currency-toggle').prop('checked'),
  url = jsonUrl + '?' + rangeString;
   AjaxGetRequest(url,render,toUSD);

};

var current_range = 'days=1'

$('#currency-toggle').change(function() {
      var toUSD = !$('#currency-toggle').prop('checked');
      render(parseJson(latestResponse_string,toUSD))
      return false;
    });


var btnGen = function(range) {
  return function() {current_range = range;
                      RangeBtnClick(range);};
};
// bind events to range buttons
document.getElementById("btn_1h")
            .addEventListener("click",btnGen('hours=1'));

document.getElementById("btn_12h")
        .addEventListener("click",btnGen('hours=12'));

document.getElementById("btn_1d")
        .addEventListener("click",btnGen('days=1'));

document.getElementById("btn_1w")
        .addEventListener("click",btnGen('weeks=1'));

document.getElementById("btn_1m")
        .addEventListener("click",btnGen('weeks=4'));


var jsonUrl = '/json/'

$( window ).resize(function() {

  setTimeout(() => ($( ".control_btns").width( $( "#priceChart").width()-300 ))
            ,150)


});
