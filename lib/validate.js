const fetch = require('node-fetch');
const chalk = require('chalk');

let href = 'github.com/holakjbvcxd'
let countBroken = 0;
 let arrLinks = {
    status: '',
    statusText: ''
}


/* Para un link */

let validation = (href) => {
    fetch(href)
    .then(res => {
      console.log(res.ok);
      console.log(res.status);
      console.log(res.statusText);
      /* console.log(res.headers.raw());
       console.log(res.headers.get('content-type'));*/
      arrLinks.status = res.status;
      if (res.ok === true) {
        arrLinks.statusText = 'ok';
      } else {
        arrLinks.statusText = 'fail';
        countBroken++;
      }
      console.log(arrLinks);
      newUnique = [...new Set(link)];
      console.log(countBroken);
      return arrLinks, countBroken;
    })
    .catch(err => console.error(chalk.red(err)));
};


validation(href);
   


