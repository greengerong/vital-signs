var fs = require("fs");

var typeMap = {
    "html":"text/html",
    "js":"text/javascript",
    "css":"text/csssss"
};
var ResourceController = {

    index:function (req, res) {
        //TODO: give a right to access.
        var path = req.param("path");
        var type = req.params.type;
        fs.readFile(path, "utf-8", function (err, text) {
            if (err) {
                res.send(err, 500);
                return;
            }
            res.send(text, { 'Content-Type':typeMap[type] }, 200);
        })

    }

};
module.exports = ResourceController;