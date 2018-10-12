var http = require('http')
var fs = require('fs')
var argv = require('optimist').argv
const baseurl = "https://www.youtube.com/watch?v=";
// var rxVideoID = /v=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/;
// var link = argv._.toString();
// var videoID = link.match(rxVideoID)[1];
var method = {};
method.downloadfromurl = async(url) => {
  console.log(baseurl+url);
  mainurl = baseurl+url
  http.get(mainurl, function(res) {
    var chunks = []
    res.on('data', function(chunk){chunks.push(chunk)
    }).on('end', function(){
      debugger
      var data = Buffer.concat(chunks).toString()
      var videoInfo = parseVideoInfo(data)
      downloadVideo(videoInfo)
    })
  }).on('error', function(e) {
    console.log("Got error: " + e.message)
  });  
}

function parseVideoInfo(videoInfo) {
    var rxUrlMap = /url_encoded_fmt_stream_map=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/

    urlmap = unescape(videoInfo.match(rxUrlMap))
    
    var rxUrlG = /url=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/g
    var rxUrl  = /url=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/
    var urls = urlmap.match(rxUrlG)
    urls = map(urls, function(s) {return s.match(rxUrl)[1]} )
    urls = map(urls, unescape)
    
    var rxTitle  = /title=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/
    var title = argv.o ? argv.o : videoInfo.match(rxTitle)[1]
    
    return { title: title, urls: urls }
}

function downloadVideo(videoInfo) {
    var url = videoInfo.urls[0];
    var filename = videoInfo.title + ".mp4"
    
    http.get(url,
      function(res) {
        var stream = fs.createWriteStream(filename)
        res.pipe(stream)
      })
      
    console.log("Downloading to "+filename);
}



function map (a,f) {
    for(i=0;i<a.length;i++){
        a[i]= f(a[i])
    }
    return a
}

exports.data = method;