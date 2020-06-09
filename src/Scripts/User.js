export class User {

    constructor(data) {
        this.isAuth = true;
        
        this.name = data.name;
        this.email = data.email;
        this.picture = data.picture == null ? 'https://api.adorable.io/avatars/285/' + data.email + '.png' : data.picture;
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
        this.position = null;
    }
}