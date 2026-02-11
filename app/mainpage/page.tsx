"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

const Mainpage = () => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);

  const handleSubmit = () => {
    redirect(`/gamepage?players=${numberOfPlayers}`);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col gap-5">
        <div className="text-center font-black tracking-[0.35em] text-xl md:text-3xl">
          MONOPOLY
        </div>
        <select
          onChange={(e) => setNumberOfPlayers(parseInt(e.target.value))}
          defaultValue="Number of Players"
          className="select"
        >
          <option disabled={true}>Number of Players</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
        <button onClick={() => handleSubmit()} className="btn btn-ghost">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Mainpage;
