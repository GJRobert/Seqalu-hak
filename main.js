function fillHakNames() {
  // var nodes = document.getElementById("EP7").getElementsByTagName("tr") + document.getElementById("EP8").getElementsByTagName("tr");
  var nodes = document.getElementsByTagName('tr');
  for (var i=0; i<nodes.length; i+=2) {
    if (nodes[i].classList.contains("fr")) {
      continue;
    }
    else {
      var k = i + 1; //奇數行
      var name = nodes[k].getElementsByTagName('td')[0].innerHTML.replace("：","").replace(' ','').replace(' ','').replace("&nbsp;","");
      // var names = JSON.parse(document.getElementById('names').innerHTML);
      if (names[name] == undefined) {
        name = name.replace(/\d/,'');
        if (names[name] == undefined) {
          nodes[k].getElementsByTagName('td')[0].innerHTML = nodes[k].getElementsByTagName('td')[0].innerHTML.replace(/\d/,'');
          continue;
        }
        else {
          nodes[i].getElementsByTagName('td')[0].innerHTML = names[name][0] + ":&nbsp;";
        }
      }
      else {
        nodes[i].getElementsByTagName('td')[0].innerHTML = names[name][0] + ":&nbsp;";
      }
      nodes[k].getElementsByTagName('td')[0].innerHTML = nodes[k].getElementsByTagName('td')[0].innerHTML.replace(/\d/,'');
    }
  }
}

function useHL() {

  var nodes = document.getElementsByTagName("tr");
  for (var i=0; i<nodes.length; i+=2) {
    var j = i / 2;
    // nodes[i].getElementsByTagName('td')[0].innerHTML += " " + j; // 除錯用
    var rowclass = nodes[i].getAttribute('class');
    //if (nodes[i].hasAttribute('class')) {
    if (nodes[i].hasAttribute('class') && (rowclass.includes('fr') || rowclass.includes('lang'))) {
        continue;
      }
      else if (HL[j] == undefined) {
        nodes[i].getElementsByTagName('td')[1].innerHTML = "";
        // continue;
      }
      else {
        nodes[i].getElementsByTagName('td')[1].innerHTML = HL[j];
      }

    //}
    
    var k = i + 1;
    var name = nodes[k].getElementsByTagName('td')[0].innerHTML.replace("：","").replace(' ','').replace(' ','').replace("&nbsp;","");
    // var names = JSON.parse(document.getElementById('names').innerHTML);
    if (names[name] == undefined) {
      continue;
    }
    else {
      nodes[i].getElementsByTagName('td')[0].innerHTML = names[name][1] + ":&nbsp;";
    }
  }

  var hakvar = document.getElementById('hakvar');
  hakvar.setAttribute('href', 'HL.css');
}

function create() {
  // 參考另一個 branch 的進度：Seqalu-hak/hak-lines.html at aec3dad6f0a0c71777a41b5f0c2cce41896de1f4 · GJRobert/Seqalu-hak <https://github.com/GJRobert/Seqalu-hak/blob/aec3dad6f0a0c71777a41b5f0c2cce41896de1f4/hak-lines.html>

  var contentContainer = document.getElementById("generated");

  for (var i=0; i<data.length; i++) {

    var ep = document.createElement("div");
    ep.setAttribute("id", "EP"+data[i].EP);
    ep.setAttribute("class", "episode");
    if (data[i].draft == true) {ep.setAttribute("class","draft episode");}
    var h1 = document.createElement("h1");
    h1.innerHTML = "<p>EP" + data[i].EP + " " + data[i].title + "</p>";
    ep.appendChild(h1);

    for (var j=0; j<data[i].sections.length; j++) {

      var section = document.createElement("section");

      var time = document.createElement("span");
      time.classList.add("time");
      time.innerHTML = data[i].sections[j].t;
      section.appendChild(time);

      var table = document.createElement("table");

      for (var k=0; k<data[i].sections[j].rows.length; k++) {
        var tr1 = document.createElement("tr");
        var tr2 = document.createElement("tr");
        if (data[i].sections[j].rows[k][2] === undefined) {
          data[i].sections[j].rows[k][2] = "";
        }
        tr1.innerHTML = '<td></td><td>' + data[i].sections[j].rows[k][2] + '</td>';
        var name = data[i].sections[j].rows[k][0];
        var lang = data[i].sections[j].rows[k][3];
        name = (lang === undefined) ? name : name+lang;
        if (name !== '') {
          name += "："
        }
        tr2.innerHTML = '<td>' + name + '</td><td>' + data[i].sections[j].rows[k][1] + '</td>';

        if (lang !== undefined) {
          tr1.classList += "lang"+data[i].sections[j].rows[k][3];
          tr2.classList += "lang"+data[i].sections[j].rows[k][3];
        }

        table.appendChild(tr1);
        table.appendChild(tr2);
      }

      section.appendChild(table);
      ep.appendChild(section);
    }

    if (data[i].misc !== undefined) {
      var misc = document.createElement("p");
      misc.innerHTML = data[i].misc;
      ep.appendChild(misc);
    }

    contentContainer.appendChild(ep);

  }


}

function dump() {
  var datadump = document.getElementById('datadump');
  var staticData = document.querySelectorAll('.time, tr:nth-child(2n+1) td:nth-child(2), tr:nth-child(2n) td, h1');
  staticData.forEach(function(item, i) { // JS - for 迴圈與 forEach 有什麼不同 | 卡斯伯 Blog - 前端，沒有極限 <https://wcc723.github.io/development/2020/10/05/js-for-loop-vs-for-each/>
    var row = document.createElement("xmp"); // How to display raw html code in PRE or something like it but without escaping it - Stack Overflow <https://stackoverflow.com/questions/16783708/how-to-display-raw-html-code-in-pre-or-something-like-it-but-without-escaping-it>
    //while (/\n +/.test(item.innerHTML)) {
    //  item.innerHTML.replace(/\n +/,'');
    //}
    var t = item.innerHTML;
    //if (item.tagName === 'h1') { // 這個都無效 :( 還好目前也只有 h1 裡有 <p>...</p>，所以就用後面的 method 來全部取代
    //  t.replace('EP','');
    //}
    row.innerHTML = '"' + t.replaceAll(/\n +/g,'').replace(/^ +/,'').replace(/ +$/,'').replace(/：$/,'').replace(/<br>$/,'').replace(/<p> */,'').replace(/<\/p>/,'').replace(/&nbsp;/g,'') + '",';
    row.classList = item.tagName;
    datadump.appendChild(row);
  });

  var h1 = document.querySelectorAll('xmp.H1');
  h1.forEach(function(item, i) {
    var epn = item.innerHTML.substring(3,4); // String substring() 字串切割 / 字串擷取 - JavaScript (JS) 教學 Tutorial <https://www.fooish.com/javascript/string/substring.html>
    var title = item.innerHTML.substring(5,1000);
    var ep = document.createElement('p');
    ep.innerHTML = '  {<br>    "EP": "' + epn + '",<br>    "title": "' + title + '<br>    "sections": [';
    item.innerHTML = '';
    item.appendChild(ep);
  });

  var time = document.querySelectorAll('xmp.DIV, xmp.SPAN');
  time.forEach(function(item, i) {
    var secHead = document.createElement('p');
    secHead.innerHTML = '      {<br>        "t": ' + item.innerHTML + '<br>        "rows": [';
    item.innerHTML = '';
    item.appendChild(secHead);
  });

  var rowElements = document.querySelectorAll('xmp.TD');
  for (var i=0; i<=rowElements.length; i+=3) { // 每 3 行一組
    var j = i + 1;
    var k = i + 2;

    if (rowElements[j] == undefined) {
      continue;
    }

    var r1Head = document.createElement('pre');
    var r1 = rowElements[j].innerHTML;
    var r2 = rowElements[k].innerHTML;
    var r3 = rowElements[i].innerHTML;
    var r3Foot = document.createElement('pre');
    
    datadump.insertBefore(r1Head, rowElements[i]); // Node.insertBefore() - Web APIs | MDN <https://developer.mozilla.org/zh-TW/docs/Web/API/Node/insertBefore>
    r1Head.innerHTML = '          [<br>'
    rowElements[i].innerHTML = '            ' + r1;
    rowElements[j].innerHTML = '            ' + r2;
    rowElements[k].innerHTML = '            ' + r3;
    rowElements[k].after(r3Foot); // Element.after() - Web APIs | MDN <https://developer.mozilla.org/en-US/docs/Web/API/Element/after>
    r3Foot.innerHTML = '          ],';
  }
  
  var newSecHead = document.querySelectorAll('pre+xmp.SPAN');
  newSecHead.forEach(function(item,i) {
    var secEnd = document.createElement('pre');
    datadump.insertBefore(secEnd, item);
    secEnd.innerHTML = '        ]<br>      },';
  });

  var newEpHead = document.querySelectorAll('pre+xmp.H1');
  newEpHead.forEach(function(item,i) {
    var epEnd = document.createElement('pre');
    datadump.insertBefore(epEnd, item);
    epEnd.innerHTML = '        ]<br>      }<br>    ]<br>  },';
  });

}

// html - Loading javascript in body onload with 2 functions - Stack Overflow <https://stackoverflow.com/questions/10122555/loading-javascript-in-body-onload-with-2-functions>
function init() {
  create();
  fillHakNames();
  dump();
}
