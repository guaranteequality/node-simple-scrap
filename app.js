const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const chalk = require('chalk')
const rp = require('request-promise');
// const youtube = require('./youtube.js');
const options = {
    uri: `https://www.oxfordonlineenglish.com/free-business-english-lessons`,
    transform: function (body) {
        return cheerio.load(body);
    }
};
const outputdir = './node-homepage'
const parsedResults = []
const pageLimit = 10
let pageCounter = 0
let resultCount = 0

rp(options).then(($) => {

    $(".element-short-top").find(".column_container").each(function (i, element) {
        var videourl = $(element).find("iframe").attr("src");
        if(videourl !== undefined) {
            videourl = videourl.split("?")[0].substring(videourl.lastIndexOf("/") + 1);
            videourl = videourl.split("&")[0];
            // console.log(videourl);
            // youtube.data.downloadfromurl(videourl);
        }

        var deepurl = $(element).find(".read-more a").attr('href');
        // console.log(deepurl);
        getWebsiteContent(deepurl, exporttextfile);
    })
});


// console.log(chalk.yellow.bgBlue(`\n  Scraping of ${chalk.underline.bold(url)} initiated...\n`))

const getWebsiteContent = async (url, exporttextfile) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);


        var title = $("h1.post-title").text();
        if (title.search(":") > 0) {
            console.log("contains ':'-->", title);
            title = title.replace(":", "-");
        }

        var text = $(".panel-body .element-short-top").text();
        // console.log(text);
        var json = {
            title: title,
            text: text
        }
        exporttextfile(json);

    } catch (error) {

        console.error(error)
    }
}

function exporttextfile(json) {
    fs.writeFile(outputdir + "/" + json.title + ".txt", json.text);
    console.log(json.title);
}
