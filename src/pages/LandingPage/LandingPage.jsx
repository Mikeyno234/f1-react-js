import React, { useEffect } from "react";
import "../../assets/global.css";
import RaceCountdown from "../../components/RaceCountDown/RaceCountDown";
import "./LandingPage.css";
import LastRaceResults from "../../components/LastRaceResults/LastRaceResults";

function LandingPage() {
  useEffect(() => {
    document.title = "F1 Hub";
  }, []);

  return (
    <div>
      <div className="landing-container">
        <section className="hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-inner">
            <span className="hero-eyebrow">Formula 1 // Live Season</span>
            <h1 className="hero-title">
              Every lap.<br />
              Every point.
            </h1>
            <p className="hero-sub">
              Standings, results and the countdown to lights out, in one place.
            </p>
          </div>
        </section>
        <RaceCountdown />
        <LastRaceResults />
      </div>
    </div>
  );
}

export default LandingPage;
