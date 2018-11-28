var socket = io.connect('http://localhost:3333');

function init() {
    $("#tblDetails").addClass('hidecls');
    $(".alertMessage").addClass('showcls');
    SocketsConnection();
    $(".btntooltip").tooltip();
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
        $("#" + data.devicedata.id).remove();
        $("#tblDetails").removeClass('hidecls');
        $(".alertMessage").addClass('hidecls');
        $(".loadercls").addClass('hidecls');
        var htmlData = `<tr id="${data.devicedata.id}" class="device-tr">
        <td colspan="10">
        <img src='./public/images/30.gif'/><br/>
        Loading Device...
        </td>
        </tr>`
        $("#tblbodyDetails").append(htmlData)
        socket.emit("installApk", data.devicedata.id);
    });

    socket.on('deviceaddresponseAgain', function (data) {
        socket.emit("installApk", data.devicedata.id);
    });

    socket.on('deviceremoveresponse', function (data) {
        $("#" + data).remove();
        alert('Device Removed..');
    });

    socket.on('deviceremoveresponse2', function (data) {
        //alert(data);
    });

    socket.on('devicetryBack', function (data) {
        socket.emit("devicetryBackData", data);
    });

    socket.on('SingleEraseDataResponse', function (data) {
        $("#devicedelete").removeClass("spnHide");
        $("#spn" + data).removeClass("spnHide");
        $("#" + data).addClass("reduceOpacity");
        console.log(data);

    });

    socket.on('SingleEraseDataError', function (data) {
        console.log(data);
    });

    socket.on('deviceDataResult', function (data) {
        console.log(data);
        try {
            $("#tblDetails").removeClass('hidecls');
            $(".alertMessage").addClass('hidecls');
            $(".overlayloader").addClass('hidecls');
            var _splitResult = data.split('&');
            console.log(_splitResult);
            var strData = _splitResult[0].toString().replace('"{', '{') //_splitResult[0].substr(1, _splitResult[0].length - 3);
            strData = strData.toString().replace('}"', '}')
            var result = JSON.parse(strData);
            console.log(result);
            result.deviceId = _splitResult[1];

            var freepercent = parseFloat(result.free) / parseFloat(result.storage);

            if (parseFloat(result.free) > 1024) {

                result.free = (parseFloat(result.free) / 1024).toFixed(2) + " GB";

            } else {
                result.free = result.free + " MB";
            }
            var videopercent = parseFloat(result.videoSize) / parseFloat(result.totalSpace);
            if (parseFloat(result.videoSize) > 1024) {

                result.videoSize = (parseFloat(result.videoSize) / 1024).toFixed(2) + " GB";
            } else {
                result.videoSize = result.videoSize + " MB";
            }
            var audiopercent = parseFloat(result.audioSize) / parseFloat(result.totalSpace);
            if (parseFloat(result.audioSize) > 1024) {

                result.audioSize = (parseFloat(result.audioSize) / 1024).toFixed(2) + " GB";
            } else {
                result.audioSize = result.audioSize + " MB";
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
            var data =
                //`<tr>
                `<td id="spn${result.deviceId}" class="spnHide">
                <img src="./public/images/right.png" style="width:30px;height:30px;"/>
                </td>
                <td>${result.model}</td>
                    <td> ${result.serial} 
                </td>
                    <td>${result.storage}</td>
                    <td><meter value="${freepercent}" max="1">${freepercent}%</meter><br/> ${result.free} </td>
                    <td><meter value="${occupiedpercent}" max="1">${occupiedpercent}%</meter><br/> ${result.occupied}</td>
                    <td>
                    <img src="${rooted}" style="width:30px;height:30px;"/>
                    </td>
                    <td>
                    <img src="${card}" style="width:30px;height:30px;"/>
                    </td>`;

            //</tr>`;
            $("#" + result.deviceId).empty();
            $("#" + result.deviceId).append(data);

        } catch (err) {
            alert(err);
        }

    });
}

function EraseData() {
    socket.emit("MultiEraseData", 1);
}
window.addEventListener("load", init, false);