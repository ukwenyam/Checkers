export class Game {

    constructor(game, initState, initiator) {

        this.gameID = game._id;
        this.initiator = initiator;
        this.time = game.time;
        this.timer = game.time;
        this.opp = null;
        this.oppID = initiator == false ? game.priEmail : null;
        this.currPlayer = game.currPlayer;
        this.numMoves = game.priMoves + game.secMoves;
        this.myMoves = game.priEmail == game.email ? game.priMoves : game.secMoves;
        this.rangeMoves = game.priMoves + game.secMoves;
        this.paused = game.finished == true ? false : true;
        this.finished = game.finished;
        this.side = game.side;
        this.secondsPlayed = game.minutesPlayed * 60;
        this.states = initState.length == 8 ? [initState] : initState;
    }
}