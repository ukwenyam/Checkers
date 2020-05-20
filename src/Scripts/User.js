export class User {

    constructor() {
        this.isAuth = false;

        this.name = null;
        this.email = null;
        this.wins = 0;
        this.draws = 0;
        this.losses = 0;
        this.gamesPlayed = 0;
        this.leastMoves = 0;
        this.mostMoves = 0;
        this.totalMoves = 0;
        this.avgMovesPerGame = 0;
        this.leastTimePlayed = 0;
        this.mostTimePlayed = 0;
        this.totalTimePlayed = 0;
        this.avgTimePlayPerGame = 0;
        this.totalPoints = 0;
    }

    setProfile(data) {
        this.isAuth = true;
        
        this.name = data.name;
        this.email = data.email;
        this.wins = data.wins;
        this.draws = data.draws;
        this.losses = data.losses;
        this.gamesPlayed = data.gamesPlayed;;
        this.leastMoves = data.leastMoves;
        this.mostMoves = data.mostMoves;
        this.totalMoves = data.totalMoves;
        this.avgMovesPerGame = data.avgMovesPerGame;
        this.leastTimePlayed = data.leastTimePlayed;
        this.mostTimePlayed = data.mostTimePlayed;
        this.totalTimePlayed = data.totalTimePlayed;
        this.avgTimePlayPerGame = data.avgTimePlayPerGame;
        this.totalPoints = data.totalPoints;
    }
}