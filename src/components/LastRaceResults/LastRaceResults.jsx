// LastRaceResults.jsx

import React, { useEffect, useState } from "react";
import { getLastRaceResults, getRaceInfo } from "../../apiServices/racesApi";
import Loader from "../Loader/Loader";
import driverImages from "../../components/other/driversImage";
import teamLogo from "../../components/other/teamLogo";
import DriverAvatar from "../DriverAvatar/DriverAvatar";
import TeamBadge from "../TeamBadge/TeamBadge";
import { loadDriverMedia, resolveDriverMedia } from "../../apiServices/driverMedia";
import "./LastRaceResults.css"; // Importa el archivo CSS
import { Link } from "react-router-dom";

function LastRaceResults() {
  const [results, setResults] = useState([]);
  const [raceInfo, setRaceInfo] = useState(null);
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const raceInfo = await getRaceInfo();
        const fetchedResults = await getLastRaceResults();
        setResults(fetchedResults);
        setRaceInfo(raceInfo);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching last race results:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchResults();
    loadDriverMedia().then(setMedia);
  }, []);
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  if (!results.length) {
    return null;
  }

  const topThree = results.slice(0, 3);
  const otherResults = results.slice(3);
  const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd for a real podium shape

  const DriverFace = ({ result, className }) => {
    const dm = resolveDriverMedia(media, result.Driver);
    return (
      <DriverAvatar
        className={className}
        src={dm?.headshot}
        localSrc={driverImages[result.Driver.driverId]}
        name={`${result.Driver.givenName} ${result.Driver.familyName}`}
      />
    );
  };

  return (
    <div className="last-race-results">
      <div className="lrr-head">
        <span className="lrr-eyebrow">Latest Result</span>
        <h2>{raceInfo?.raceName || raceInfo?.Circuit?.circuitName}</h2>
      </div>

      <div className="top-three-container">
        {podiumOrder
          .filter((i) => topThree[i])
          .map((i) => {
            const result = topThree[i];
            return (
              <div key={i} className={`top-three-item position-${i + 1}`}>
                <Link to={`/driver/${result.Driver.driverId}`}>
                  <span className="podium-rank">{i + 1}</span>
                  <DriverFace result={result} className="driver-image" />
                  <div className="driver-info">
                    <p className="driver-name">
                      {result.Driver.givenName} {result.Driver.familyName}
                    </p>
                    <p className="driver-team">{result.Constructor.name}</p>
                    <p className="driver-time">
                      {result.Time?.time || result.status}
                    </p>
                    <p className="driver-points">{result.points} PTS</p>
                  </div>
                </Link>
              </div>
            );
          })}
      </div>

      <ul className="results-list">
        {otherResults.map((result) => (
          <Link
            to={`/driver/${result.Driver.driverId}`}
            key={result.Driver.driverId}
          >
            <li className="result-item">
              <div className="result-position">{result.position}</div>
              <div className="result-driver">
                <DriverFace result={result} className="result-face" />
                <span className="driver-name-span">
                  {result.Driver.givenName} {result.Driver.familyName}
                </span>
              </div>
              <div className="result-constructor">
                <TeamBadge
                  className="team-logo-results"
                  logo={teamLogo[result.Constructor.name]}
                  color={resolveDriverMedia(media, result.Driver)?.color}
                  name={result.Constructor.name}
                />
              </div>
              <div className="result-time">
                {result.Time?.time || result.status}
              </div>
              <div className="result-points">{result.points} PTS</div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default LastRaceResults;
