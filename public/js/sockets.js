var socket = io.connect('http://localhost:3333');

function init() {
    connectDeviceScreen();
    SocketsConnection();
    //GetPortData();
    //getVersions();
}

function GetPortData() {
    $.getJSON("port.json", function (data) {
        console.log(data);
    });

}

function getVersions() {
    $.ajax({
        url: "http://celldeeraseapi.nordics.veridic.local/api/version/1.0.0.1",
        datatype: "json",
        type: "GET",
        success: function (result) {
            $(".overlayloader").addClass('hidecls');
            $('#updateModel').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#updateModel').modal('show');
        },
        error: function (err) {
            alert("Failure");
        }

    })

}

function SocketsConnection() {
    socket.on('deviceaddresponse', function (data) {
        scanDeviceScreen();
        socket.emit("installApk", data.devicedata.id);
    });
    socket.on('deviceaddScanningresponse', function (data) {
        scanDeviceScreen();
      //  socket.emit("installApk", data.devicedata.id);
    });
    

    socket.on('deviceaddresponseAgain', function (data) {
        scanDeviceScreen();
        socket.emit("installApk", data.devicedata.id);
    });

    socket.on('deviceremoveresponse', function (data) {
        connectDeviceScreen();
    });

    socket.on('deviceremoveresponse2', function (data) {
       //  alert(data);
       // connectDeviceScreen();
    });

    socket.on('InstallError', function (data) {
        alert(data);
        // connectDeviceScreen();
     });

    socket.on('devicetryBack', function (data) {
        socket.emit("devicetryBackData", data);
    });

    socket.on('SingleEraseDataResponse', function (data) {
        var message = `
        <ul>
                  <li>C</li>
                  <li>O</li>
                  <li>M</li>
                  <li>P</li>
                  <li>L</li>
                  <li>E</li>
                  <li>T</li>
                  <li>E</li>
                  
                </ul>
        `
        $("#percentcomplete").html("100");
        $("#spnloader").html(message);
    });

    socket.on('SingleEraseDataError', function (data) {
        console.log(data);
    });

    socket.on('deviceDataResult', function (data) {
        console.log(data);
        try {

            // $("#tblDetails").removeClass('hidecls');
            // $(".alertMessage").addClass('hidecls');
            // $(".overlayloader").addClass('hidecls');
            var _splitResult = data.split('&');
            console.log(_splitResult);
            var strData = _splitResult[0].toString().replace('"{', '{') //_splitResult[0].substr(1, _splitResult[0].length - 3);
            strData = strData.toString().replace('}"', '}')
            var result = JSON.parse(strData);
            console.log(result);
            result.deviceId = _splitResult[1];
            var percentStorage = ((result.occupied / result.storage) * 100).toFixed(2);
            var freepercent = parseFloat(result.free) / parseFloat(result.storage);

            if (parseFloat(result.free) > 1024) {

                result.free = (parseFloat(result.free) / 1024).toFixed(2) + " GB";

            } else {
                result.free = result.free + " MB";
            }
            var videopercent = parseFloat(result.videospace) / parseFloat(result.storage);
            if (parseFloat(result.videospace) > 1024) {

                result.videospace = (parseFloat(result.videospace) / 1024).toFixed(2) + " GB";
            } else {
                result.videospace = result.videospace + " MB";
            }

            if (parseFloat(result.cacheSize) > 1024) {

                result.cacheSize = (parseFloat(result.cacheSize) / 1024).toFixed(2) + " GB";
            } else {
                result.cacheSize = result.cacheSize + " MB";
            }
            var audiopercent = parseFloat(result.audiospace) / parseFloat(result.totalSpace);
            if (parseFloat(result.audiospace) > 1024) {

                result.audiospace = (parseFloat(result.audiospace) / 1024).toFixed(2) + " GB";
            } else {
                result.audiospace = result.audiospace + " MB";
            }

            if (parseFloat(result.imagespace) > 1024) {

                result.imagespace = (parseFloat(result.imagespace) / 1024).toFixed(2) + " GB";
            } else {
                result.imagespace = result.imagespace + " MB";
            }

            var occupiedpercent = parseFloat(result.occupied) / parseFloat(result.storage);
            if (parseFloat(result.occupied) > 1024) {
                result.occupied = (parseFloat(result.occupied) / 1024).toFixed(2) + " GB";
            } else {
                result.occupied = result.occupied + " MB";
            }
            result.storage = (parseFloat(result.storage) / 1024).toFixed(2) + " GB";
            var rooted = "";
            var rootedcolor = "";
            var card = "";
            var cardcolor = "";
            if (result.IsDeviceRooted == 'true') {
                rooted = "./public/images/wrong.png";
                rootedcolor = "red";
            } else {
                rooted = "./public/images/right.png";
                rootedcolor = "green";
            }
            if (result.ExternalStorageExists == 'true') {
                card = "./public/images/wrong.png";
                cardcolor = "red";
            } else {
                card = "./public/images/right.png";
                cardcolor = "green";
            }
            dataModel = {
                modelnumber: result.model,
                androidversion: result.android_version,
                serialnumber: result.serial,
                lblstorage: result.storage,
                lblpower: result.power + "%",
                prgpower: result.power + "%",
                prgstorage: percentStorage + "%",
                storagePercent: parseInt(percentStorage),
                audiospace: result.audiospace,
                appsCount: result.appsCount,
                contactCount: result.contactCount,
                imagespace: result.imagespace,
                videospace: result.videospace,
                messageCount: result.messageCount,
                appsCount: result.appsCount.length,
                cacheSize: result.cacheSize
            };
            mainScreen(dataModel);

        } catch (err) {
            alert(err);
        }

    });
}

function EraseData() {
    var message = `
        <ul>
                  <li>E</li>
                  <li>R</li>
                  <li>A</li>
                  <li>S</li>
                  <li>I</li>
                  <li>N</li>
                  <li>G</li>
                  
                </ul>
        `
    $("#spnloader").html(message);
    socket.emit("MultiEraseData", 1);
}

function redirectDevcieMainScreen() {
    $(".clstab").removeClass("active");
    $("#tabDeviceInfo").addClass("active");
    console.log(dataModel);
    mainScreen(dataModel);
}

function redirectDevcieStorageScreen() {
    $(".clstab").removeClass("active");
    $("#tabDeviceStorage").addClass("active");
    deviceStorageScreen(dataModel);
}

window.addEventListener("load", init, false);