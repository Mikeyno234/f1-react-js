import React, { useEffect, useState } from "react";
import "./ConstructorStandings.css";
import "../../assets/global.css";
import teamsService from "./../../apiServices/constructorsApi";
import Flag from "react-world-flags";
import Loader from "../../components/Loader/Loader";
import nationalityToCountryCode from "../../components/other/images";
import teamColorClass from "../../components/other/teamColorClass";
import teamLogo from "../../components/other/teamLogo";
import TeamBadge from "../../components/TeamBadge/TeamBadge";
import { loadDriverMedia, resolveTeamColor } from "../../apiServices/driverMedia";
import { Link } from "react-router-dom";

function DriverStandings() {
  const [drivers, setDrivers] = useState([]);
  const [media, setMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    teamsService
      .getAll()
      .then((data) => {
        //console.log("API Response:", data);
        const teamsList =
          data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
        setDrivers(teamsList);
        setIsLoading(false);
        document.title = "Constructor Standings";
      })
      .catch((error) => {
        console.error("Error fetching driver standings:", error);
        setIsLoading(false);
      });

    loadDriverMedia().then(setMedia);
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="div_ds">
          <div className="CS">Constructor Standings</div>
          <div className="standings-head">
            <span className="col-pos">#</span>
            <span className="col-driver">Team</span>
            <span className="col-team">&nbsp;</span>
            <span className="col-pts">Points</span>
          </div>
          <div className="standings">
            {drivers.map((team) => {
              return (
                <Link
                  to={`/constructor/${team.Constructor.constructorId}`}
                  key={team.Constructor.constructorId}
                >
                  {(() => {
                    const color = resolveTeamColor(media, team.Constructor);
                    return (
                      <div className="constructor_div">
                        <span
                          className={`team-color ${
                            teamColorClass[team.Constructor.name] || ""
                          }`}
                          style={color ? { background: color } : undefined}
                        />
                        <p className="position">{team.position}</p>
                        <div className="driver-cell">
                          <Flag
                            className="flag"
                            code={
                              nationalityToCountryCode[
                                team.Constructor.nationality
                              ]
                            }
                          />
                          <span className="team">{team.Constructor.name}</span>
                        </div>
                        <div className="team-cell">
                          <TeamBadge
                            logo={teamLogo[team.Constructor.name]}
                            color={color}
                            name={team.Constructor.name}
                          />
                        </div>
                        <p className="points">
                          {team.points}
                          <span className="pts-unit">PTS</span>
                        </p>
                      </div>
                    );
                  })()}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverStandings;
