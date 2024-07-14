const GameState = Object.freeze({
    ACTIVE: Symbol('active'),
    WAITING: Symbol('waiting'),
    FINISHED: Symbol('finished')
});

const Prompts = ['horse', 'beaver', 'chicken'];

class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.score = 0;
        this.timesDrawn = 0;
    }
}

class GameManager {
    constructor(maxTurns) {
      this.players = [];
      this.hasntDrawn = [];
      this.turnsElapsed = 0;
      this.gameState = GameState.WAITING;
      this.minPlayers = 4;
      this.maxPoints = 100;
      this.turnDuration = 60000;
      this.turnTimeout = null;
      this.maxTurns = maxTurns;
      this.currentPrompt = null;
      this.turnStartTime = new Date();
      this.drawers = [];
    }

    addPlayer(id, name) {
      if (this.gameState === GameState.WAITING) {
        const player = new Player(id, name);
        this.players.push(player);
      }
    }

    startGame() {
      if (this.players.length >= this.minPlayers) {
        this.gameState = GameState.ACTIVE;
        this.nextTurn();
      }
    }

    endGame() {
        const winner = this.players.reduce((a, b) => a.score > b.score ? a : b);
        this.resetGame();
        return winner;
    }

    makeGuess(playerId, guess) {
        if (this.drawers.find(d => d.id === playerId)) {
            return;
        }

        if (this.gameState === GameState.ACTIVE && guess.toLowerCase() === this.currentPrompt) {
            const timeTaken = new Date() - this.turnStartTime;
            const score = this.maxPoints * (this.turnDuration - timeTaken) / this.turnDuration;
            this.updateScore(playerId, Math.max(0, score));
        }
    }

    randPrompt() {
        return Prompts[Math.floor(Math.random() * Prompts.length)];
    }

    nextTurn() {
        clearTimeout(this.turnTimeout);
        this.turnsElapsed++;
        this.drawers = [];

        if (this.turnsElapsed >= this.maxTurns) {
            this.endGame();
            return;
        }

        this.currentPrompt = this.randPrompt();
        this.turnStartTime = new Date();

        for (let i = 0; i < 2; i++) {
            let drawer = this.findDrawer();
            this.players.find(p => p.id === drawer.id).timesDrawn++;
            this.drawers.push(drawer);
        }

        this.turnTimeout = setTimeout(() => {
            this.nextTurn();
        }, this.turnDuration);
    }

    findDrawer() {
        const sortedPlayers = this.players.slice().sort((a, b) => a.timesDrawn - b.timesDrawn);
        // Find the closest player that isn't in the drawers list
        for (let i = 0; i < sortedPlayers.length; i++) {
            if (!this.drawers.includes(sortedPlayers[i])) {
                return sortedPlayers[i];
            }
        }
    }

    updateScore(playerId, points) {
        const player = this.players.find(p => p.id === playerId);
        if (player) {
            player.score += points;
        }
    }

    resetGame() {
        this.players.forEach(player => player.score = 0);
        this.turnsElapsed = 0;
        this.gameState = GameState.WAITING;
        clearTimeout(this.turnTimeout);
    }
}

export default { GameState, Player, GameManager };
