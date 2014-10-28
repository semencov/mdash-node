var http = require("http");
var EMT = require('./out/lib/emt.js');


var text = "...Когда В.И.Пупкин увидел в газете ( это была &quot;Газета <a>\"Сермяжная правда\"</a>&quot; №45) рубрику <a>Weather</a>&copy; Forecast(r), он <span>не поверил</span> своим <span=\"test_class\">глазам</span> - температуру обещали +-451F.<p>\"Мы недавно приобрели новый монитор \"Самсунг\" с диагональю 27\" дюймов&quot;</p><p>\"Эдиториум.ру\" - сайт, созданный по материалам сборника \"О редактировании и редакторах\" Аркадия Эммануиловича Мильчина, который с 1944 года коллекционировал выдержки из статей, рассказов, фельетонов, пародий, писем и книг, где так или иначе затрагивается тема редакторской работы. Эта коллекция легла в основу обширной антологии, представляющей историю и природу редактирования в первоисточниках.";

var a = new EMT();
a.debug_on();
a.log_on();
a.set_text(text);
var text_formatted = a.apply();
console.log(text_formatted);
// console.log(a.logs);

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js\"></script>\n" +
    "<script>" + 
    "$(function(){ \n" +
      "var text = encodeURIComponent($('.orig').html());\n" +
      "var uri = 'http://mdash.ru/api.v1.php?text=' + text;\n" +
      "$.getJSON(\"http://query.yahooapis.com/v1/public/yql?\" +" +
        "\"q=select%20*%20from%20json%20where%20url%3D%22\" +" +
        "encodeURIComponent(uri) +" +
        "\"%22&format=json'&callback=?\","+
        "function(data) {" +
          "console.log(data);" +
          "$('#remote').html(data.results[0].replace(\/<\\/?result>\/gi, ''));\n" +
          "$('#remote').html($('#remote').text());\n" +
        "});" +
    "});</script><div style=\"width:300px\" class=\"orig\">" + text + "</div>\n<hr/>\n" + "<div style=\"width:300px\" class=\"formatted\">" + text_formatted + "</div>\n<hr />\n<div style=\"width:300px\" id=\"remote\"></div>\n");
  response.end();
}).listen(8888);