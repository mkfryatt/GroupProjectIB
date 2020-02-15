let middleware_path = '../../backend/middleware/';
let preamble = '[user]$ ';
let history = [];
let history_id = -1;

function runCmdFuture(str,outputCallback) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            outputCallback(this.responseText);
        }
    }
    xmlhttp.open("GET", middleware_path+"runcmd.php?q=" + str, true);
    xmlhttp.send();
}

function putHello() {
    document.getElementById('linecmd').value = "Hello";
    //return document.getElementById('linecmd').val;
}

function executeLine() {
    cmd = document.getElementById('linecmd').value;
    history.unshift(cmd);
    history_id=-1;
    document.getElementById('linecmd').value = '';
    document.getElementById("content").innerHTML += preamble + cmd + '</br>';
    runCmdFuture(cmd,function (output) {
        document.getElementById("content").innerHTML +=  output + '</br>';
    });
}

function init() {
    document.getElementById('linecmd').focus();
    document.getElementById('preamble_div').innerText = preamble;
}

function handleKeyPress(e) {

    if (e.keyCode === 13) {
        executeLine();
    } else if(e.keyCode ===38){
        //up
        if(history_id+1<history.length){
            ++history_id;
            document.getElementById('linecmd').value = history[history_id];
        }

    } else if(e.keyCode ===40){
        //down
        if(history_id<0){}
        else {
            --history_id;
            if(history_id==-1){
                document.getElementById('linecmd').value = '';
            } else {
                document.getElementById('linecmd').value = history[history_id];
            }
        }
    }
    console.log(history_id);
}