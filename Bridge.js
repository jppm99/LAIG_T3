class Bridge {

    makeMove(gameState, team, move1, move2) {
        let sentStr = "move(" + gameState + "," + team + "," + move1 + "," + move2 + ")";
        console.log("Sent: " + sentStr);

        return this.makeRequest(sentStr);
    }

    makeMoveComputer(gameState, team, diff) {
        let sentStr = "computer_move(" + gameState + "," + team + "," + diff + ")";
        console.log("Sent: " + sentStr);

        return this.makeRequest(sentStr);
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
        this.getPrologRequest(requestString, this.handleReply);
        return this.reply;
    }

    //Handle the Reply
    handleReply(data) {
        this.reply = data.target.response;
    }
}