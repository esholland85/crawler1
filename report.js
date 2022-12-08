function sortLinks(list){
    const keys = [];
    for(const item in list){
        keys.push(item);
    }
    let swapping = true;
    while (swapping){
        swapping = false;
        for(let i = 1; i < keys.length; i++){
            if(list[keys[i-1]] < list[keys[i]]){
                let holder = keys[i-1];
                keys[i-1] = keys[i];
                keys[i] = holder;
                swapping = true;
            }
        }
    }
    return keys;
}

function printReport(pages){
    console.log('---Crawl Report---');
    const keys = sortLinks(pages);
    for(let i = 0; i < keys.length; i++){
        console.log(`The page ${keys[i]} is linked to ${pages[keys[i]]} times`);
    }
}

module.exports =  {
    printReport
}