import React, { useEffect, useState } from "react";
import "./DriverStandings.css";
import "../../assets/global.css";
import driversService from "./../../apiServices/testapi";
import Flag from "react-world-flags";
import Loader from "../../components/Loader/Loader";
import nationalityToCountryCode from "../../components/other/images";
import teamLogo from "../../components/other/teamLogo";
import teamColorClass from "../../components/other/teamColorClass";
import driversImage from "../../components/other/driversImage";
import DriverAvatar from "../../components/DriverAvatar/DriverAvatar";
import TeamBadge from "../../components/TeamBadge/TeamBadge";
import { loadDriverMedia, resolveDriverMedia } from "../../apiServices/driverMedia";
import { Link } from "react-router-dom";

function DriverStandings() {
  const [drivers, setDrivers] = useState([]);
  const [media, setMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    driversService
      .getDriverStandings()
      .then((data) => {
        const driversList =
          data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        setDrivers(driversList);
        setIsLoading(false);
        document.title = "Driver Standings";
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
          <div className="DS">Driver Standings</div>
          <div className="standings-head">
            <span className="col-pos">#</span>
            <span className="col-driver">Driver</span>
            <span className="col-team">Team</span>
            <span className="col-pts">Points</span>
          </div>
          <div className="standings">
            {drivers.map((driver) => (
              <Link
                to={`/driver/${driver.Driver.driverId}`}
                key={driver.Driver.driverId}
              >
                {(() => {
                  const dm = resolveDriverMedia(media, driver.Driver);
                  return (
                    <div className="driver_div">
                      <span
                        className={`team-color ${
                          teamColorClass[driver.Constructors[0].name] || ""
                        }`}
                        style={dm?.color ? { background: dm.color } : undefined}
                      />
                      <p className="position">{driver.position}</p>
                      <div className="driver-cell">
                        <DriverAvatar
                          className="driver-face"
                          src={dm?.headshot}
                          localSrc={driversImage[driver.Driver.driverId]}
                          name={`${driver.Driver.givenName} ${driver.Driver.familyName}`}
                        />
                        <Flag
                          className="flag"
                          code={
                            nationalityToCountryCode[driver.Driver.nationality]
                          }
                        />
                        <span className="driver-given">
                          {driver.Driver.givenName}
                        </span>
                        <span className="driver">
                          {driver.Driver.familyName}
                        </span>
                      </div>
                      <div className="team-cell">
                        <TeamBadge
                          logo={teamLogo[driver.Constructors[0].name]}
                          color={dm?.color}
                          name={driver.Constructors[0].name}
                        />
                        <span className="team-name">
                          {driver.Constructors[0].name}
                        </span>
                      </div>
                      <p className="points">
                        {driver.points}
                        <span className="pts-unit">PTS</span>
                      </p>
                    </div>
                  );
                })()}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverStandings;
