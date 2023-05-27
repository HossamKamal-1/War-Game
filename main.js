// GameUIElement Constructor Function
function GameUIElement() {
  this.playersCardEl = document.querySelectorAll(".game-card");
  this.playersAttackBtns = document.querySelectorAll(".attack-btn");
  this.playersHealBtns = document.querySelectorAll(".heal-btn");
}

// Game Constructor Function
function Game(firstPlayerName, secondPlayerName) {
  // Private Properties
  const player1 = new Character(firstPlayerName);
  const player2 = new Character(secondPlayerName);
  // player1.attack(); // not defined  because of the prototype,attack is added in the last of the code not the first (code order)
  // Public Properties
  this.players = [player1, player2];
  this.currentPlayerIndex = Math.round(Math.random()); // first player to start
  this.gameELements = new GameUIElement();
  this.gameELements.playersCardEl = document.querySelectorAll(".game-card");
  this.gameELements.playersAttackBtns =
    document.querySelectorAll(".attack-btn");
  this.gameELements.playersHealBtns = document.querySelectorAll(".heal-btn");
  // Initial player turn UI
  this.gameELements.playersCardEl[this.currentPlayerIndex].classList.add(
    "myturn"
  );
  // Attack Btns
  this.gameELements.playersAttackBtns.forEach((attackBtn) => {
    attackBtn.addEventListener("click", (e) => {
      this.handleAttack(e);
    });
  });
  // Heal Btns
  this.gameELements.playersHealBtns.forEach((healBtn) => {
    healBtn.addEventListener("click", (e) => {
      this.handleHeal(e);
    });
  });
}

// Instance Methods
Game.prototype.handleAttack = function ({ currentTarget }) {
  const currentPlayer = this.players[this.currentPlayerIndex];
  const opponent = this.players[1 - this.currentPlayerIndex];
  if (currentTarget.dataset.player === currentPlayer.name) {
    currentPlayer.attack(opponent);
    this.checkGameOver();
    this.currentPlayerIndex = 1 - this.currentPlayerIndex;
    this.handleTurnUI();
  }
};
Game.prototype.handleHeal = function ({ currentTarget }) {
  const currentPlayer = this.players[this.currentPlayerIndex];
  if (
    currentTarget.dataset.player === currentPlayer.name &&
    currentPlayer.getHealth() !== 100 // currentPlayer.gethealth() !== 100 to not change turn when heal btn  is press and the player is 100% health
  ) {
    currentPlayer.heal();
    this.currentPlayerIndex = 1 - this.currentPlayerIndex;
    this.handleTurnUI();
  }
};
Game.prototype.handleTurnUI = function () {
  this.gameELements.playersCardEl.forEach((playerCardEl) => {
    playerCardEl.classList.remove("myturn");
  });
  if (this.checkGameOver()) return;
  this.gameELements.playersCardEl[this.currentPlayerIndex].classList.add(
    "myturn"
  );
};
Game.prototype.showResultUI = function (player, msg) {
  const playerGameResult = document.querySelector(
    `.game-result[data-player="${player.name}"]`
  );
  playerGameResult.classList.remove("d-none");
  player.isDead()
    ? playerGameResult.classList.add("lose")
    : playerGameResult.classList.add("win");
  playerGameResult.textContent = `${player.name} ${msg}`;
};
Game.prototype.checkGameOver = function () {
  const lostPlayerIndex = this.players.findIndex((player) => player.isDead());
  if (lostPlayerIndex !== -1) {
    const lostPlayer = this.players[lostPlayerIndex];
    const winnerPlayer = this.players[lostPlayerIndex === 1 ? 0 : 1];
    this.showResultUI(lostPlayer, "You Lost");
    this.showResultUI(winnerPlayer, "You Win");
    // remove all attack btns
    this.gameELements.playersAttackBtns.forEach((attackBtn) => {
      attackBtn.remove();
    });
    // remove all heal btns
    this.gameELements.playersHealBtns.forEach((healBtn) => {
      healBtn.remove();
    });
    return true;
  }
  return false;
};
const game = new Game("Son Goku", "Goku Black");
// Character Constructor Function
function Character(name) {
  // Private Properties
  let _health = 100;
  // Public Properties
  this.name = name;
  this.setHealth = function (healthValue) {
    _health = healthValue;
  };
  this.getHealth = function () {
    return _health;
  };
}

// Instance Methods
Character.prototype.attack = function (opponent) {
  console.log("attacking");
  console.log("damage points", Character.getAttackDamage());
  let newOpponentHealth = opponent.getHealth() - Character.getAttackDamage();
  newOpponentHealth = newOpponentHealth < 0 ? 0 : newOpponentHealth;
  Character.setHealthEl.call(opponent, newOpponentHealth);
};
Character.prototype.heal = function () {
  if (this.getHealth() < 100) {
    let healthAfterHeal = this.getHealth() + 20;
    healthAfterHeal = healthAfterHeal > 100 ? 100 : healthAfterHeal;
    Character.setHealthEl.call(this, healthAfterHeal);
  }
};
Character.prototype.isDead = function () {
  return this.getHealth() === 0;
};
// Static Methods
Character.getAttackDamage = function () {
  const getRandomDamagePoints = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };
  return getRandomDamagePoints(20, 30);
};
Character.setHealthEl = function (health) {
  this.setHealth(health);
  const healthBarEl = document.querySelector(
    `.health-bar[data-player="${this.name}"]`
  );
  healthBarEl.style.width = this.getHealth() + "%";
};
