var needWrite = false;
var data = [];
var drag = false;
var initialState = {};
//================ jquery events ===============

function onStartDragging(ev, ui) {
    drag = true;
}

function onStopDragging(ev, ui) {
    drag = false;
}

function onDrag(ev, ui) {

}

function DownloadJSON() {
    if (data.length == 0) return;
    //Convert JSON Array to string.
    var json = JSON.stringify(data);

    //Convert JSON string to BLOB.
    json = [json];
    var blob1 = new Blob(json, { type: "text/plain;charset=utf-8" });

    //Check the Browser.
    var isIE = false || !!document.documentMode;
    if (isIE) {
        window.navigator.msSaveBlob(blob1, "data.json");
    } else {
        var url = window.URL || window.webkitURL;
        link = url.createObjectURL(blob1);
        var a = $("<a />");
        a.attr("download", "data.json");
        a.attr("href", link);
        $("body").append(a);
        a[0].click();
        $("body").remove(a);
    }
}

function reset() {
    $('#row1').html('');
    $('#row2').html('');
    for (let i = 0; i < 7; i++) {
        $("#template .draggable").clone().appendTo("#row1");
        $("#template .draggable").clone().appendTo("#row2");
    }


    $('#btnStart').show();
    $('#btnStop').hide();
    $('#btnReset').hide();
    data = [];
    needWrite = false;
    $('#result').html('');
}

function logData(event) {
    var relX = event.pageX - initialState.left;
    var rely = event.pageY - initialState.top;
    var elem = [performance.now() - initialState.time, relX, rely, +drag];
    if (needWrite)
        data.push(elem);
}

$(function() {
    reset();
    $("#drop_block").droppable();
    $('#btnStop').hide();

    $('#btnStart').click(function(event) {
        data = [];
        needWrite = true;
        $('#btnStart').hide();
        $('#btnStop').show();

        $(".draggable").draggable({
            revert: "invalid",
            containment: "#container",
            snap: false,
            start: onStartDragging,
            drag: onDrag,
            stop: onStopDragging
        });
        initialState.left = $("#container").offset().left;
        initialState.top = $("#container").offset().top;
        initialState.time = performance.now();

        logData(event);
    });

    $('#btnReset').click(function() {
        reset();
    });

    $('#btnStop').click(function() {
        needWrite = false;
        $('#btnStart').show();
        $('#btnReset').show();
        $('#btnStop').hide();

        var json = JSON.stringify(data, undefined, 4);
        $('#result').html(PR.prettyPrintOne(json));
    });

    $('#copy_btn').click(function() {
        var json = JSON.stringify(data, undefined, 4);
        navigator.clipboard.writeText(json);
    });

    $('#download_btn').click(function() {
        DownloadJSON();
    });

    $(window).resize(function() {
        initialState.left = $("#container").offset().left;
        initialState.top = $("#container").offset().top;
    });

    $("#container").mousemove(function(event) {
        // $("#x").text(event.pageX);
        // $("#y").text(event.pageY);
        // $("#drag").text(drag);        
        // $("#con_x").text();
        // $("#con_y").text();
        logData(event);
    });
});