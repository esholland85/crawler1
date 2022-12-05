// npm run start

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

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

//create and return a list of all links on the page
async function getURLsFromHTML(targetURL, baseURL){
    const cleanURL = normalizeURL(targetURL);
    let myDOM = await JSDOM.fromURL(cleanURL);

    myAnchors = myDOM.window.document.querySelectorAll('a');
    myDOM.window.close();

    const myLinks = [];
    for(let i = 0; i < myAnchors.length;i++){
        myLinks.push(myAnchors[i].href, baseURL);
    }
    return myLinks;
}

async function crawlPage(targetURL){
    try{
        const page = await fetch(targetURL);
        if(page.status > 399){
            console.log('Page not found');
            return
        }
        const contentType = page.headers.get('content-type');
        if(!contentType.includes('text/html')){
            console.log(`Looking for HTML, found: ${contentType}`);
            return
        }
        //console.log(await page.text());
        return(await page.text());
    }
    catch(error){
        console.log(error.message);
    }
}

//getURLsFromHTML('https://blog.boot.dev', 'https://blog.boot.dev').then(links => console.log(links));

module.exports =  {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}