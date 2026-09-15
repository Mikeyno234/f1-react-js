import React, { useEffect, useState } from "react";
import "./RaceCountDown.css";
import Loader from "../Loader/Loader";
import { getRaces } from "../../apiServices/racesApi";

// Safely build a Date from an Ergast race, whether or not a time is present.
const raceStart = (race) =>
  new Date(`${race.date}T${race.time || "00:00:00Z"}`);

const RaceCountdown = () => {
  const [nextRace, setNextRace] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({});

  useEffect(() => {
    const fetchNextRace = async () => {
      try {
        const races = await getRaces();
        const upcomingRace = races.find(
          (race) => raceStart(race) > new Date()
        );
        setNextRace(upcomingRace || null);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNextRace();
  }, []);

  useEffect(() => {
    if (!nextRace) return;

    const interval = setInterval(() => {
      const raceDate = raceStart(nextRace);
      const now = new Date();
      const timeDiff = raceDate - now;

      if (timeDiff <= 0) {
        setTimeRemaining({ done: true });
        clearInterval(interval);
      } else {
        setTimeRemaining({
          days: Math.floor(timeDiff / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((timeDiff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextRace]);

  const timeParts = [
    { label: "Days", value: timeRemaining.days },
    { label: "Hrs", value: timeRemaining.hours },
    { label: "Min", value: timeRemaining.minutes },
    { label: "Sec", value: timeRemaining.seconds },
  ];

  return (
    <div className="countdown-container">
      {nextRace ? (
        <div className="countdown-content">
          <span className="countdown-eyebrow">Next Grand Prix</span>
          <h1 className="NR">{nextRace.raceName}</h1>
          <p className="raceC">
            {nextRace.Circuit?.Location?.locality},{" "}
            {nextRace.Circuit?.Location?.country}
          </p>
          {timeRemaining.done ? (
            <h2 className="h2RC">Lights out</h2>
          ) : (
            <div className="countdown-clock">
              {timeParts.map((part) => (
                <div className="countdown-unit" key={part.label}>
                  <span className="countdown-value">
                    {String(part.value ?? 0).padStart(2, "0")}
                  </span>
                  <span className="countdown-label">{part.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default RaceCountdown;
