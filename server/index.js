var express = require('express');
var _path = require('path');
var adb = require('adbkit');
var Promise = require('bluebird')
var client = adb.createClient();
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3333;
var connectedDevices = [];
var ab2str = require('arraybuffer-to-string');

var logger = require('nodejslogger');
// #build
//var TxtPath = _path.join(__dirname + '/../../../Apk/log.txt');
//End
// #local
var TxtPath = _path.join(__dirname + '/../Apk/log.txt');
//End

logger.init({ "file": TxtPath, "mode": "DIE" })
try {
    server.listen(port, function () {
        console.log('[server] listening at port %d', port);

    });
    io.on('connection', function (socket) {
        console.log(socket);
        run_cmd(function (err, result) {
            client.trackDevices()
                .then(function (tracker) {
                    tracker.on('add', function (device) {
                       
                        if (connectedDevices.indexOf(device.id) == -1) {
                            connectedDevices.push(device.id);
                            setTimeout(() => {
                                io.to(socket.id).emit("deviceaddresponse", {
                                    devicedata: device
                                });
                            }, 2000);
                        }
                    })
                    tracker.on('remove', function (device) {
                        if (connectedDevices.indexOf(device.id) > -1) {
                            connectedDevices.splice(connectedDevices.indexOf(device.id), 1);
                            io.to(socket.id).emit("deviceremoveresponse", device.id);
                        }
                    })
                    tracker.on('end', function () { })
                })
                .catch(function (err) {
                    logger.error(err);
                    console.error('Something went wrong:', err.stack)
                })
        });
        socket.on(`devicetryBackData`, function (_deviceid) {
            client.shell(_deviceid, 'am broadcast -a  com.veridic.erasure.GETDATA')
                .then(adb.util.readAll)
                .then(function (output) {
                    console.log(ab2str(output));
                    var splitresult = output.toString('utf8');
                    var dataResult = splitresult.split("data=");
                    console.log(dataResult);
                    if (dataResult.length > 1) {
                        console.log("1111111111", dataResult[1]);
                        io.to(socket.id).emit("deviceDataResult", dataResult[1] + "&" + _deviceid);
                    } else {
                        io.to(socket.id).emit("devicetryBack", _deviceid);
                    }
                })
        })

        socket.on(`installApk`, function (_deviceid) {
            console.log("11111111111111111111");
            //#Build
            // var apk = _path.join(__dirname + '/../../../Apk/erasure.apk');
            // 
            //#local 
            var apk = _path.join(__dirname + '/../Apk/erasure.apk');
            try {
                client.install(_deviceid, apk, function (err, _data) {
                    console.log("***************************");
                    console.log(_data);
                    console.log("***************************");
                    if (err) {
                        console.log(err);
                        io.to(socket.id).emit("deviceaddresponseAgain", _deviceid);
                    } else {
                        console.log(_data);
                        if (_data == true || err.message == "Failure: 'device offline'") {
                            client.shell(_deviceid, 'am start -n com.veridic.erasure/com.veridic.erasure.ui.activity.DashboardActivity', function (err2, result2) {
                                if (err2 == null || err2 == "") {
                                    client.shell(_deviceid, 'am broadcast -a com.veridic.erasure.GETDATA')
                                        .then(adb.util.readAll)
                                        .then(function (output) {
                                            console.log(ab2str(output));
                                            var splitresult = output.toString('utf8');
                                            console.log(splitresult);
                                            var dataResult = splitresult.split("data=");
                                            console.log(dataResult);
                                            if (dataResult.length > 1) {
                                                console.log("1111111111", dataResult[1]);
                                                io.to(socket.id).emit("deviceDataResult", dataResult[1] + "&" + _deviceid);
                                            } else {
                                                io.to(socket.id).emit("devicetryBack", _deviceid);
                                            }

                                        })

                                } else {
                                    io.to(socket.id).emit("devicetryBack", _deviceid);
                                }
                            })
                        } else {
                            io.to(socket.id).emit("deviceaddresponseAgain", _deviceid);
                        }
                    }
                });
            } catch (exception) {
                console.log(exception);
                logger.error(exception);
                io.to(socket.id).emit("deviceaddresponseAgain", _deviceid);
            }

        });

        socket.on(`MultiEraseData`, function (_deviceid) {
            console.log("Delete");
            client.listDevices()
                .then(function (devices) {
                    return Promise.map(devices, function (device) {
                        return client.shell(device.id, 'am broadcast -a com.veridic.erasure.DELETEDATA')
                            .then(adb.util.readAll)
                            .then(function (output) {
                                console.log(ab2str(output));
                                var splitresult = output.toString('utf8');
                                var dataResult = splitresult.split("=");
                                if (dataResult.length > 3) {
                                    io.to(socket.id).emit("SingleEraseDataResponse", device.id);
                                } else {
                                    io.to(socket.id).emit("SingleEraseDataError", device.id);
                                }
                            })
                    })
                })
                .then(function () {
                    console.log('Done.')
                })
                .catch(function (err) {
                    console.log(ab2str(output));
                    logger.error(err);
                    console.error('Something went wrong:', err.stack)
                })
        })
    });
} catch (e) {
    console.log(e);
}

function run_cmd(callback) {
    console.log(__dirname);
    //  #Build
    //var batchFilePath = _path.join(__dirname + '/../../../Apk/adbbatch.bat'); 
    // End
    //Local
    var batchFilePath = _path.join(__dirname + '/../Apk/adbbatch.bat');
    //End
    console.log(batchFilePath);
    io.emit("deviceremoveresponse2", batchFilePath);
    const spawn = require('child_process').spawn;
    const bat = spawn('cmd.exe', ['/c', batchFilePath]);
    bat.stdout.on('data', (data) => {
        console.log("12", data.toString('utf8'));
        io.emit("deviceremoveresponse2", "123" + data);
        callback("", true);
    });
    bat.stderr.on('data', function (data) {
        logger.error(batchFilePath + "------" + data.toString('utf8'));
        io.emit("deviceremoveresponse2", "123" + data);
        console.log("*****************************************");
        console.log("23", data.toString('utf8'));
        console.log("*****************************************");
    });

    bat.on('exit', function (code) {
        logger.error(code.toString());
        io.emit("deviceremoveresponse2", "123" + code);
        console.log("*****************************************");
        console.log(code);
        console.log("*****************************************");
    });
}

process.on('uncaughtException', function (err) {
    logger.error(err.toString());
    io.emit("deviceremoveresponse2", "123");
    console.log(err);
})