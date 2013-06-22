# vital-signs
### a Sails application
Status [![Build Status](https://travis-ci.org/greengerong/vital-signs.png?branch=master)](https://travis-ci.org/greengerong/vital-signs)
build failing dut to travis env.

============
TODO:
2:客户端dashboard app重构 设计
3：jenkins css 调整：规定所有plugin的css必须在固定唯一的id下，防止冲突
4：TODO
5：重构服务端代码 设计
6:插件上传后解压路径有问题


=========
demo:
call self job:

 proxy.job({job:"jenkins", plugin:"jenkins", i:20}, function (d) {
        console.log(d);
    })