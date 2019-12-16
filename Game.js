class Game {
    constructor(scene) {
        this.scene = scene;

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

        this.changesList = [];
    }

    play() {
        let player, color;

        this.getPlayerColor(player, color);


        let ret, move;
        if(player == "Human") {
            movement = this.chooseMoveHuman();
            ret = this.move(movement, color);
        }
        else{
            ret = this.chooseMoveComputer(player, color);
        }

        if(ret.length === 0) return;

        ret.sort((a, b) => (a[4] > b[4]) ? 1 : -1);

        this.changesList.push(ret);
        ret.forEach(this.updateBoard);
        
        this.turn++;
    }

    getPlayerColor(player, color) {
        if(this.turn % 2){
            color = "white";
            player = this.scene.white;
        }
        else{
            color = "black";
            player = this.scene.black;
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

    chooseMoveHuman() {
        //TODO
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
        return this.bridge.makeMove(this.board, color, movement[0], movement[1]);
    }

    undo() {
        this.changesList.pop();

        this.board = [...this.initialBoard];
        for(let i = 0; i < this.changesList.length; i++) {
            this.changesList[i].forEach(this.updateBoard);
        }

        this.turn--;
    }

}