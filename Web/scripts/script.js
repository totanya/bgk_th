//================ html events ===============
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

var needWrite = false;

var data = [];
var drag = false;
var containerPosition = null;
//================ jquery events ===============

function onStartDragging(ev, ui) {
    drag = true;
}

function onStopDragging(ev, ui) {
    drag = false;
}

function onDrag(ev, ui) {

}



$(function() {

    for (let i = 0; i < 6; i++) {
        $("#template .draggable").clone().appendTo("#row1");
        $("#template .draggable").clone().appendTo("#row2");
    }


    $("#drop_block").droppable();

    $('#btnStop').hide();

    $('#btnStart').click(function() {
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

    });

    $('#btnStop').click(function() {
        needWrite = false;
        $('#btnStart').show();
        $('#btnStop').hide();
        var json = JSON.stringify(data);
        $('#result').text(json);
    });

    containerPosition = $("#container").offset();

    $(window).resize(function() {
        containerPosition = $("#container").offset();
    });

    $("#container").mousemove(function(event) {
        $("#x").text(event.pageX);
        $("#y").text(event.pageY);
        $("#drag").text(drag);
        $("#con_x").text(event.pageX - containerPosition.left);
        $("#con_y").text(event.pageY - containerPosition.top);
        var elem = { x: event.pageX, y: event.pageY, drag: drag }
        if (needWrite)
            data.push(elem);

    });
});