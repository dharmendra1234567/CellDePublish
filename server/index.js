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
var TxtPath = _path.join(__dirname + '/../../../Apk/log.txt');
//End
// #local
//var TxtPath = _path.join(__dirname + '/../Apk/log.txt');
//End

logger.init({
    "file": TxtPath,
    "mode": "DIE"
})
try {
    server.listen(port, function () {
        console.log('[server] listening at port %d', port);

    });
    io.on('connection', function (socket) {
        run_cmd(function (err, result) {
            client.trackDevices()
                .then(function (tracker) {
                    tracker.on('add', function (device) {
                        io.to(socket.id).emit("deviceaddScanningresponse", {
                            devicedata: device
                        });
                        run_cmd_installApk(function (callerr, callresult) {
                            if (callresult == true) {
                                if (connectedDevices.indexOf(device.id) == -1) {
                                    connectedDevices.push(device.id);
                                    setTimeout(() => {
                                        io.to(socket.id).emit("deviceaddresponse", {
                                            devicedata: device
                                        });
                                    }, 2000);
                                }
                            }
                        });

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
                    logger.error(err);
                    console.error('Something went wrong:', err.stack)
                })
        });
        socket.on(`devicetryBackData`, function (_deviceid) {
            console.log("***********************Retry***************************");
            client.shell(_deviceid, 'am start -n com.veridic.erasure/com.veridic.erasure.ui.activity.DashboardActivity', function (err2, result2) {

                client.shell(_deviceid, 'am broadcast -a  com.veridic.erasure.GETDATA')
                    .then(adb.util.readAll)
                    .then(function (output) {
                        var splitresult = output.toString('utf8');
                        var dataResult = splitresult.split("data=");
                        console.log(dataResult);
                        if (dataResult.length > 1) {
                            io.to(socket.id).emit("deviceDataResult", dataResult[1] + "&" + _deviceid);
                        } else {
                            io.to(socket.id).emit("devicetryBack", _deviceid);
                        }
                    })
            });
        })

        socket.on(`installApk`, function (_deviceid) {
            try {
                console.log("*********Install***");
                client.shell(_deviceid, 'am start -n com.veridic.erasure/com.veridic.erasure.ui.activity.DashboardActivity', function (err2, result2) {
                    if (err2 == null || err2 == "") {
                        client.shell(_deviceid, 'am broadcast -a com.veridic.erasure.GETDATA')
                            .then(adb.util.readAll)
                            .then(function (output) {

                                var splitresult = output.toString('utf8');
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
                });
            } catch (exception) {
                logger.error(exception);
                io.to(socket.id).emit("deviceaddresponseAgain", _deviceid);
            }
        });

        socket.on(`MultiEraseData`, function (_deviceid) {
            client.listDevices()
                .then(function (devices) {
                    return Promise.map(devices, function (device) {
                        return client.shell(device.id, 'am broadcast -a com.veridic.erasure.DELETEDATA')
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
                    logger.error("***********************Erase******************");
                    logger.error(err);
                    logger.error("****************************************************");
                    console.error('Something went wrong:', err.stack)
                })
        })
    });
} catch (e) {
    logger.error("***********************Socket Error******************");
    logger.error(e);
    logger.error("****************************************************");
}

function run_cmd(callback) {
    //  #Build
    var batchFilePath = _path.join(__dirname + '/../../../Apk/adbbatch.bat'); 
    // End
    //Local
   // var batchFilePath = _path.join(__dirname + '/../Apk/adbbatch.bat');
    //End
    io.emit("deviceremoveresponse2", batchFilePath);
    const spawn = require('child_process').spawn;
    const bat = spawn('cmd.exe', ['/c', batchFilePath]);
    bat.stdout.on('data', (data) => {
        logger.error("***********************Adb Start Run Batch File******************");
        logger.error(batchFilePath + "------" + data.toString('utf8'));
        logger.error("****************************************************");
        callback("", true);
    });
    bat.stderr.on('data', function (data) {
        logger.error();
        logger.error("***********************Adb Start Run Batch File******************");
        logger.error(batchFilePath + "------" + data.toString('utf8'));
        logger.error("****************************************************");
    });

    bat.on('exit', function (code) {
        logger.error("***********************Run Batch File******************");
        logger.error(code);
        logger.error("****************************************************");
    });
}


function run_cmd_installApk(callback) {
    //  #Build
    var batchFilePath = _path.join(__dirname + '/../../../Apk/installbatch.bat'); 
    // End
    //Local
    //var batchFilePath = _path.join(__dirname + '/../Apk/installbatch.bat');
    //End
    const spawn = require('child_process').spawn;
    const bat = spawn('cmd.exe', ['/c', batchFilePath]);
    bat.stdout.on('data', (data) => {
        logger.error("****************Install APK*************************");
        logger.error(data.toString('utf8'));
        logger.error("****************************************************");
        if (data.toString('utf8') === "Success") {
            console.log("12", data.toString('utf8'));
            callback("", true);
        } else {
            if (data.toString('utf8').indexOf('Failure') > -1 && data.toString('utf8').indexOf('INSTALL_FAILED_ALREADY_EXISTS') == -1) {
                io.emit("InstallError", data.toString('utf8'));
            }
            console.error("****************Install APK*************************");
            console.error(data.toString('utf8'));
            console.error("****************************************************");
        }
    });
    bat.stderr.on('data', function (data) {
        logger.error("****************Install APK*************************");
        logger.error(batchFilePath + "------" + data.toString('utf8'));
        logger.error("****************************************************");
        console.error("*********************Install ApK********************");
        console.error("23", data.toString('utf8'));
        console.error("****************************************************");
        callback("", true);
    });

    bat.on('exit', function (code) {
        logger.error(code.toString());
        console.error("***********************Install APk******************");
        console.error(code);
        console.error("****************************************************");
    });
}

process.on('uncaughtException', function (err) {
    logger.error("***********************uncaught Exception******************");
    logger.error(err.toString());
    logger.error("****************************************************");
})