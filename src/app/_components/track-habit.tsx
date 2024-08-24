"use client";

import { useState } from "react";
import { ConfettiSideCannons } from "@/components/ui/confetti-button-side";
import { Calendar } from "@/components/ui/calendar";

function TrackHabit() {
  const [isHabitTracked, setIsHabitTracked] = useState(false);
  return (
    <div className="flex flex-col md:items-end">
      <div className="flex flex-col items-center justify-center">
        <ConfettiSideCannons
          disabled={isHabitTracked}
          handleClick={() => {
            setIsHabitTracked(true);
          }}
        >
          {isHabitTracked
            ? "You completed this habit today!"
            : "Complete habit!"}
        </ConfettiSideCannons>
        <Calendar selected={[isHabitTracked && new Date()]} />
      </div>
    </div>
  );
}

export default TrackHabit;
