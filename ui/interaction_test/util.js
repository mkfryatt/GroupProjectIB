const middleware_path = '../../backend/middleware/';
let preamble = '[user]$ ';

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
    document.getElementById('linecmd').value = '';
    document.getElementById("content").innerHTML += preamble + cmd + '</br>';
    runCmdFuture(cmd,function (output) {
        document.getElementById("content").innerHTML +=  output ;
    });
}

function init() {
    document.getElementById('linecmd').focus();
    document.getElementById('preamble_div').innerText = preamble;
}

function handleKeyPress(e) {
    if (e.keyCode === 13) {
        executeLine();
    }
}