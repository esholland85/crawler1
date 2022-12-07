// npm run start

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

//double check this function versus cheat implementation, make sure it's doing what's intended
function normalizeURL (urlString) {
    let myURL = null;

    try{
        myURL = new URL(urlString);
    }
    catch{
        //commented out section seemed to be the only way to input URLs that don't have a protocol, but it also seemed to be making some other problems, so I'm removing it for now and trying to follow
        //myURL = new URL('http://' + urlString);
        //console.log(`${myURL} may not be a URL. If things are breaking, check here.`);

        console.log(`${urlString} is not a functional URL`);
        return
    }

    //make sure path doesn't have any trailing /
    let cleanPath = myURL.pathname;
    if (cleanPath[cleanPath.length-1] === '/'){
        cleanPath = cleanPath.slice(0,cleanPath.length-1);
    }

    result = `${myURL.host}${cleanPath}`;

    return result;
}

//create and return a list of all links on the page
async function getURLsFromHTML(targetHTML, baseURL){
    let myDOM = new JSDOM(targetHTML);

    myAnchors = myDOM.window.document.querySelectorAll('a');
    myDOM.window.close();

    const myLinks = [];
    for(let i = 0; i < myAnchors.length;i++){
        if(myAnchors[i].href.slice(0,1) === '/'){
            try {
                myLinks.push(new URL(myAnchors[i].href, baseURL).href);
            }
            catch (error){
                console.log(`${error.message}: ${myAnchors[i].href}`);
            }
        }
        else{
            try {
                myLinks.push(new URL(myAnchors[i].href).href);
            }
            catch (error){
                console.log(`${error.message}: ${myAnchors[i].href}`);
            }
        }
    }
    return myLinks;
}

//my original interpretation got the HTML from a URL and pulled links out in one function. For the sake of following along, I'll set this aside for now.
async function getURLsFromURL(targetURL, baseURL){
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

async function crawlPage(targetURL,baseURL, pages){
    const targetURLObj = new URL(targetURL);
    const baseURLObj = new URL(baseURL);
    if(targetURLObj.host !== baseURLObj.host){
        //update pages here or when calling the crawl so this URL isn't tried again
        return pages;
    }

    const cleanURL = normalizeURL(targetURL);

    if(pages[cleanURL] > 0){
        pages[cleanURL]++;
        return pages
    }
    else{
        pages[cleanURL] = 1;
    }
    console.log(`Crawling ${cleanURL}`);
    let myHTML = ''
    try{
        const page = await fetch(targetURL);
        if(page.status > 399){
            console.log('Page not found');
            return pages
        }
        const contentType = page.headers.get('content-type');
        if(!contentType.includes('text/html')){
            console.log(`Looking for HTML, found: ${contentType}`);
            return pages
        }
        //console.log(await page.text());
        myHTML = await page.text();
    }
    catch(error){
        console.log(error.message);
    }

    //crawlTargets is currently returning non-valid URLs that immediately crash the crawl as the next loop tries to make it a URL object
    const crawlTargets = await getURLsFromHTML(myHTML, baseURL);
    for(let i = 0; i < crawlTargets.length; i++){
        console.log(`crawl ${i}: ${crawlTargets[i]}`)
        pages = await crawlPage(crawlTargets[i], baseURL, pages);
    }
    return pages;
}

//getURLsFromHTML('https://blog.boot.dev', 'https://blog.boot.dev').then(links => console.log(links));

module.exports =  {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}