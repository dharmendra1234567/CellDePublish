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
            client.shell(_deviceid, 'am broadcast -a  com.example.diksha.firstapplication.GETDATA')
                .then(adb.util.readAll)
                .then(function (output) {
                    console.log(ab2str(output));
                    var splitresult = output.toString('utf8');
                    var dataResult = splitresult.split("data=");
                    console.log(dataResult);
                    if (dataResult.length > 1) {
                        io.to(socket.id).emit("deviceDataResult", dataResult[1] + "&" + _deviceid);
                    } else {
                        io.to(socket.id).emit("devicetryBack", _deviceid);
                    }
                })
        })

        socket.on(`installApk`, function (_deviceid) {
            //#Build
           var apk = _path.join(__dirname + '/../../../Apk/erasure.apk');
           // End 

           //#local 
           //var apk = _path.join(__dirname + '/../Apk/erasure.apk');
           // End
           try {

                client.install(_deviceid, apk, function (err, _data) {
                    if (err) {
                        io.to(socket.id).emit("deviceaddresponseAgain", _deviceid);
                    } else {
                        if (_data == true || err.message == "Failure: 'device offline'") {
                            client.shell(_deviceid, 'am start -n com.example.diksha.firstapplication/com.example.diksha.firstapplication.ui.activity.SplashActivity', function (err2, result2) {
                                if (err2 == null || err2 == "") {
                                    client.shell(_deviceid, 'am broadcast -a com.example.diksha.firstapplication.GETDATA')
                                        .then(adb.util.readAll)
                                        .then(function (output) {
                                             console.log(ab2str(output));
                                            var splitresult = output.toString('utf8');
                                            console.log(splitresult);
                                            var dataResult = splitresult.split("data=");
                                            console.log(dataResult);
                                            if (dataResult.length > 1) {
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
                io.to(socket.id).emit("deviceaddresponseAgain", _deviceid);
            }

        });

        socket.on(`MultiEraseData`, function (_deviceid) {
            client.listDevices()
                .then(function (devices) {
                    return Promise.map(devices, function (device) {
                        return client.shell(device.id, 'am broadcast -a  com.example.diksha.firstapplication.DELETEDATA')
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
    console.log(__dirname);
    //  #Build
    var batchFilePath = _path.join(__dirname + '/../../../Apk/adbbatch.bat'); 
    // End

    //Local
    //var batchFilePath = _path.join(__dirname + '/../Apk/adbbatch.bat');
    //End

    io.emit("deviceremoveresponse2", batchFilePath);
    const spawn = require('child_process').spawn;
    const bat = spawn('cmd.exe', ['/c', batchFilePath]);
    bat.stdout.on('data', (data) => {
        console.log("12",data.toString('utf8'));
        io.emit("deviceremoveresponse2", "123" + data);
        callback("", true);
    });
    bat.stderr.on('data', function (data) {
        io.emit("deviceremoveresponse2", "123" + data);
        console.log("23",data.toString('utf8'));
    });

    bat.on('exit', function (code) {
        io.emit("deviceremoveresponse2", "123");
        console.log(code);
    });
}

process.on('uncaughtException', function (err) {
    io.emit("deviceremoveresponse2", "123");
    console.log(err);
})