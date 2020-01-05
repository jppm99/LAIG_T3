class Bridge {
    static reply = ""; // dont touch -> i have no idea why but it wont work if changed to this.reply

    parseGameState(gameState) {
        let str = "";

        for(let tab = 0; tab < 4; tab++) {
            for(let y = 0; y < 4; y++) {
                for(let x = 0; x < 4; x++) {
                    str += gameState[tab][y][x] + "-";
                }   
            }
        }

        return str.substring(0, str.length - 1);
    }

    makeMove(gameState, team, move1, move2) {
        let sentStr = "move(" + gameState + "," + team + "," + move1 + "," + move2 + ")";

        //console.log("Sent: " + sentStr);

        this.makeRequest(sentStr);

        //this.timeout(500); // synchronization issues

        //console.log("this.reply -> " + typeof(Bridge.reply) + " - " + Bridge.reply);

        return Bridge.reply;
    }

    makeMoveComputer(gameState, team, diff) {
        let sentStr = "computer_move(" + gameState + "," + team + "," + diff + ")";
        //console.log("Sent: " + sentStr);

        this.makeRequest(sentStr);

        return Bridge.reply;
    }

    getState(gameState) {
        let sentStr = "state(" + gameState + ")";

        //console.log("Sent: " + sentStr);

        this.makeRequest(sentStr);

        return Bridge.reply;
    }


    getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081;
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, false); //last arg is true if async

        request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
        request.onerror = onError || function(){console.log("Error waiting for response");};

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    makeRequest(requestString) {
        // Make Request
        this.getPrologRequest(requestString, this.handleReply, this.handleError);
    }

    //Handle the Reply
    handleReply(data) {
        //console.log("Reply: " + data.target.response);
        Bridge.reply = data.target.response;
    }

    handleError() {
        Bridge.reply = undefined;
        console.log("Error in reply");
    }

    // bad funtion that returns after ms (is not async :D )
    timeout(ms) {
        let d = new Date();
        let init = d.getTime();

        let currD = 0;

        while( currD < init + ms) {
            let d2 = new Date();
            currD = d2.getTime();
        }
    }
}