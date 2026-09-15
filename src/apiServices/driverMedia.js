import axios from "axios";

/**
 * Driver & team media resolved dynamically from OpenF1.
 *
 * Why this is season-agnostic: instead of hardcoding a season or relying on
 * `session_key=latest` (which can lag during the off-season), we look up the
 * sessions for the CURRENT calendar year and pick the most recent session that
 * has already started. When the year rolls over to 2027, 2028, ... this picks
 * up the new grid automatically with no code change.
 */
const OPENF1 = "https://api.openf1.org/v1";
const CACHE_KEY = "f1hub:driverMedia";
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

let memory = null;
let inflight = null;

const normalize = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z]/g, "");

/** Resolve the session_key whose driver line-up we should display. */
const resolveSessionKey = async () => {
  const year = new Date().getFullYear();

  // Try the current year first, then the previous one (covers early January
  // and the winter break before the new season starts).
  for (const y of [year, year - 1]) {
    try {
      const { data } = await axios.get(`${OPENF1}/sessions`, {
        params: { year: y },
      });
      if (!Array.isArray(data) || data.length === 0) continue;

      const now = Date.now();
      const started = data
        .filter((s) => s.date_start && new Date(s.date_start).getTime() <= now)
        .sort(
          (a, b) => new Date(b.date_start) - new Date(a.date_start)
        );

      // Most recent session that already happened, else the first of the year
      // (pre-season: shows the upcoming grid as soon as it is published).
      const chosen = started[0] || data[0];
      if (chosen?.session_key) return chosen.session_key;
    } catch (err) {
      // try the next year
    }
  }

  return "latest"; // last resort, OpenF1 understands this literal
};

const buildIndex = (drivers) => {
  const byLast = {};
  const byAcronym = {};
  const byNumber = {};
  const byTeam = {};

  drivers.forEach((d) => {
    const entry = {
      headshot: d.headshot_url || null,
      color: d.team_colour ? `#${d.team_colour}` : null,
      acronym: d.name_acronym || null,
      number: d.driver_number != null ? String(d.driver_number) : null,
      team: d.team_name || null,
    };

    if (d.last_name) byLast[normalize(d.last_name)] = entry;
    if (d.full_name) {
      const last = d.full_name.trim().split(/\s+/).pop();
      byLast[normalize(last)] = entry;
    }
    if (d.name_acronym) byAcronym[d.name_acronym.toUpperCase()] = entry;
    if (d.driver_number != null) byNumber[String(d.driver_number)] = entry;
    if (d.team_name && entry.color) byTeam[normalize(d.team_name)] = entry.color;
  });

  return { byLast, byAcronym, byNumber, byTeam };
};

const readCache = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.at > CACHE_TTL) return null;
    return parsed.index;
  } catch {
    return null;
  }
};

const writeCache = (index) => {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ at: Date.now(), index })
    );
  } catch {
    // storage unavailable / full: not fatal
  }
};

/** Fetch and cache the driver media index. Safe to call repeatedly. */
export const loadDriverMedia = async () => {
  if (memory) return memory;
  if (inflight) return inflight;

  const cached = readCache();
  if (cached) {
    memory = cached;
    return memory;
  }

  inflight = (async () => {
    try {
      const sessionKey = await resolveSessionKey();
      const { data } = await axios.get(`${OPENF1}/drivers`, {
        params: { session_key: sessionKey },
      });
      memory = buildIndex(Array.isArray(data) ? data : []);
      writeCache(memory);
    } catch (err) {
      console.error("Error loading driver media (OpenF1):", err);
      memory = { byLast: {}, byAcronym: {}, byNumber: {}, byTeam: {} };
    } finally {
      inflight = null;
    }
    return memory;
  })();

  return inflight;
};

/** Resolve media for a Jolpica `Driver` object. */
export const resolveDriverMedia = (index, driver) => {
  if (!index || !driver) return null;
  return (
    index.byLast?.[normalize(driver.familyName)] ||
    (driver.code && index.byAcronym?.[driver.code.toUpperCase()]) ||
    (driver.permanentNumber &&
      index.byNumber?.[String(driver.permanentNumber)]) ||
    null
  );
};

/** Resolve a live team colour for a Jolpica `Constructor` object. */
export const resolveTeamColor = (index, constructor) => {
  if (!index || !constructor) return null;
  const name = normalize(constructor.name);
  if (index.byTeam?.[name]) return index.byTeam[name];

  // OpenF1 and Jolpica name teams slightly differently
  // ("Red Bull" vs "Red Bull Racing", "RB F1 Team" vs "Racing Bulls").
  const keys = Object.keys(index.byTeam || {});
  const partial = keys.find((k) => k.includes(name) || name.includes(k));
  return partial ? index.byTeam[partial] : null;
};
