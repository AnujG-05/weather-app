import React, { useEffect, useMemo, useState } from "react";
import styled, { ThemeProvider, keyframes, css } from "styled-components";
import axios from "axios";
import { lightTheme, darkTheme } from "./theme";


/* 🔑 OpenWeather API Key */
const API_KEY = "1e9a698e6246ebd0a25c0910a9c86ec9";

/* ------------------ Animations ------------------ */
const floatClouds = keyframes`
  0% { transform: translateX(-10px) translateY(0); opacity: .8; }
  50% { transform: translateX(10px) translateY(-6px); opacity: 1; }
  100% { transform: translateX(-10px) translateY(0); opacity: .8; }
`;
const fadeUp = keyframes`
  from { opacity:0; transform: translateY(12px); }
  to { opacity:1; transform: translateY(0); }
`;
const pulse = keyframes`
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.06); }
`;

/* ------------------ Styled Shell ------------------ */
const Shell = styled.div`
  min-height: 100vh;
  font-family: "Montserrat", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.bg};
  transition: background .6s ease;
  display: grid;
  grid-template-rows: auto 1fr auto;
`;

/* Floating decorative clouds background */
const Clouds = styled.div`
  position: fixed; inset: 0; pointer-events: none; overflow: hidden;
  &::before, &::after{
    content:""; position:absolute; width:40vmax; height:20vmax; filter: blur(40px);
    background: radial-gradient(closest-side, rgba(255,255,255,.35), transparent 70%);
    border-radius:999px; animation: ${floatClouds} 9s ease-in-out infinite;
  }
  &::after{ top: 55%; left: 60%; animation-duration: 12s;}
  &::before{ top: 10%; left: 10%;}
`;

const Header = styled.header`
  display:flex; align-items:center; justify-content:center;
  gap:16px; padding:28px 16px 14px;
  animation:${fadeUp} .6s ease both;

  h1{
    font-weight:800; font-size: clamp(28px, 4vw, 46px); letter-spacing:.5px;
    background: linear-gradient(90deg, #fff, #fde68a, #fb7185, #93c5fd);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    text-shadow: 0 1px 0 rgba(0,0,0,.04);
  }
  span.logo{ font-size:clamp(22px,3vw,32px) }
`;

const Toolbar = styled.div`
  display:flex; flex-wrap:wrap; gap:12px; justify-content:center; padding:6px 16px 28px;
`;

const SearchForm = styled.form`
  display:flex; border-radius:14px; overflow:hidden; box-shadow:${({theme})=>theme.glassShadow};
  backdrop-filter: blur(8px);
  border: 1px solid ${({theme})=>theme.cardBorder};
  background: ${({theme})=>theme.cardBg};

  input{
    border:0; outline:0; padding:14px 16px; min-width:280px; font-size:16px;
    background: transparent; color: inherit;
  }
`;

const Btn = styled.button`
  border:0; outline:0; cursor:pointer; font-weight:700; letter-spacing:.3px;
  padding:14px 18px; transition: transform .2s ease, box-shadow .2s ease, background .3s ease;
  background: ${({theme})=>theme.buttonBg}; color:${({theme})=>theme.buttonText};
  ${({ghost, theme}) => ghost && css`
    background: transparent; border:1px solid ${theme.cardBorder}; color: ${theme.text};
  `}
  &:hover{ transform: translateY(-1px) scale(1.03); box-shadow:0 8px 22px rgba(0,0,0,.18) }
  &:active{ transform: translateY(0) scale(.98) }
  &.pulse{ animation:${pulse} 2.2s infinite }
`;

const SectionTitle = styled.h2`
  margin: 22px auto 12px; text-align:center; font-size: clamp(18px,2.4vw,26px);
  font-weight:800; letter-spacing:.4px; animation:${fadeUp} .5s ease both;
  span { opacity:.8; font-weight:700; }
`;

const Grid = styled.div`
  width:min(1200px, 92%); margin: 0 auto 32px;
  display:grid; gap:18px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

const Card = styled.div`
  position:relative;
  background:${({theme})=>theme.cardBg};
  border:1px solid ${({theme})=>theme.cardBorder};
  box-shadow:${({theme})=>theme.glassShadow};
  backdrop-filter: blur(10px);
  border-radius: 18px; padding: 18px 16px;
  display:grid; gap:10px; place-items:center; text-align:center;
  transform: translateZ(0); animation:${fadeUp} .5s ease both;

  &:hover{ transform: translateY(-4px) }
  .city{ font-weight:800; font-size: 18px }
  .meta{ color:${({theme})=>theme.subText}; font-size:13px }
  .big{ font-size: 36px; font-weight:800 }
  .icon{ animation:${floatClouds} 6s ease-in-out infinite }
  .time{ font-weight:700; font-size: 13px; opacity:.9 }
  .chip{
    position:absolute; top:10px; right:10px;
    font-size:12px; padding:4px 8px; border-radius:999px;
    background: linear-gradient(90deg,#22d3ee,#60a5fa);
    color:white; box-shadow: 0 6px 18px rgba(2,132,199,.35);
  }
`;

/* Loading skeletons */
const Skeleton = styled.div`
  height: 180px; border-radius: 18px;
  background: linear-gradient(90deg, rgba(255,255,255,.15), rgba(255,255,255,.35), rgba(255,255,255,.15));
  animation: shimmer 1.2s infinite linear; border:1px solid rgba(255,255,255,.25);
  @keyframes shimmer { 0%{background-position:-200px 0} 100%{background-position:200px 0} }
`;

const Footer = styled.footer`
  padding: 16px; text-align:center; opacity:.75; font-size:12px;
`;

/* ------------------ Hooks ------------------ */
// City clock that ticks every second (24h format using timezone offset)
const useCityClock = (timezoneOffsetSeconds) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return useMemo(() => {
    if (timezoneOffsetSeconds == null) return "";
    const ms = now + timezoneOffsetSeconds * 1000 - new Date().getTimezoneOffset() * 60 * 1000;
    return new Date(ms).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }, [now, timezoneOffsetSeconds]);
};

/* ------------------ Main ------------------ */
export default function App() {
  const [themeDark, setThemeDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Store up to 30, paginate 8 per page; main shows only current page
  const [recent, setRecent] = useState(() => {
    const saved = localStorage.getItem("recentCities");
    return saved ? JSON.parse(saved) : [];
  });
  const [page, setPage] = useState(1);
  const perPage = 8;
  const totalPages = Math.max(1, Math.ceil(recent.length / perPage));
  const slice = recent.slice((page - 1) * perPage, page * perPage);

  useEffect(() => localStorage.setItem("theme", themeDark ? "dark" : "light"), [themeDark]);
  useEffect(() => localStorage.setItem("recentCities", JSON.stringify(recent)), [recent]);

  const searchCity = async (name) => {
    try {
      setLoading(true); setError("");
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(name)}&appid=${API_KEY}&units=metric`
      );
      setDetail(data);   // open detail screen
    } catch (e) {
      setError("City not found or API limit reached.");
    } finally {
      setLoading(false);
    }
  };

  const addToRecentAndBack = () => {
    if (!detail) return;
    setRecent((prev) => {
      const dedup = prev.filter((c) => c.id !== detail.id);
      return [detail, ...dedup].slice(0, 30);
    });
    setDetail(null);
    setPage(1);
  };

  const removeFromRecent = (id) => {
    setRecent((prev) => prev.filter((c) => c.id !== id));
  };

  /* ------------- UI ------------- */
  return (
    <ThemeProvider theme={themeDark ? darkTheme : lightTheme}>
      <Shell>
        <Clouds />

        {/* Header */}
        <Header>
          <span className="logo">🌍</span>
          <h1>SkyCast&nbsp;Edge</h1>
        </Header>

        {/* Toolbar: search + theme toggle */}
        <Toolbar>
          <SearchForm
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) searchCity(query.trim());
              setQuery("");
            }}
            aria-label="Search city weather"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter city…"
            />
            <Btn type="submit" className="pulse">Search</Btn>
          </SearchForm>

          <Btn ghost onClick={() => setThemeDark((v) => !v)}>
            {themeDark ? "☀ Light Mode" : "🌙 Dark Mode"}
          </Btn>
        </Toolbar>

        {/* Detail view */}
        {detail ? (
          <DetailView
            data={detail}
            onBack={addToRecentAndBack}
          />
        ) : (
          <>
            <SectionTitle>
              <span>Recently Visited</span>
            </SectionTitle>

            {/* Loading + Error */}
            {loading && (
              <Grid>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} />
                ))}
              </Grid>
            )}
            {error && (
              <p style={{ textAlign: "center", marginBottom: 16, fontWeight: 700 }}>
                ❌ {error}
              </p>
            )}

            {/* Grid */}
            {!loading && (
              <Grid>
                {slice.map((c) => (
                  <WeatherCard
                    key={c.id}
                    data={c}
                    onOpen={() => setDetail(c)}
                    onRemove={() => removeFromRecent(c.id)}
                  />
                ))}
                {/* Fill empty cells to avoid huge blank edges on large screens */}
                {slice.length === 0 && recent.length === 0 && (
                  <EmptyState />
                )}
              </Grid>
            )}

            {/* Pagination */}
            {recent.length > perPage && (
              <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "10px 0 26px" }}>
                <Btn ghost onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>◀ Prev</Btn>
                <span style={{ alignSelf: "center", fontWeight: 700 }}>
                  Page {page} / {totalPages}
                </span>
                <Btn ghost onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next ▶</Btn>
              </div>
            )}
          </>
        )}

        <Footer>Made with ❤️ by Anuj using React</Footer>
      </Shell>
    </ThemeProvider>
  );
}

/* ------------------ Components in the same file to keep total file count small ------------------ */
function WeatherCard({ data, onOpen, onRemove }) {
  const time = useCityClock(data.timezone);
  const icon = data.weather?.[0]?.icon;
  const desc = data.weather?.[0]?.description ?? "";

  return (
    <Card role="button" onClick={onOpen} title="Open details">
      <div className="chip">{time}</div>
      <img
        className="icon"
        alt={desc}
        width="84"
        height="84"
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      />
      <div className="city">
        {data.name}, {data.sys?.country}
      </div>
      <div className="big">{Math.round(data.main?.temp)}°C</div>
      <div className="meta">{desc}</div>

      <Btn
        ghost
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        style={{ marginTop: 6 }}
      >
        Remove
      </Btn>
    </Card>
  );
}

function DetailView({ data, onBack }) {
  const time = useCityClock(data.timezone);
  const icon = data.weather?.[0]?.icon;
  const desc = data.weather?.[0]?.description ?? "";

  return (
    <div style={{ width: "min(1100px, 94%)", margin: "0 auto 28px" }}>
      <SectionTitle>
        Details for <span>{data.name}, {data.sys?.country}</span>
      </SectionTitle>

      <Grid style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
        <Card style={{ gridColumn: "1/-1" }}>
          <img
            className="icon"
            alt={desc}
            width="110"
            height="110"
            src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
          />
          <div className="city" style={{ fontSize: 22 }}>
            {data.name}, {data.sys?.country}
          </div>
          <div className="big">{Math.round(data.main?.temp)}°C</div>
          <div className="meta" style={{ textTransform: "capitalize" }}>{desc}</div>
          <div className="time">🕒 Local time: {time}</div>
          <div className="meta">💧 {data.main?.humidity}% • 🌬 {data.wind?.speed} m/s • 🎯 {data.main?.pressure} hPa</div>
          <div className="meta">
            🕘 Sunrise: {formatUnix(data.sys?.sunrise, data.timezone)} &nbsp;|&nbsp;
            🌇 Sunset: {formatUnix(data.sys?.sunset, data.timezone)}
          </div>

          <Btn className="pulse" onClick={onBack} style={{ marginTop: 8 }}>
            ⬅ Back (Add to Recently)
          </Btn>
        </Card>

        {/* Mini facts cards */}
        <Card><div className="city">Feels Like</div><div className="big">{Math.round(data.main?.feels_like)}°C</div></Card>
        <Card><div className="city">Min / Max</div><div className="big">{Math.round(data.main?.temp_min)}° / {Math.round(data.main?.temp_max)}°</div></Card>
        <Card><div className="city">Visibility</div><div className="big">{(data.visibility/1000).toFixed(1)} km</div></Card>
      </Grid>
    </div>
  );
}

function EmptyState() {
  return (
    <Card style={{ gridColumn: "1/-1", padding: "22px 18px" }}>
      <img className="icon" width="84" height="84" alt="clouds" src="https://openweathermap.org/img/wn/03d@2x.png" />
    </Card>
  );
}