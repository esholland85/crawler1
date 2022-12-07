const {getURLsFromHTML} = require('./crawl.js');
const {crawlPage} = require('./crawl.js');

function main(){
    if(process.argv.length < 3){
        console.log('Missing base URL');
        return;
    }
    if(process.argv.length > 3){
        console.log('Too many arguments');
        return;
    }
    const baseURL = process.argv[2];

    console.log(`Crawling: ${baseURL}`);
    //getURLsFromHTML(baseURL).then(links => console.log(links));
    crawlPage(baseURL, baseURL, {}).then(response  => console.log(response));
}

main()