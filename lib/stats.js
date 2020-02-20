const chalk = require('chalk');

let newUnique;
let unique;
let total = 3;
let countBroken = 0;
let options = {
    validate: true,
    stats: true
}


const uniqueLinks = (link) => {
    newUnique = [...new Set(link)];
    unique = newUnique.length;
    console.log(newUnique);
    console.log(unique);
  return newUnique, unique;
};

let links = ['http://www.github.com', 'https://www.google.cl/', 'https://www.google.cl/'];
uniqueLinks(links);

let statsLinks = (total, unique, countBroken, options) => {
    
    if(options.validate === true && options.stats === true){
        console.log('Total: ' + total);
        console.log('Unique: ' + unique);
        console.log('Broken: ' + countBroken);
    }
    else if(options.stats === true){
        console.log('Total: ' + total);
        console.log('Unique: ' + unique);
    }

};



statsLinks(total, unique, countBroken, options);
