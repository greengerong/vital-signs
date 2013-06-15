var http = require('http'), url = require("url"), requireUtil = require("../services/require-util");


function Proxyer(req, res, method) {
    var getCookie = function (hostname) {
        req.session.cookies = req.session.cookies || {};
        return req.session.cookies[hostname] || "";
    }

    var storeCookie = function (response, hostname) {
        req.session.cookies = req.session.cookies || {};
        var cookie = response.headers["set-cookie"];
        if (cookie) {
            req.session.cookies[hostname] = cookie;
        }
    }

    var extractedUrlInfo = function (req) {
        var params = url.parse(req.url, true).query;

        var path = '';
        var requestURL = url.parse(params.url);

        if (requestURL.pathname) {
            path += requestURL.pathname;
        }

        if (requestURL.search) {
            path += requestURL.search;
        }

        var port = 80;

        if (requestURL.port) {
            port = requestURL.port;
        }
        return {path:path, requestURL:requestURL, port:port};
    };

    var getRequestOptions = function (req, requestData, met) {
        var method = met || 'GET';

        var urlInfo = extractedUrlInfo(req);

        var hostName = urlInfo.requestURL.hostname;
        var accept = req.headers["accept"] || "*/*";
        var contentType = req.headers["Content-Type"] || "application/json";

        var options = {
            Host:hostName,
            hostname:hostName,
            port:urlInfo.port,
            path:urlInfo.path,
            method:method,
            Cookie:getCookie(hostName),
            headers:{
                'Accept':accept,
                'User-Agent':'Mozilla/5.0 (compatible; MSIE 6.0; Windows NT5.0)',
                'Accept-Language':'en-us',
                'Accept-Charset':'utf-8;q=0.7,*;q=0.7',
                'Content-Type':contentType
            }
        };

        if (requestData) {
            options.headers['Content-Length'] = requestData.length;
        }

        return {options:options, hostName:hostName};
    };

    this.proxy = function () {
        var requestData;
        if (method.toUpperCase() !== "GET" && req.body) {
            requestData = JSON.stringify(req.body);
        }
        var opts = getRequestOptions(req, requestData, method);
        var request = http.request(opts.options, function (response) {
            var body = '';
            response.setEncoding('utf8');

            response.on('data', function (chunk) {
                body += chunk;
            });

            response.on('end', function () {
                storeCookie(response, opts.hostName);
                res.send(body);
            });

            response.on('error', function (e) {
                res.send(e.message, 500);
            });
        });

        request.on('error', function (e) {
            res.send(e.message, 500);
        });

        if (requestData) {
            request.write(requestData);
        }
        request.end();
    };
}

var getJobPath = function (req) {
    var job = req.param("job");
    var plugin = req.param("plugin");
    var path = "../../plugins/" + plugin + "/" + job + ".job";
    return {job:job, plugin:plugin, path:path};
};

var ProxyController = {

    get:function (req, res) {
        new Proxyer(req, res, "GET").proxy();

    },

    post:function (req, res) {
        new Proxyer(req, res, "POST").proxy();

    },
    //proxy?plugin=:plugin&job=:job
    exec:function (req, res) {
        try {
            var __ret = getJobPath(req);
            var job = __ret.job;
            var plugin = __ret.plugin;
            var path = __ret.path;
            var runner = require(path);
            runner.run(req, res);
//            requireUtil.removeCache(path);
        } catch (ex) {
            res.send("bad job(" + plugin + ":" + job + "). error :" + ex, 400);
        }
    },
    removeCache:function (req, res) {
        try {
            var path = getJobPath(req);
            requireUtil.removeCache(path);
        } catch (ex) {
            res.send(ex, 400);
        }
    }


};
module.exports = ProxyController;