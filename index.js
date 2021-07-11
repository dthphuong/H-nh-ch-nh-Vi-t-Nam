var fs = require('fs');
var parse = require('csv-parse');
var utils = require('./utils');
var DateTime = require('./DateTime');
const _ = require('underscore');

let provinces = [], districts = [], wards = [];

console.log(`Start running . . . `);
fs.createReadStream('./data/Danh sách cấp tỉnh kèm theo quận huyện, phường xã ___11_07_2021.csv')
    .pipe(parse({ delimiter: ',' }))
        .on('data', function (row) {
            if (row[1] != 'Mã TP') {
                // ['Tỉnh Thành Phố,Mã TP,Quận Huyện,Mã QH,Phường Xã,Mã PX,Cấp,Tên Tiếng Anh']
                // ['Thành phố Hà Nội,01,Quận Ba Đình,001,Phường Phúc Xá,00001,Phường,']
                // console.log(row);

                //do something with row
                if (_.isUndefined(_.find(provinces, (item) => { return item.code == row[1] }))) {
                    provinces.push({
                        "name": utils.extractName(row[0]).name,
                        "slug": utils.getSlug(utils.extractName(row[0]).name),
                        "type": utils.getSlug(utils.extractName(row[0]).type),
                        "name_with_type": row[0],
                        "code": row[1],
                        "isDeleted": false
                    })
                }

                if (_.isUndefined(_.find(districts, (item) => { return item.code == row[3] }))) {
                    districts.push({
                        "name": utils.extractName(row[2]).name,
                        "type": utils.getSlug(utils.extractName(row[2]).type),
                        "slug": utils.getSlug(utils.extractName(row[2]).name),
                        "name_with_type": row[2],
                        "path": utils.removeHCType(`${row[2]}, ${row[0]}`),
                        "path_with_type": `${row[2]}, ${row[0]}`,
                        "code": row[3],
                        "parent_code": row[1],
                        "isDeleted": false
                    })
                }

                if (row[4].trim() != '') {
                    wards.push({
                        "name": utils.extractName(row[4]).name,
                        "type": utils.getSlug(utils.extractName(row[4]).type),
                        "slug": utils.getSlug(utils.extractName(row[4]).name),
                        "name_with_type": row[4],
                        "path": utils.removeHCType(`${row[4]}, ${row[2]}, ${row[0]}`),
                        "path_with_type": `${row[4]}, ${row[2]}, ${row[0]}`,
                        "code": row[5],
                        "parent_code": row[3],
                        "isDeleted": false
                    })
                }
            }
        })
        .on('end', function () {
            //do something with csvData
            fs.writeFileSync('./data/loc_provinces.json', JSON.stringify(provinces, null, 4))
            fs.writeFileSync('./data/loc_districts.json', JSON.stringify(districts, null, 4))
            fs.writeFileSync('./data/loc_wards.json', JSON.stringify(wards, null, 4))

            console.log(`[INFO] Crawl data successful`);
        });