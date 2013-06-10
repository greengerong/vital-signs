var fs = require("fs"), unzip = require("unzip"), child_process = require('child_process');

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
        fs.readdir(_pluginsDir, function (error, list) {
            if (error) {
                res.send(error, 500);
            }

            res.send(list, 200);
        });
    },
    //plugins/about?name=:name
    about:function (req, res) {
        var plugin = req.param("name");
        fs.readFile(_pluginsDir + plugin + "/about.txt", 'utf8', function (error, text) {
            if (error) {
                res.send(error, 500);
            }

            res.send(text, { 'Content-Type':'text/html' }, 200);
        });
    },
    allNpmPlugins:function (req, res) {
        var exclude = [".bin"];
        fs.readdir("./node_modules", function (error, list) {
            if (error) {
                res.send(error, 500);
            }

            var plugins = list.filter(function (item) {
                return exclude.indexOf(item) == -1;
            });
            res.send(plugins, 200);
        });
    },
    addNpmPlugin:function (req, res) {
        var name = req.param("name");
        if (name) {
            var cmd = "npm install " + name + " --save-dev";
            child_process.exec(cmd, function (error, stdout) {
                if (error) {
                    res.send(error, 500);
                }
                var msg = "npm plugins " + name + " installed. " + stdout;
                res.send(msg, { 'Content-Type':'text/html' }, 200);
            });
        }
    }

};
module.exports = PluginsController;