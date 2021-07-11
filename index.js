var fs = require('fs');
var parse = require('csv-parse');

var myData = [];
fs.createReadStream('./data/Danh sách cấp tỉnh kèm theo quận huyện, phường xã ___11_07_2021.csv')
    .pipe(parse({ delimiter: ':' }))
        .on('data', function (row) {
            // console.log(row);
            //do something with row
            myData.push(row);
        })
        .on('end', function () {
            //do something with csvData
            console.log(myData);
        });