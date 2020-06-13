import { currUser } from './Init.js';

export class Game {

    constructor(game, initState, initiator) {

        let email;

        currUser.update(state => {
            email = state.email;
            return state;
        });

        this.gameID = game._id;
        this.time = game.time;
        this.timer = game.time;
        this.opp = null;
        this.oppID = initiator == false ? game.priEmail : null;
        this.currPlayer = game.currPlayer;
        this.numMoves = game.priMoves + game.secMoves;
        this.myMoves = game.priEmail == email ? game.priMoves : game.secMoves;
        this.rangeMoves = game.priMoves + game.secMoves + 1;
        this.paused = true;
        this.finished = game.finished;
        this.side = game.side;
        this.secondsPlayed = 0;
        this.states = [initState];
    }
}