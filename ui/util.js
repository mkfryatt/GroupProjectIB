const middleware_path = 'backend/middleware/';

function getUnepPresencesWithinTimeframe(start, end, callbackFunction) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callbackFunction(JSON.parse(this.responseText));
        }
    }
    let request = {
        method: 'getUnepPresencesWithinTimeframe',
        params: {
            start : start,
            end : end
        }
    };
    xmlhttp.open("GET", middleware_path + "util.php?q=" + JSON.stringify(request), true);
    xmlhttp.send();
}

function getOrganizationPresencesWithinTimeframe(organization, start, end) {
    //TODO:
}
