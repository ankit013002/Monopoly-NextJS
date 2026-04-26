import { CardType } from "../types/CardType";

export const CHANCE_CARDS: CardType[] = [
  {
    id: 1,
    text: "Advance to Go. Collect $200.",
    effect: { type: "move_to", spaceId: 0 },
  },
  {
    id: 2,
    text: "Advance to Illinois Ave. If you pass Go, collect $200.",
    effect: { type: "move_to", spaceId: 24 },
  },
  {
    id: 3,
    text: "Advance to St. Charles Place. If you pass Go, collect $200.",
    effect: { type: "move_to", spaceId: 11 },
  },
  {
    id: 4,
    text: "Advance token to the nearest Railroad. Pay owner twice the rental.",
    effect: { type: "move_nearest", spaceType: "railroad" },
  },
  {
    id: 5,
    text: "Advance token to the nearest Railroad. Pay owner twice the rental.",
    effect: { type: "move_nearest", spaceType: "railroad" },
  },
  {
    id: 6,
    text: "Advance token to the nearest Utility. If unowned, buy it; if owned, pay 10x your dice roll.",
    effect: { type: "move_nearest", spaceType: "utility" },
  },
  {
    id: 7,
    text: "Bank pays you a dividend of $50.",
    effect: { type: "collect", amount: 50 },
  },
  {
    id: 8,
    text: "Get out of Jail Free. This card may be kept until needed or traded.",
    effect: { type: "get_out_of_jail" },
  },
  {
    id: 9,
    text: "Go back 3 spaces.",
    effect: { type: "move_relative", steps: -3 },
  },
  {
    id: 10,
    text: "Go to Jail. Go directly to Jail. Do not pass Go, do not collect $200.",
    effect: { type: "go_to_jail" },
  },
  {
    id: 11,
    text: "Make general repairs on all your property. For each house pay $25, for each hotel pay $100.",
    effect: { type: "repairs", perHouse: 25, perHotel: 100 },
  },
  {
    id: 12,
    text: "Pay poor tax of $15.",
    effect: { type: "pay", amount: 15 },
  },
  {
    id: 13,
    text: "Take a ride on the Reading Railroad. If you pass Go, collect $200.",
    effect: { type: "move_to", spaceId: 5 },
  },
  {
    id: 14,
    text: "Take a walk on the Boardwalk. Advance token to Boardwalk.",
    effect: { type: "move_to", spaceId: 39 },
  },
  {
    id: 15,
    text: "You have been elected Chairman of the Board. Pay each player $50.",
    effect: { type: "pay_players", amount: 50 },
  },
  {
    id: 16,
    text: "Your building and loan matures. Collect $150.",
    effect: { type: "collect", amount: 150 },
  },
];

export const COMMUNITY_CHEST_CARDS: CardType[] = [
  {
    id: 1,
    text: "Advance to Go. Collect $200.",
    effect: { type: "move_to", spaceId: 0 },
  },
  {
    id: 2,
    text: "Bank error in your favor. Collect $200.",
    effect: { type: "collect", amount: 200 },
  },
  {
    id: 3,
    text: "Doctor's fees. Pay $50.",
    effect: { type: "pay", amount: 50 },
  },
  {
    id: 4,
    text: "From sale of stock you get $50.",
    effect: { type: "collect", amount: 50 },
  },
  {
    id: 5,
    text: "Get out of Jail Free. This card may be kept until needed or traded.",
    effect: { type: "get_out_of_jail" },
  },
  {
    id: 6,
    text: "Go to Jail. Go directly to Jail. Do not pass Go, do not collect $200.",
    effect: { type: "go_to_jail" },
  },
  {
    id: 7,
    text: "Grand Opera Night. Collect $50 from every player.",
    effect: { type: "collect_from_players", amount: 50 },
  },
  {
    id: 8,
    text: "Holiday fund matures. Receive $100.",
    effect: { type: "collect", amount: 100 },
  },
  {
    id: 9,
    text: "Income tax refund. Collect $20.",
    effect: { type: "collect", amount: 20 },
  },
  {
    id: 10,
    text: "It is your birthday. Collect $10 from every player.",
    effect: { type: "collect_from_players", amount: 10 },
  },
  {
    id: 11,
    text: "Life insurance matures. Collect $100.",
    effect: { type: "collect", amount: 100 },
  },
  {
    id: 12,
    text: "Pay hospital fees of $100.",
    effect: { type: "pay", amount: 100 },
  },
  {
    id: 13,
    text: "Pay school tax of $150.",
    effect: { type: "pay", amount: 150 },
  },
  {
    id: 14,
    text: "Receive $25 consultancy fee.",
    effect: { type: "collect", amount: 25 },
  },
  {
    id: 15,
    text: "You are assessed for street repairs. Pay $40 per house and $115 per hotel.",
    effect: { type: "repairs", perHouse: 40, perHotel: 115 },
  },
  {
    id: 16,
    text: "You have won second prize in a beauty contest. Collect $10.",
    effect: { type: "collect", amount: 10 },
  },
];
