class Bridge {

    makeMove(gameState, player, move1, move2) {
        var sentArray = [];
        sentArray.push("move", gameState, player, move1, move2);

        return makeRequest(sentArray);
    }


    getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = onSuccess || function (data) {
            console.log("Request successful. Reply: " + data.target.response);
        };
        request.onerror = onError || function () {
            console.log("Error waiting for response");
        };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    makeRequest(requestString) {
        // Make Request
        getPrologRequest(requestString, handleReply);
        return this.reply;
    }

    //Handle the Reply
    handleReply(data) {
        this.reply = data.target.response;
    }
}