const middleware_path = '../backend/middleware/';

function sendXmlHttpRequest(request, callback) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText));
        }
    }
    xmlhttp.open("GET", middleware_path + "util.php?q=" + JSON.stringify(request), true);
    xmlhttp.send();
}

function getUnepPresencesWithinTimeframe(start, end, callbackFunction) {
    let request = {
        method: 'getUnepPresencesWithinTimeframe',
        params: {
            start : start,
            end : end
        }
    };
    sendXmlHttpRequest(request,callbackFunction);
}

function getOrganizationPresencesWithinTimeframe(organization, start, end) {
    //TODO:
}
