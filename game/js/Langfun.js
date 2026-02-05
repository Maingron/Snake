export function Langfun(reqLang = "en") {
    var gLang = {};

    return import("../lang/" + reqLang + ".lang.js").then(lang => {
        gLang = lang.lang;
        return gLang;
    }).then(() => {
        return {
            getLang: function(request) {
                if (typeof(gLang) != "undefined" && gLang[request] && gLang[request] != "") {
                    return gLang[request];
                } else {
                    return request;
                }
            }
        };
    });
}
