#!/usr/bin/env node

const fs = require("fs");
const pathMod = require("path");
const links = require('./lib/links.js');
const markdownLinkExtractor = require('markdown-link-extractor');
let fetch = require("node-fetch");

/* const arg = process.argv; */
const path = process.argv[2];
const arg2 = process.argv[3];
const arg3 = process.argv[4];

const options = {
  arg2: arg2,
  arg3: arg3
}

/* console.log(arg);
   console.log(arg1);
   console.log(arg2);
   console.log(arg3); 
*/

const mdLinks = (path, options) => {

  const inputOk = links.checkArg(path, options.arg2, options.arg3);
  console.log(inputOk);
  const absoluteOk = links.pathIsAbsolute(inputOk[0]);
  console.log(absoluteOk);

  const extension = links.checkExt(absoluteOk);
  console.log(extension);

  const stat = fs.statSync(absoluteOk);

  if(stat.isDirectory() === true){

  }
  

  else if(stat.isFile() === true) {
    
    if (extension === '.md') {

      links.readNewFile(absoluteOk)
        .then(function (res) {
          console.log(res);

          /* Rescatar links del archivo */
          const markdown = res.toString();
          const links = markdownLinkExtractor(markdown);
          let text;
          let linksExtracted = [];

          links.forEach(function (link) {
            console.log(link);
            linksExtracted = link;
            console.log(link);
          });

        })
    }
  } else {
  }


}

mdLinks(path, options);






/*const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stat) => {
      if (err) return reject(err.code);
      if (stat && stat.isDirectory()) {
        directory(path, (err, results) => {
          if (err) return reject(err.code);
          loopFile(results, options, (err, results) => {
            if (err) return reject(err.code);
            return resolve(results);
          })
        })
      } else {
        resolveFile(path, (err, results) => {
          if (err) return reject(err.code);
          return resolve(selectOptions(results, options));
        })
      }
    })

  });
}


module.exports = mdLinks;*/