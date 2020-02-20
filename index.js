#!/usr/bin/env node

const fs = require("fs");
const fileLinks = require('./lib/links.js');
const chalk = require('chalk');

/* const arg = process.argv; */
const path = process.argv[2];
const arg2 = process.argv[3];
const arg3 = process.argv[4];

const options = {
  validate: arg2,
  stats: arg3
}

/* console.log(arg);
   console.log(arg1);
   console.log(arg2);
   console.log(arg3); 
*/

const mdLinks = (path, options) => {

  const inputOk = fileLinks.checkArg(path, options.validate, options.stats);
  console.log(inputOk);
  const absoluteOk = fileLinks.pathIsAbsolute(inputOk[0]);
  console.log(absoluteOk);

  const extension = fileLinks.checkExt(absoluteOk);
  console.log(extension);

  const stat = fs.statSync(absoluteOk);

  if(stat.isDirectory() === true){

  }
  

  else if(stat.isFile() === true) {
    
    if (extension === '.md') {

      fileLinks.readNewFile(absoluteOk)
        .then(function (res) {
          console.log(res);

          /* Rescatar links del archivo */
         

        })
    }
  } else {
  }


}

mdLinks(path, options);






