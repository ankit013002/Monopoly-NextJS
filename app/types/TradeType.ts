export type TradeType = {
  from: string; // socketId of the player who initiated the trade
  to: string; // socketId of the player who is being offered the trade
  offer: {
    money: number;
    properties: number[]; // array of property IDs being offered
  };
  request: {
    money: number;
    properties: number[]; // array of property IDs being requested
  };
};
