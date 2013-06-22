var fs = require("fs"), unzip = require("unzip"), child_process = require('child_process');

var _pluginsDir = './plugins/';
var _unzip = function (tmp_path, name, target_path) {
    fs.createReadStream(tmp_path)
        .on('close',function () {
            sails.log("plguins " + name + " upload finished.");
        }).pipe(unzip.Extract({ path:target_path }));
};

var PluginsController = {

    upload:function (req, res) {
        if (!req.files.thumbnail || !req.files.thumbnail.path || !req.files.thumbnail.name) {
            res.send(400);
            return;
        }
        var tmp_path = req.files.thumbnail.path;
        var fileName = req.files.thumbnail.name;
        var name = fileName.substr(0, fileName.lastIndexOf("."));
        _unzip(tmp_path, name, _pluginsDir + name);
        res.redirect("manage/index")
    },
    allPlugins:function (req, res) {
        var exclude = ["app.js", ".DS_Store"];
        fs.readdir(_pluginsDir, function (error, list) {
            if (error) {
                res.send(error, 500);
                return;
            }
            var plugins = list.filter(function (item) {
                return exclude.indexOf(item) == -1;
            });
            res.send(plugins, 200);
        });
    },
    //plugins/about?name=:name
    about:function (req, res) {
        var plugin = req.param("name");
        if (!plugin) {
            res.send(400);
            return;
        }

        fs.readFile(_pluginsDir + plugin + "/about.txt", 'utf8', function (error, text) {
            if (error) {
                res.send(error, 500);
                return;
            }

            res.send(text, { 'Content-Type':'text/html' }, 200);
        });
    },
    allNpmPlugins:function (req, res) {
        var exclude = [".bin"];
        fs.readdir("./node_modules", function (error, list) {
            if (error) {
                res.send(error, 500);
                return;
            }

            var plugins = list.filter(function (item) {
                return exclude.indexOf(item) == -1;
            });
            res.send(plugins, 200);
        });
    },
    //plugins/addNpmPlugin?name=:name
    addNpmPlugin:function (req, res) {
        var name = req.param("name");
        if (!name) {
            res.send("name is required.", 400);
            return;
        }

        var cmd = "npm install " + name + " --save-dev";
        child_process.exec(cmd, function (error, stdout) {
            if (error) {
                res.send(error, 500);
                return;
            }
            var msg = "npm plugins " + name + " installed. " + stdout;
            res.send(msg, { 'Content-Type':'text/html' }, 200);
        });
    }

};
module.exports = PluginsController;