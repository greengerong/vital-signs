var fs = require("fs") ,
    zipstream = require('zipstream'),
    walk = require('walk'),
    FormData = require('form-data');

var getPluginResources = function (dir, done) {
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

};

var zipFiles = function (files, plugin, done) {
    var path = plugin + '.zip';
    var out = fs.createWriteStream(path);
    var zip = zipstream.createZip({ level:1 });

    zip.pipe(out);
    var i = 0;
    var zipDir = function () {
        zip.addFile(fs.createReadStream(files[i]), { name:files[i] }, function () {
            i++
            if (i === (files.length - 1)) {
                zip.finalize(function (written) {
                    console.log(written + ' total bytes written');
                    done(path);
                });
            } else {
                zipDir();
            }
        });
    }
    zipDir();

};

var sendZip = function (path, host) {
    var form = new FormData();

    var CRLF = '\r\n';
    var form = new FormData();

    var options = {
        header:'--' + form.getBoundary() +
            CRLF + 'Content-Disposition: form-data; name="file";' +
            'filename="bubbles.wgt"' +
            CRLF + 'Content-Type: application/octet-stream' +
            CRLF + CRLF
    };

    form.append('thumbnail', fs.readFileSync(path), options);

    form.submit(host + "/plugins/upload", function (err, res) {
        if (err) throw err;
        console.log('Done:' + res);
    });
};

var plugin = process.argv[2];
var host = process.argv[3];
getPluginResources(plugin, function (files) {  //"./plugins/"
    var zipDone = function (path) {
        sendZip(path, host);
    };
    zipFiles(files, plugin, zipDone);
});