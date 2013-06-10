var fs = require("fs"), unzip = require("unzip");

var _pluginsDir = './plugins/';
var PluginsController = {

        _unzip:function (tmp_path, name, target_path) {
            fs.createReadStream(tmp_path)
                .on('close',function () {
                    sails.log("plguins " + name + " upload finished.");
                }).pipe(unzip.Extract({ path:target_path }));
        },

        upload:function (req, res) {
            var tmp_path = req.files.thumbnail.path;
            var fileName = req.files.thumbnail.name;
            var name = fileName.substr(0, fileName.lastIndexOf("."));
            var target_path = _pluginsDir + name;
            this._unzip(tmp_path, name, target_path);
            res.view();
        },

        all:function (req, res) {
            var result = [];
            fs.readdir(_pluginsDir, function (error, list) {
                if (error) {
                    res.send(500, error);
                }

                res.send(list, 200);
            })
        },
        //plugins/about?name=:name
        about:function (req, res) {
            var plugin = req.param("name");
            fs.readFile(_pluginsDir + plugin + "/about.txt", 'utf8', function (error, text) {
                if (error) {
                    res.send(500, error);
                }

                res.send(text, { 'Content-Type':'text/html' }, 200);
            });
        }

    }
    ;
module.exports = PluginsController;