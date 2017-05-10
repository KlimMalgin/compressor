// https://gist.github.com/revolunet/843889
//
// https://habrahabr.ru/post/186202/
//
// Binary Frame (Opcode 2)
//

var CompressorInstance = {

    // LZW-compress a string
    lzw_encode: function (s) {
        var dict = {};
        var data = (s + "").split("");
        var out = [];
        var currChar;
        var phrase = data[0];
        var code = 256;
        for (var i=1; i<data.length; i++) {
            currChar=data[i];
            if (dict[phrase + currChar] != null) {
                phrase += currChar;
            }
            else {
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[phrase + currChar] = code;
                code++;
                phrase=currChar;
            }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        for (var i=0; i<out.length; i++) {
            out[i] = String.fromCharCode(out[i]);
        }
        return out.join("");
    },

    // Decompress an LZW-encoded string
    lzw_decode: function (s) {
        var dict = {};
        var data = (s + "").split("");
        var currChar = data[0];
        var oldPhrase = currChar;
        var out = [currChar];
        var code = 256;
        var phrase;
        for (var i=1; i<data.length; i++) {
            var currCode = data[i].charCodeAt(0);
            if (currCode < 256) {
                phrase = data[i];
            }
            else {
               phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
            }
            out.push(phrase);
            currChar = phrase.charAt(0);
            dict[code] = oldPhrase + currChar;
            code++;
            oldPhrase = phrase;
        }
        return out.join("");
    }

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CompressorInstance; }

// 105 | ["\u0018",["Bonus","22f286dddee0ec0","gameScene","22.50,202.50,0.00,0.40,0.40,1.00,0.00,0.00,0.00,",null]]

//str = '["\u0018",["Bonus","22f286dddee0ec0","gameScene","22.50,202.50,0.00,0.40,0.40,1.00,0.00,0.00,0.00,",null]]';
// "38eb05f¬80.10,202.50,0,0.40,0.40,1,0,0,1.57,"
// str = '38eb05f¬80.10,202.50,0,0.40,0.40,1,0,0,1.57,'
// str_res = lzw_encode(str);
// str_decode = lzw_decode(str_res);
// console.log('\n---------------\nsource: \n%o // %o \nresult: \n%o // %o \ndecode: \n%o // %o', str, str.length, str_res, str_res.length, str_decode, str_decode.length);
