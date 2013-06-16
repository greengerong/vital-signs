var getPluginResources = function (dir, done) {
    var walk = require('walk');
    var files = [];

    var walker = walk.walk(dir, { followLinks:false});

    walker.on('file', function (root, stat, next) {
        files.push(root + '/' + stat.name);
        next();
    });

    walker.on("errors", function (root, nodeStatsArray, next) {
        next();
    });

    walker.on('end', function () {
        done(files);
    });

}


var DashboardController = {

    index:function (req, res) {
        var project = req.params.project;
        getPluginResources('./plugins', function (files) {
            var search = function (type) {
                return files.filter(function (f) {
                    var p = "." + type;
                    return f.lastIndexOf(p) === (f.length - p.length);
                }).sort();
            };
            var js = search("js");
            var css = search("css");
            res.view({
                project:project,
                resource:{
                    js:js,
                    css:css
                },
                title:project + "-dashboard"
            });
        });
    }
};
module.exports = DashboardController;