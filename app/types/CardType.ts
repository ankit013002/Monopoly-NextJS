export type CardEffect =
  | { type: "collect"; amount: number }
  | { type: "pay"; amount: number }
  | { type: "collect_from_players"; amount: number }
  | { type: "pay_players"; amount: number }
  | { type: "move_to"; spaceId: number }
  | { type: "move_relative"; steps: number }
  | {
      type: "move_nearest";
      spaceType: "railroad" | "utility";
      spaceIds: number[];
    }
  | { type: "get_out_of_jail" }
  | { type: "go_to_jail" }
  | { type: "repairs"; perHouse: number; perHotel: number };

export type CardType = {
  id: number;
  text: string;
  effect: CardEffect;
};
