var fs = require("fs"), unzip = require("unzip");

var PluginsController = {

    _unzip:function (tmp_path, name, target_path) {
        fs.createReadStream(tmp_path)
            .on('close',function () {
                sails.log("plguins " + name + " upload finished.");
            }).pipe(unzip.Extract({ path:target_path }));
    },

    // To trigger this action locally, visit: `http://localhost:port/plugins/upload`
    upload:function (req, res) {
        var tmp_path = req.files.thumbnail.path;
        var fileName = req.files.thumbnail.name;
        var name = fileName.substr(0, fileName.lastIndexOf("."));
        var target_path = './plugins/' + name;
        this._unzip(tmp_path, name, target_path);
        res.view();
    }

};
module.exports = PluginsController;