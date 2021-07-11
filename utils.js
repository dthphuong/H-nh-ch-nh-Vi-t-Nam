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

exports.getInfoProvince = (data) => {
    var typeProvince
    if (data.type == "tinh") {
        typeProvince = "Tỉnh"
    } else {
        typeProvince = "Thành Phố"
    }
    return {
        name: data.name,
        type: data.type,
        slug: this.getSlug(data.name),
        name_with_type: typeProvince + " " + data.name,
    }
}

exports.getInfoDistricts = (data) => {
    var typeProvince
    switch (data.type) {
        case "thanh-pho":
            typeProvince = "Thành Phố"
            break;
        case "quan":
            typeProvince = "Quận"
            break;
        case "thi-xa":
            typeProvince = "Thị Xã"
            break;
        case "huyen":
            typeProvince = "Huyện"
            break;
    }
    return {
        name: data.name,
        type: data.type,
        slug: this.getSlug(data.name),
        name_with_type: typeProvince + " " + data.name,
    }
}

exports.getInfoWards = (data) => {
    var typeProvince
    switch (data.type) {
        case "phuong":
            typeProvince = "Phường"
            break;
        case "thi-tran":
            typeProvince = "Thị Trấn"
            break;
        case "xa":
            typeProvince = "Xã"
            break;
    }
    return {
        name: data.name,
        type: data.type,
        slug: this.getSlug(data.name),
        name_with_type: typeProvince + " " + data.name,
    }
}

exports.getPlaceLevel = (type) => {
    if (type.indexOf('street_number') != -1 || type.indexOf('premise') != -1) {
        return 0
    }

    if (type.indexOf('route') != -1) {
        return 1
    }

    if (type.indexOf('neighborhood') != -1) { // ap / khu pho / thon
        return 2
    }

    if (type.indexOf('administrative_area_level_3') != -1 || type.indexOf('sublocality') != -1) { // phuong / xa / thi tran
        return 3
    }

    if (type.indexOf('administrative_area_level_2') != -1 || type.indexOf('locality') != -1) { // quan / huyen / thi xa / thanh pho
        return 4
    }

    if (type.indexOf('administrative_area_level_1') != -1) { // tinh / thanh pho
        return 5
    }

    if (type.indexOf('country') != -1) { // quoc gia
        return 6
    }
}

//#region Find the Longest Common Substring
exports.longestCommonSubstring = (str1, str2) => {
    if (!str1 || !str2) {
        return {
            length: 0,
            sequence: '',
            offset: 0
        }
    }

    var sequence = ''
    var str1Length = str1.length
    var str2Length = str2.length
    var num = new Array(str1Length)
    var maxlen = 0
    var lastSubsBegin = 0

    for (var i = 0; i < str1Length; i++) {
        var subArray = new Array(str2Length)
        for (var j = 0; j < str2Length; j++) {
            subArray[j] = 0
        }
        num[i] = subArray
    }
    var thisSubsBegin = null
    for (i = 0; i < str1Length; i++) {
        for (j = 0; j < str2Length; j++) {
            if (str1[i] !== str2[j]) {
                num[i][j] = 0
            } else {
                if ((i === 0) || (j === 0)) {
                    num[i][j] = 1
                } else {
                    num[i][j] = 1 + num[i - 1][j - 1]
                }

                if (num[i][j] > maxlen) {
                    maxlen = num[i][j]
                    thisSubsBegin = i - num[i][j] + 1
                    if (lastSubsBegin === thisSubsBegin) { // if the current LCS is the same as the last time this block ran
                        sequence += str1[i]
                    } else { // this block resets the string builder if a different LCS is found
                        lastSubsBegin = thisSubsBegin
                        sequence = '' // clear it
                        sequence += str1.substr(lastSubsBegin, (i + 1) - lastSubsBegin)
                    }
                }
            }
        }
    }
    return {
        length: maxlen,
        sequence: sequence,
        offset: thisSubsBegin
    }
}
//#endregion

exports.mergeObjects = function (obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) {
        obj3[attrname] = obj1[attrname];
    }
    for (var attrname in obj2) {
        obj3[attrname] = obj2[attrname];
    }
    return obj3;
}

exports.execute = async (commands1, commands2) => {
    await exec(commands1, (err, stdout, stderr) => {
        if (err) {
            console.log(err)
        } else {
            console.log(stdout, stderr)
        }
    });
    await exec(commands2, (err, stdout, stderr) => {
        if (err) {
            console.log(err)
        } else {
            console.log(stdout, stderr)
        }
    });
}

exports.computeSimilarPercentOf2Strings = function (s1, s2) {
    var m = 0;

    // Exit early if either are empty.
    if (s1.length === 0 || s2.length === 0) {
        return 0;
    }

    // Exit early if they're an exact match.
    if (s1 === s2) {
        return 1;
    }

    var range = (Math.floor(Math.max(s1.length, s2.length) / 2)) - 1,
        s1Matches = new Array(s1.length),
        s2Matches = new Array(s2.length);

    for (let i = 0; i < s1.length; i++) {
        var low = (i >= range) ? i - range : 0,
            high = (i + range <= s2.length) ? (i + range) : (s2.length - 1);

        for (let j = low; j <= high; j++) {
            if (s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j]) {
                ++m;
                s1Matches[i] = s2Matches[j] = true;
                break;
            }
        }
    }

    // Exit early if no matches were found.
    if (m === 0) {
        return 0;
    }

    // Count the transpositions.
    var k = 0, n_trans = 0;

    for (var i = 0; i < s1.length; i++) {
        if (s1Matches[i] === true) {
            for (var j = k; j < s2.length; j++) {
                if (s2Matches[j] === true) {
                    k = j + 1;
                    break;
                }
            }

            if (s1[i] !== s2[j]) {
                ++n_trans;
            }
        }
    }

    var weight = (m / s1.length + m / s2.length + (m - (n_trans / 2)) / m) / 3,
        l = 0,
        p = 0.1;

    if (weight > 0.7) {
        while (s1[l] === s2[l] && l < 4) {
            ++l;
        }

        weight = weight + l * p * (1 - weight);
    }

    return weight;
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