var fs = require("fs")

var _projectDir = "./project/";

var ProjectController = {

    // To trigger this action locally, visit: `http://localhost:port/project/all`
    all:function (req, res) {
        var exclude = ["default"];
        fs.readdir(_projectDir, function (error, list) {
            if (error) {
                res.send(error, 500);
            }
            var plugins = list.filter(function (item) {
                return exclude.indexOf(item) == -1;
            });
            res.send(plugins, 200);
        });

    },

    // To trigger this action locally, visit: `http://localhost:port/project/new`
    new:function (req, res) {

        res.view();

    },

    // To trigger this action locally, visit: `http://localhost:port/project/remove`
    remove:function (req, res) {
        var project = req.param("name");
        if (!project) {
            res.send(404);
            return;
        }

        var dir = _projectDir + project;
        var deleteFolderRecursive = function (path) {
            var files = [];
            if (fs.existsSync(path)) {
                files = fs.readdirSync(path);
                files.forEach(function (file, index) {
                    var curPath = path + "/" + file;
                    if (fs.statSync(curPath).isDirectory()) {
                        deleteFolderRecursive(curPath);
                    } else { // delete file
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(path);
            }
        };
        try {
            deleteFolderRecursive(dir);
            res.send(200);
        } catch (e) {
            res.send(e, 500);
        }

    }

};
module.exports = ProjectController;