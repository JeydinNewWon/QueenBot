const jsonfile = require('jsonfile');

jsonfile.readFile('/Users/jayden.nguyen/Desktop/MyBot/data/queens/385379974951206913.json', (err, obj) => {
    obj['stampy'].push('blah');
    jsonfile.writeFile('/Users/jayden.nguyen/Desktop/MyBot/data/queens/385379974951206913.json', obj, { spaces: 4 }, (err) => {

    });
});