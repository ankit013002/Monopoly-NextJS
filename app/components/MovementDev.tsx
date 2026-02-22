import { PlayerType } from "../types/PlayerType";
import { roll2d6 } from "../utils/Movement";

interface MovementDevProps {
  selectedToken: PlayerType | undefined;
  playerTurn: (socketId: string, steps: number) => Promise<null | undefined>;
  moveTokenSteps: (socketId: string, steps: number) => Promise<number>;
  lastRoll: { d1: number; d2: number; total: number } | null;
  setLastRoll: React.Dispatch<
    React.SetStateAction<{ d1: number; d2: number; total: number } | null>
  >;
  isMoving: boolean;
}

const MovementDev = ({
  selectedToken,
  playerTurn,
  moveTokenSteps,
  lastRoll,
  setLastRoll,
  isMoving,
}: MovementDevProps) => {
  function stepSelected() {
    if (!selectedToken) return;
    void playerTurn(selectedToken.socketId, 1);
  }

  function rollAndMoveSelected() {
    if (!selectedToken) return;
    const steps = roll2d6();
    setLastRoll(steps);
    void playerTurn(selectedToken.socketId, steps.total);
  }

  function moveByLastRoll() {
    if (!selectedToken || !lastRoll) return;
    void moveTokenSteps(selectedToken.socketId, lastRoll.total);
  }

  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      <button
        className="rounded-md bg-black text-white px-3 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
        onClick={rollAndMoveSelected}
        disabled={!selectedToken || isMoving}
      >
        Roll + Move
      </button>
      <button
        className="rounded-md border border-black/30 bg-white px-3 py-2 text-sm font-semibold hover:bg-black/5 disabled:opacity-60"
        onClick={moveByLastRoll}
        disabled={!selectedToken || !lastRoll || isMoving}
      >
        Move Last Roll
      </button>

      <button
        className="rounded-md border border-black/30 bg-white px-3 py-2 text-sm font-semibold hover:bg-black/5 disabled:opacity-60"
        onClick={stepSelected}
        disabled={!selectedToken || isMoving}
      >
        Step + 1
      </button>
    </div>
  );
};

export default MovementDev;
