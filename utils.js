/**
 * Created by FPO Co.,Ltd - June 2019
 * Website: http://fpo.vn
 * Email: contact@fpo.vn
 */
'use strict'

var fs = require('fs');
const url = require('url')
const path = require('path');

const {
    exec
} = require('child_process');

exports.parseName = (myUrl) => {
    if (myUrl != '') {
        var parsed = url.parse(myUrl);
        return path.basename(parsed.pathname);
    } else {
        return '';
    }
}

//#region Get file name
exports.getFilename = (filename) => {
    let ext = ('.' + filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2)).toLowerCase() == '.' ? '.png' : ('.' + filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2)).toLowerCase()
    return filename.replace(ext, '');
}
//#endregion

//#region Get ext of file name
exports.getExt = (filename) => {
    return ('.' + filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2)).toLowerCase() == '.' ? '.png' : ('.' + filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2)).toLowerCase();
}
//#endregion

//#region Upper Title case
exports.toProperCase = (str) => {
    return str.replace(
        /(^|[\s\xA0])[^\s\xA0]/g,
        function (txt) {
            return txt.toUpperCase();
        }
    );
}

exports.toProperCase2 = (str) => {
    return str.replace(
        /(^|[\s\xA0])[^\s\xA0]/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

exports.deleteSign = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}
//#endregion
exports.getSlug = (name) => {
    return this.deleteSign(name).toLowerCase().trim().replace(/ /g, "-")
}

exports.extractName = (name) => {
    if (name.indexOf('Tỉnh') >= 0) {
        return {
            type: 'Tỉnh',
            name: name.replace(/Tỉnh /g, '')
        }
    }

    if (name.indexOf('Thành phố') >= 0 || name.indexOf('Thành Phố') >= 0) {
        return {
            type: 'Thành phố',
            name: name.replace(/Thành phố /g, '').replace(/Thành Phố /g, '')
        }
    }

    if (name.indexOf('Quận') >= 0) {
        return {
            type: 'Quận',
            name: name.replace(/Quận /g, '')
        }
    }

    if (name.indexOf('Thị xã') >= 0 || name.indexOf('Thị Xã') >= 0) {
        return {
            type: 'Thị xã',
            name: name.replace(/Thị xã /g, '').replace(/Thị Xã /g, '')
        }
    }

    if (name.indexOf('Huyện') >= 0) {
        return {
            type: 'Huyện',
            name: name.replace(/Huyện /g, '')
        }
    }

    if (name.indexOf('Phường') >= 0) {
        return {
            type: 'Phường',
            name: name.replace(/Phường /g, '')
        }
    }

    if (name.indexOf('Thị trấn') >= 0 || name.indexOf('Thị Trấn') >= 0) {
        return {
            type: 'Thị trấn',
            name: name.replace(/Thị trấn /g, '').replace(/Thị Trấn /g, '')
        }
    }

    if (name.indexOf('Xã') >= 0) {
        return {
            type: 'Xã',
            name: name.replace(/Xã /g, '')
        }
    }

    return `*${name}`;
}

exports.removeHCType = (name) => {
    return name.replace(/Tỉnh /g, '')
        .replace(/Thành phố /g, '')
        .replace(/Thành Phố /g, '')
        .replace(/Quận /g, '')
        .replace(/Thị xã /g, '')
        .replace(/Thị Xã /g, '')
        .replace(/Huyện /g, '')
        .replace(/Phường /g, '')
        .replace(/Thị trấn /g, '')
        .replace(/Thị Trấn /g, '')
        .replace(/Xã /g, '')
}

exports.generateString = (length) => {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }

    return result.join('');
}

exports.generateOTP = (length) => {
    var result = [];
    var characters = '0123456789';
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }

    return result.join('');
}