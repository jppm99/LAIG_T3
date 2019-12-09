class Game {
    constructor(scene) {
        this.scene = scene;

        this.bridge = new Bridge();

        this.turn = 0; // even -> black | odd -> white
        this.board = undefined; //TODO
        this.changesList = [];
    }

    play() {
        let player, color;

        this.getPlayerColor(player, color);


        if(player == "Human") {
            this.chooseMoveHuman();
        }
        else{
            this.chooseMoveComputer(player);
        }

        this.move();

        this.turn++;
    }

    getPlayerColor(player, color) {
        if(this.turn % 2){
            color = 'white';
            player = this.scene.white;
        }
        else{
            color = 'black';
            player = this.scene.black;
        }
    }

    chooseMoveHuman() {
        //TODO
    }

    chooseMoveComputer(player) {
        switch (player) {
            case "Computer1":
                //choose move diff 1
                break;
            case "Computer2":
                //choose move diff 2
                break;
            case "Computer3":
                //choose move diff 3
                break;
            default:
                break;
        }
        //TODO
    }

    move() {
        //TODO
    }

    undo() {
        this.changesList.pop();
        this.turn--;
    }

}