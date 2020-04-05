const https = require('https');
const fs = require('fs')

var download = function(url, dest) {
    var file = fs.createWriteStream(dest);
    var request = https.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close();  // close() is async, call cb after close completes.
      });
    }).on('error', function(err) { // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
    });
  };

const githubRepo = 'https://raw.githubusercontent.com/prebid/headerbid-expert/master'
const url = `${githubRepo}/bidderPatterns.js`
const dest = 'bidders.js'    
download(url, dest)