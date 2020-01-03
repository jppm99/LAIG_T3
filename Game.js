class Game {
    constructor(scene) {
        this.scene = scene;

        this.gameRunning = true;
        
        this.bridge = new Bridge();
        
        this.initialBoard = [
            [
                ["white","white","white","white"],
                ["empty","empty","empty","empty"],
                ["empty","empty","empty","empty"],
                ["black","black","black","black"]
            ],
            [
                ["white","white","white","white"],
                ["empty","empty","empty","empty"],
                ["empty","empty","empty","empty"],
                ["black","black","black","black"]
            ],
            [
                ["white","white","white","white"],
                ["empty","empty","empty","empty"],
                ["empty","empty","empty","empty"],
                ["black","black","black","black"]
            ],
            [
                ["white","white","white","white"],
                ["empty","empty","empty","empty"],
                ["empty","empty","empty","empty"],
                ["black","black","black","black"]
            ]
        ];
        
        this.board = [...this.initialBoard];
        
        this.whiteScore = 0;
        this.blackScore = 0;
        
        this.turn = 0; // even -> black | odd -> white
        this.pickingState = 0;

        this.changesList = [];
    }

    play() {

        if(!this.gameRunning) return 1;

        let player, color;
        let temp = [];

        this.getPlayerColor(temp);

        player = temp[0];
        color = temp[1];


        let ret, movement;
        if(player == "Human") {
            movement = this.chooseMoveHuman(color);
            
            if(movement == null) return;

            console.log("move " + movement);

            ret = this.move(movement, color);
        }
        else{
            ret = this.chooseMoveComputer(player, color); // not sure -> need to check prolog
        }

        console.log(ret);

        if(ret.length === 0) {
            console.log("Invalid move\n");
            return;
        }

        ret.sort((a, b) => (a[4] > b[4]) ? 1 : -1);

        this.changesList.push(ret);
        ret.forEach(this.updateBoard);
        
        this.turn++;
    }

    getPlayerColor(PCArr) {
        if(this.turn % 2){
            PCArr[0] = this.scene.white;
            PCArr[1] = "white";
        }
        else{
            PCArr[0] = this.scene.black;
            PCArr[1] = "black";
        }
    }

    updateBoard(move) {
        let XI = move[0],
            YI = move[1],
            XF = move[3],
            YF = move[4];

        let valorInicial = this.boardPos(XI, YI, "empty");

        if(XF < 0 || YF < 0) {
            if(valorInicial == "black") this.whiteScore++;
            else if(valorInicial == "white") this.blackScore++;
        }
        else
            this.boardPos(XF, YF, valorInicial);
    }
    
    // coordenadas 1-8
    boardPos(X, Y, P) {
        let indice1;
        if(Y<5) {
            if(X<5) indice1 = 0;
            else indice1 = 1;
        }
        else {
            if(X<5) indice1 = 2;
            else indice1 = 3;
        }

        let indice2 = (Y-1) % 4;

        let indice3 = (X-1) % 4;

        let temp = this.board[indice1][indice2][indice3];
        
        if(P != undefined) {
            this.board[indice1][indice2][indice3] = P;
        }
        
        return temp;
    }

    chooseMoveHuman(color) {
        this.scene.logPicking();
        this.scene.clearPickRegistration();

        if(this.scene.pick == undefined) return null;

        let pos = this.scene.pick;
        let piece = this.board[Math.floor(pos/100 - 1)][Math.floor((pos/10) % 10)][Math.floor(pos%10)]; 

        switch(this.pickingState) {
            case 0:
                if(piece != color){
                    console.log("Invalid Selection\n");
                    break;
                }
                this.chooseMoveHuman.p1 = pos;
                this.pickingState++;
                break;
            case 1:
                if(piece == color){
                    console.log("Invalid Selection\n");
                    break;
                }
                this.chooseMoveHuman.p2 = pos;
                this.pickingState++;
                break;
            case 2:
                if(piece != color){
                    console.log("Invalid Selection\n");
                    break;
                }
                this.chooseMoveHuman.p3 = pos;
                this.pickingState++;
                break
            case 3:
                if(piece == color){
                    console.log("Invalid Selection\n");
                    break;
                }
                this.chooseMoveHuman.p4 = pos;
                this.pickingState = 0;
                return [this.chooseMoveHuman.p1, this.chooseMoveHuman.p2, this.chooseMoveHuman.p3, this.chooseMoveHuman.p4];
        }

        return null;
    }

    chooseMoveComputer(player, color) {
        let diff;
        switch (player) {
            case "Computer1":
                diff = "1";
                break;
            case "Computer2":
                diff = "2";
                break;
            case "Computer3":
                diff = "3";
                break;
            default:
                break;
        }
        return this.bridge.chooseMoveComputer(this.board, color, diff);
    }

    move(movement, color) {
        let x1, y1, x2, y2, x3, y3, x4, y4;

        x1 = this.decodeCoord(movement[0], "x");
        y1 = this.decodeCoord(movement[0], "y");

        x2 = this.decodeCoord(movement[1], "x");
        y2 = this.decodeCoord(movement[1], "y");

        x3 = this.decodeCoord(movement[2], "x");
        y3 = this.decodeCoord(movement[2], "y");

        x4 = this.decodeCoord(movement[3], "x");
        y4 = this.decodeCoord(movement[3], "y");

        return this.bridge.makeMove(this.board, color, [x1, y1, x2, y2], [x3, y3, x4, y4]);
    }

    undo() {
        console.log("undo!");
        this.changesList.pop();

        this.board = [...this.initialBoard];
        for(let i = 0; i < this.changesList.length; i++) {
            this.changesList[i].forEach(this.updateBoard);
        }

        this.turn--;
    }

    movie() {
        console.log("movie!");
        this.board = [...this.initialBoard];
        for(let i = 0; i < this.changesList.length; i++) {
            this.changesList[i].forEach(this.updateBoard);
            //add animation
        }
    }

    decodeCoord(code, axis){
        let tab = Math.floor(code / 100);
        let y = Math.floor((code / 10) % 10);
        let x = Math.floor(code % 10);

        if(axis == "x"){
            return x + 4 * Math.floor((tab+1) % 2) + 1;
        }
        else if(axis == "y"){
            return y + 4 * (tab > 2) + 1;
        }
    }

}