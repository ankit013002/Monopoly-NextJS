export type GameStateType = {
  playerCount: number;
  playerTurnIndex: number;
  players: [
    {
      socketId: string;
      name: string;
      color: string;
      balance: number;
      ownedSpaces: number[];
      position: number;
    },
  ];
};
