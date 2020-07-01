export class User {

    constructor(data) {
        this.isAuth = true;
        
        this.name = data.name;
        this.email = data.email;
        this.picture = data.picture == null ? 'https://api.adorable.io/avatars/285/' + data.email + '.png' : data.picture;
        
        this.wins = data.wins || data.stats.wins;
        this.draws = data.draws || data.stats.draws;
        this.losses = data.losses || data.stats.losses;
        this.gamesPlayed = data.gamesPlayed || data.stats.gamesPlayed;
        this.leastMoves = data.leastMoves || data.stats.leastMoves;
        this.mostMoves = data.mostMoves || data.stats.mostMoves;
        this.totalMoves = data.totalMoves  || data.stats.totalMoves;
        this.avgMovesPerGame = data.avgMovesPerGame || data.stats.avgMovesPerGame;
        this.leastTimePlayed = data.leastTimePlayed || data.stats.leastTimePlayed;
        this.mostTimePlayed = data.mostTimePlayed || data.stats.mostTimePlayed;
        this.totalTimePlayed = data.totalTimePlayed || data.stats.totalTimePlayed;
        this.avgTimePlayPerGame = data.avgTimePlayPerGame || data.stats.avgTimePlayPerGame;
        this.totalPoints = data.totalPoints || data.stats.totalPoints;
        this.position = null;

        this.gamePref = {
            myColor: data.gamePreferences.myColor,
            otherColor: data.gamePreferences.otherColor,
            compTime: data.gamePreferences.compTime,
            orient: data.gamePreferences.orient
        }
    }
}