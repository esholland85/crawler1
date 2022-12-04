const {getURLsFromHTML} = require('./crawl.js');

function main(){
    if(process.argv.length < 3){
        console.log('Missing base URL');
        return
    }
    if(process.argv.length > 3){
        console.log('Too many arguments')
        return
    }
    
    getURLsFromHTML(process.argv[2]).then(links => console.log(links));
}

main()