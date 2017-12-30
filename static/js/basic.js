button_1h = document.getElementById("1h");
button_1h.dataString = 'hours=1';
button_1h.addEventListener("click", getAjax);

button_12h = document.getElementById("12h");
button_12h.dataString = 'hours=12';
button_12h.addEventListener("click", getAjax);

button_1d = document.getElementById("1d");
button_1d.dataString = 'days=1';
button_1d.addEventListener("click", getAjax);

var jsonUrl = 'http://127.0.0.1:8000/json/'

$(document).ready(function(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var d  = parseJson(this.responseText);
      onLoad(d);

    }
  };

  xhttp.open('get',jsonUrl + '?' + 'days=1');
  xhttp.send();

})


function getAjax(event) {

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var d  = parseJson(this.responseText);
      updateData(d);

    }
  };

  xhttp.open('get',jsonUrl + '?' + event.target.dataString);
  xhttp.send();

}





function parseJson(string_data){
  data = JSON.parse(string_data)
  // for (i=0;i<data.length;i++){
  //   data[i].time = i
  // }
  data.forEach(function (element){
      element.time = new Date(element.time)
  });
  return data
}
