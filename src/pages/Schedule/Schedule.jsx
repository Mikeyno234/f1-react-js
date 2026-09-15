import React, { useEffect, useState } from "react";
import "./Schedule.css";
import "../../assets/global.css";
import { getRaces } from "../../apiServices/racesApi";
import Flag from "react-world-flags";
import countryCode from "../../components/other/countryCode";
import Loader from "../../components/Loader/Loader";

function Schedule() {
  const [races, setRaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Schedule";
    getRaces()
      .then((all) => {
        const now = new Date();
        const upcoming = all
          .filter((race) => new Date(`${race.date}T${race.time || "00:00:00Z"}`) >= now)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setRaces(upcoming);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching schedule:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="div_sch">
      <h1 className="sch">Next Races</h1>
      {isLoading ? (
        <Loader />
      ) : races.length === 0 ? (
        <p className="sch-empty">The season has wrapped up. See you next year.</p>
      ) : (
        <ul className="sch-list">
          {races.map((race) => {
            const date = new Date(
              `${race.date}T${race.time || "00:00:00Z"}`
            );
            return (
              <li className="sch-item" key={race.round}>
                <div className="sch-round">R{race.round}</div>
                <div className="sch-main">
                  <p className="sch-name">{race.raceName}</p>
                  <p className="sch-circuit">{race.Circuit.circuitName}</p>
                  <p className="sch-loc">
                    <Flag
                      className="race-flag"
                      code={countryCode(race.Circuit.Location.country)}
                    />
                    {race.Circuit.Location.locality},{" "}
                    {race.Circuit.Location.country}
                  </p>
                </div>
                <div className="sch-date">
                  <span className="sch-day">
                    {date.toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                  <span className="sch-time">
                    {date.toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Schedule;
