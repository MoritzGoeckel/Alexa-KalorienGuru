let request = require("request")
let cheerio = require("cheerio")
let iconv  = require('iconv-lite')

//data = $(quotes[q]).first().text();

const searchurl = "http://fddb.mobi/search/?lang=de&cat=mobile-de&search=";

module.exports = class{
    constructor(verbose){
        this.verbose = verbose;
    }

    search(keyword, callback){

        if(this.verbose)
            console.log("Searching for " + keyword)

        request(searchurl + keyword, {encoding: null}, function(err, res){ 
            var utf8String = iconv.decode(new Buffer(res.body), "ISO-8859-1");

            let $ = cheerio.load(utf8String);
            let links = $("a");
            let firstHit = $(links[3]);

            let hit = {name: firstHit.text(), url:firstHit.attr("href")};
            
            if(this.verbose)
                console.log(hit)

            request(hit.url, {encoding: null}, function(err, res){
                var utf8String = iconv.decode(new Buffer(res.body), "ISO-8859-1");
            
                let $ = cheerio.load(utf8String);
                hit.referenz = $("h4").first().text();
                
                let values = $("h4").first().next().find("td");
                let attrs = {};
                let lastSeenName = null;
                for(let v = 0; v < values.length; v++){
                    let theValue = $(values[v]).text();
                    if(lastSeenName == null)
                        lastSeenName = theValue;
                    else{
                        attrs[lastSeenName] = theValue;
                        lastSeenName = null;
                    }
                }

                hit.attrs = attrs;
                
                if(this.verbose)
                    console.log(hit);

                callback(hit);
            });
        })
    }
}