const request = require('request');
const fs = require('file-system');

var links = [];
var checkedLinks = [];

initAlexaParse('netflix.com');

function initAlexaParse(link){
    var initLink = 'https://www.alexa.com/find-similar-sites/data?site=' + link;
    request(initLink, function (error, response, body) {
        let arr = analyseResponse(body);
        addUniqueLinks(arr);
    });
};

function getSimilar(link) {
    let reqLink = 'https://www.alexa.com/find-similar-sites/data?site='+link
    request(reqLink, function (error, response, body) {
        let arr = analyseResponse(body);
        addUniqueLinks(arr);
    })
}

function analyseResponse(response){
    if(response && response != 'undefined' && response != null){
        let resp = JSON.parse(response);
        let linksArray = [];
        if(resp.results !== 'undefined' &&
            resp.results
        ){
            for(let i = 0; i < resp.results.length; i++){
                if(resp.results[i]["site2"] !== 'undefined' &&
                    resp.results[i]["site2"] &&
                    resp.results[i]["site2"] !== null){
                    linksArray.push(resp.results[i]["site2"]);
                }
            }
            return linksArray
    }

    }
};

function addUniqueLinks(array) {
    if(array && array.length && array.length < 1000){
        for(let i = 0; i < array.length; i++){
            if(checkIfUnique(links, array[i])){
                links.push(array[i])
                console.log('added-link: ', array[i]);
            }
        }
        proceedParsing();
    }
    else{
        fs.writeFile('alexaLinks.json', links, 'utf8', function(err) {})
    }
};

function checkIfUnique(arr, elm) {
    return !arr.includes(elm)
};

function proceedParsing() {
    for(let i = 0; i < links.length; i++){
        if(checkIfUnique(checkedLinks, links[i])){
            checkedLinks.push(links[i]);
            getSimilar(links[i]);
        }
    }
};

