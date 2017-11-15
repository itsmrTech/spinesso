/**
 * SpinController
 *
 * @description :: Server-side logic for managing spins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var google = require('google-search-scraper');
var request=require('request');
var cheerio=require('cheerio');
const english = require('an-array-of-english-words');
var htmlToText = require('html-to-text');



var Website=require('../models/Website');

var parser = function (text) {
    var seprators = [' ', '/', '.', ',', '?', '>', '<', '""', "''", ';', ':', '\\', ']', '[', '}', '{', '+', '=', '-', '_', ')', '(', '*', '&', '^', '%', '$', '#', '@', '!', '~', '`', '\n', '\t'];
    
    ///////////////////////////////////////////
    //todo:repeted seprators should be handled
    //////////////////////////////////////////

    seprators.forEach(function (char) {
        text = text.replace(char, " ");
    })
    if (text.endsWith(" ")) { //so the last char is " " and should be removed
        text = text.slice(0, text.length - 1);
    }
    var words = [];
    while (text.lastIndexOf(" ") != -1) {
        //Handeling multiple " " (spaces)
        while (text.startsWith(" ")) {
            text = text.slice(text.indexOf(" ") + 1);
        }
        if (text.lastIndexOf(" ") != -1) {
            words.push(text.slice(0, text.indexOf(" ")));
            text = text.slice(text.indexOf(" ") + 1);
        }
    }
    words.push(text);
    return words;
}
var search=(word,callback,scraping)=>{
    var options = {
        query: word,
        limit: 10
    };
    var i=0;
    var _i=_.random(0,9);
    // console.log('i',i)
    google.search(options, (err, url) => {
        console.log(err,url);
        
        if(err) return setTimeout(()=>google.search(options,()=>{}),_.random(10000,400000));
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(body);
                const webpageTitle = $("title").text();
                const metaDescription =  $('meta[name=description]').attr("content");
                const webpage = {
                  title: webpageTitle,
                  metaDescription: metaDescription
                }
                // console.log(webpage);
                var text = htmlToText.fromString(body);
                var arrayText=parser(text);
                arrayText=_.shuffle(arrayText);

                
                process.nextTick(()=>search(arrayText[0],(response)=>{},true), 10000);
                
                Website.findOrCreate({url},{url,title:webpageTitle,description:metaDescription,body:body,text:text},(err,doc)=>{
                    console.log('saved',err,doc);
                    callback();
                });
                if(i==_i&&!scraping){
                    callback({webpage,word:word,i});
                }
                i++;
                
            }
        });
    })
}
var word=english[_.random(0,english.length)];
search(word,(response)=>{
    // res.status(200).json(response)            
})
module.exports = {
    index: (req, res) => {
        var word=english[_.random(0,english.length)];
        search(word,(response)=>{
            res.status(200).json(response)            
        })
    },
    get:(req,res)=>{
        
    }
};
