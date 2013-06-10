var fs = require("fs") , fsEx = require('fs-extra');

var _projectDir = "./project/", defaultSetting = "default";

var ProjectController = {

    all:function (req, res) {
        var exclude = [defaultSetting];
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

    new:function (req, res) {

        var project = req.param("name");
        if (!project) {
            res.send(401);
            return;
        }

        fsEx.copy(_projectDir + defaultSetting, _projectDir + project, function (err) {
            if (err) {
                res.send(error, 500);
            }
            res.send(200);
        });

    },

    config:function (req, res) {

    },

    remove:function (req, res) {
        var project = req.param("name");
        if (!project) {
            res.send(404);
            return;
        }

        var dir = _projectDir + project;
        fsEx.remove(dir, function (err) {
            if (err) {
                res.send(error, 500);
            }
            res.send(200);
        });
    }

};
module.exports = ProjectController;