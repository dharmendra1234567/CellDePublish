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

try {
    server.listen(port, function () {
        console.log('[server] listening at port %d', port);

    });
    io.on('connection', function (socket) {
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
                    tracker.on('end', function () {})
                })
                .catch(function (err) {
                    console.error('Something went wrong:', err.stack)
                })
        });
        socket.on(`devicetryBackData`, function (_deviceid) {
            client.shell(_deviceid, 'am broadcast -a  com.veridic.dataerase.GETDATA')
                .then(adb.util.readAll)
                .then(function (output) {
                    var splitresult = output.toString('utf8');
                    var dataResult = splitresult.split("=");
                    if (dataResult.length > 3) {
                        io.to(socket.id).emit("deviceDataResult", dataResult[3] + "&" + _deviceid);
                    } else {
                        io.to(socket.id).emit("devicetryBack", _deviceid);
                    }
                })
        })

        socket.on(`installApk`, function (_deviceid) {
            var apk = _path.join(__dirname + '/../Apk/DataEraseApk.apk');
            try {

                client.install(_deviceid, apk, function (err, _data) {
                    if (err) {
                        io.to(socket.id).emit("deviceaddresponseAgain", _deviceid);
                    } else {
                        if (_data == true || err.message == "Failure: 'device offline'") {
                            client.shell(_deviceid, 'am start -n com.veridic.dataerase/com.veridic.dataerase.activities.MainActivity', function (err2, result2) {
                                if (err2 == null || err2 == "") {
                                    client.shell(_deviceid, 'am broadcast -a  com.veridic.dataerase.GETDATA')
                                        .then(adb.util.readAll)
                                        .then(function (output) {
                                            var splitresult = output.toString('utf8');
                                            var dataResult = splitresult.split("=");
                                            if (dataResult.length > 3) {
                                                io.to(socket.id).emit("deviceDataResult", dataResult[3] + "&" + _deviceid);
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
                io.to(socket.id).emit("deviceaddresponseAgain", _deviceid);
            }

        });

        socket.on(`MultiEraseData`, function (_deviceid) {
            client.listDevices()
                .then(function (devices) {
                    return Promise.map(devices, function (device) {
                        return client.shell(device.id, 'am broadcast -a  com.veridic.dataerase.DELETEDATA')
                            .then(adb.util.readAll)
                            .then(function (output) {
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
                    console.error('Something went wrong:', err.stack)
                })
        })
    });
} catch (e) {
    console.log(e);
}

function run_cmd(callback) {
    var batchFilePath = _path.join(__dirname + '/../Apk/adbbatch.bat');
    io.emit("deviceremoveresponse2", batchFilePath);
    const spawn = require('child_process').spawn;
    const bat = spawn('cmd.exe', ['/c', batchFilePath]);
    bat.stdout.on('data', (data) => {
        io.emit("deviceremoveresponse2", "123" + data);
        callback("", true);
    });
}

process.on('uncaughtException', function (err) {
    io.emit("deviceremoveresponse2", "123" + data);
    console.log(err);
})