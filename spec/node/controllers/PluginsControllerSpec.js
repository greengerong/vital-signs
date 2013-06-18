'use strict';

var ctr = require("../../../api/controllers/PluginsController");
var nodemcok = require("nodemock");
var req = {}, res = {};
exports['plugins controller'] = {

    setUp:function (done) {
        req.files = {thumbnail:{path:"test-path", name:"test.zip"}};
        var empty = function () {
        };
        res = {view:empty, redirect:empty};
        done();
    },
    'show unzip files':function (test) {
//        var unzip = nodemcok.mock("unzip").takes("test-path", "test", "./plugins/test").times(1);
//        ctr._unzip = unzip.unzip;
//
//        ctr.upload(req, res);
//
//        test.strictEqual(unzip.assert(), true);
        test.done();
    }
};