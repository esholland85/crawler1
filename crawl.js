// npm run start

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

let myDOM = null;
const testHTML = 
(`<html>
    <body>
        <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
        <a href="https://google.com"><span>Go to Boot.dev</span></a>
    </body>
</html>`)

function normalizeURL (urlString) {
    let myURL = null;

    try{
        myURL = new URL(urlString);
    }
    catch{
        //default URL parsing won't take an input without a scheme, and seems to take any input with a scheme.
        //as long as the rest of the code only sends in legitimate urls, this should fix any missing the scheme.
        myURL = new URL('http://' + urlString);
        console.log('This may not be a URL. If things are breaking, check here.');
    }

    //make sure path doesn't have any trailing /
    let cleanPath = myURL.pathname;
    if (cleanPath[cleanPath.length-1] === '/'){
        cleanPath = cleanPath.slice(0,cleanPath.length-1);
    }

    result = myURL.protocol + '//' + myURL.host + cleanPath

    return result;
}

//not using baseURL; double check intended use case
async function getURLsFromHTML(targetURL, baseURL){
    const cleanURL = normalizeURL(targetURL);
    myDOM = await JSDOM.fromURL(cleanURL);
    //myDOM = new JSDOM(testHTML);
    myAnchors = myDOM.window.document.querySelectorAll('a');
    myDOM.window.close();

    const myLinks = [];
    for(let i = 0; i < myAnchors.length;i++){
        myLinks.push(myAnchors[i].href);
    }
    return myLinks;
}

//getURLsFromHTML('https://blog.boot.dev', 'https://blog.boot.dev').then(links => console.log(links));

module.exports =  {
    normalizeURL,
    getURLsFromHTML
}