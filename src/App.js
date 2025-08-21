import React, { useEffect, useMemo, useState } from "react";
import styled, { ThemeProvider, keyframes, css } from "styled-components";
import axios from "axios";
import { lightTheme, darkTheme } from "./theme";

/* 🔑 OpenWeather API Key */
const API_KEY = "1e9a698e6246ebd0a25c0910a9c86ec9";

/* ------------------ Animations ------------------ */
const floatClouds = keyframes`
  0% { transform: translateX(-8px) translateY(0) scale(1); opacity: .85; }
  50% { transform: translateX(8px) translateY(-5px) scale(1.05); opacity: 1; }
  100% { transform: translateX(-8px) translateY(0) scale(1); opacity: .85; }
`;

const fadeUp = keyframes`
  from { opacity:0; transform: translateY(20px) scale(0.95); }
  to { opacity:1; transform: translateY(0) scale(1); }
`;

const pulse = keyframes`
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const staggerFade = keyframes`
  from { opacity:0; transform: scale(0.9) translateY(10px); }
  to { opacity:1; transform: scale(1) translateY(0); }
`;

const zoomPulse = keyframes`
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.08); }
`;

/* ------------------ Styled Components ------------------ */
const Shell = styled.div`
  min-height: 100vh;
  font-family: "Montserrat", system-ui, sans-serif;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.bg};
  transition: background .6s ease;
  display: grid;
  grid-template-rows: auto 1fr auto;
`;

const Clouds = styled.div`
  position: fixed; inset: 0; pointer-events: none; overflow: hidden;
  &::before,&::after{
    content:""; position:absolute; width:40vmax; height:20vmax; filter: blur(40px);
    background: radial-gradient(closest-side, rgba(255,255,255,.3), transparent 70%);
    border-radius:999px; animation: ${floatClouds} 12s ease-in-out infinite;
  }
  &::after{ top: 55%; left: 65%; animation-duration: 15s;}
  &::before{ top: 10%; left: 10%; }
`;

const Header = styled.header`
  display:flex; align-items:center; justify-content:center;
  gap:16px; padding:28px 16px 14px;
  animation:${fadeUp} .6s ease both;

  h1{
    font-weight:800; font-size: clamp(28px, 4vw, 46px); letter-spacing:.5px;
    background: linear-gradient(90deg, #22d3ee, #3b82f6, #a855f7, #ec4899);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    animation: ${zoomPulse} 3s ease-in-out infinite;
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
  max-width: 420px;
  width: 100%;

  input{
    border:0; outline:0; padding:12px 14px; font-size:15px;
    flex:1;
    background: transparent; color: inherit;
  }
`;

const Btn = styled.button`
  border:0; outline:0; cursor:pointer; font-weight:700; letter-spacing:.3px;
  padding:12px 16px; transition: transform .2s ease, box-shadow .2s ease, background .3s ease;
  background: ${({theme})=>theme.buttonBg}; color:${({theme})=>theme.buttonText};
  ${({ghost, theme}) => ghost && css`
    background: transparent; border:1px solid ${theme.cardBorder}; color: ${theme.text};
  `}
  &:hover{ transform: translateY(-1px) scale(1.03); box-shadow:0 8px 22px rgba(0,0,0,.18) }
  &:active{ transform: translateY(0) scale(.98) }
  &.pulse{ animation:${pulse} 2.2s infinite }
`;

/* 🌙 Toggle Switch for Dark/Light */
const ToggleWrapper = styled.div`
  position: relative;
  width: 70px; height: 36px;
  border-radius: 30px;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  box-shadow: ${({ theme }) => theme.glassShadow};
  cursor: pointer;
  display: flex; align-items: center; padding: 4px;
  transition: background .4s ease;
`;

const ToggleCircle = styled.div`
  width: 28px; height: 28px;
  border-radius: 50%;
  background: ${({ dark }) => dark ? "#facc15" : "#0ea5e9"};
  box-shadow: 0 4px 10px rgba(0,0,0,.25);
  transition: transform .4s cubic-bezier(.4,0,.2,1), background .3s;
  transform: ${({ dark }) => dark ? "translateX(34px)" : "translateX(0)"};
  display:flex; align-items:center; justify-content:center;
  font-size: 16px;
`;

/* ------------------ Sections ------------------ */
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
  transform: translateZ(0); animation:${staggerFade} .6s ease both;
  animation-delay: ${({delay}) => delay || "0ms"};
  transition: all .25s ease;

  &:hover{ 
    transform: perspective(600px) rotateX(6deg) rotateY(6deg) scale(1.03);
    box-shadow: 0 12px 28px rgba(0,0,0,.25);
  }

  .city{ font-weight:800; font-size: clamp(16px,3.5vw,18px) }
  .meta{ font-size: clamp(12px,3vw,14px); color:${({theme})=>theme.subText}; }
  .big{ font-size: clamp(28px,6vw,36px); font-weight:800 }
  .icon{ animation:${floatClouds} 6s ease-in-out infinite; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3)); }
  .time{ font-weight:700; font-size: 13px; opacity:.9 }
  .chip{
    position:absolute; top:10px; right:10px;
    font-size:12px; padding:4px 8px; border-radius:999px;
    background: linear-gradient(90deg,#22d3ee,#60a5fa);
    color:white; box-shadow: 0 6px 18px rgba(2,132,199,.35);
  }
`;

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
      setDetail(data);
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

  return (
    <ThemeProvider theme={themeDark ? darkTheme : lightTheme}>
      <Shell>
        <Clouds />

        <Header>
          <span className="logo">🌍</span>
          <h1>SkyCast Edge</h1>
        </Header>

        <Toolbar>
          <SearchForm
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) searchCity(query.trim());
              setQuery("");
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter city…"
            />
            <Btn type="submit" className="pulse">Search</Btn>
          </SearchForm>

          {/* 🌙 Animated Toggle */}
          <ToggleWrapper onClick={() => setThemeDark(v => !v)}>
            <ToggleCircle dark={themeDark}>
              {themeDark ? "☀" : "🌙"}
            </ToggleCircle>
          </ToggleWrapper>
        </Toolbar>

        {detail ? (
          <DetailView data={detail} onBack={addToRecentAndBack} />
        ) : (
          <>
            <SectionTitle><span>Recently Visited</span></SectionTitle>

            {loading && (
              <Grid>
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
              </Grid>
            )}
            {error && (
              <p style={{ textAlign: "center", marginBottom: 16, fontWeight: 700 }}>
                ❌ {error}
              </p>
            )}

            {!loading && (
              <Grid>
                {slice.map((c, i) => (
                  <WeatherCard
                    key={c.id}
                    data={c}
                    delay={`${i * 80}ms`}
                    onOpen={() => setDetail(c)}
                    onRemove={() => removeFromRecent(c.id)}
                  />
                ))}
                {slice.length===0 && recent.length===0 && <EmptyState/>}
              </Grid>
            )}

            {recent.length > perPage && (
              <div style={{ display:"flex", gap:10, justifyContent:"center", margin:"10px 0 26px" }}>
                <Btn ghost onClick={() => setPage((p)=>Math.max(1,p-1))} disabled={page===1}>◀ Prev</Btn>
                <span style={{ alignSelf:"center", fontWeight:700 }}>Page {page} / {totalPages}</span>
                <Btn ghost onClick={() => setPage((p)=>Math.min(totalPages,p+1))} disabled={page===totalPages}>Next ▶</Btn>
              </div>
            )}
          </>
        )}

        <Footer>Made with ❤️ by Anuj using React</Footer>
      </Shell>
    </ThemeProvider>
  );
}

/* ------------------ Components ------------------ */
function WeatherCard({ data, onOpen, onRemove, delay }) {
  const time = useCityClock(data.timezone);
  const icon = data.weather?.[0]?.icon;
  const desc = data.weather?.[0]?.description ?? "";

  return (
    <Card role="button" onClick={onOpen} delay={delay}>
      <div className="chip">{time}</div>
      <img className="icon" alt={desc} width="80" height="80"
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />
      <div className="city">{data.name}, {data.sys?.country}</div>
      <div className="big">{Math.round(data.main?.temp)}°C</div>
      <div className="meta">{desc}</div>

      <Btn ghost onClick={(e)=>{e.stopPropagation(); onRemove();}} style={{marginTop:6}}>
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
    <div style={{ width:"min(1100px,94%)", margin:"0 auto 28px" }}>
      <SectionTitle>Details for <span>{data.name}, {data.sys?.country}</span></SectionTitle>

      <Grid style={{ gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))" }}>
        <Card style={{ gridColumn:"1/-1" }}>
          <img className="icon" alt={desc} width="110" height="110"
            src={`https://openweathermap.org/img/wn/${icon}@4x.png`} />
          <div className="city" style={{ fontSize:22 }}>{data.name}, {data.sys?.country}</div>
          <div className="big">{Math.round(data.main?.temp)}°C</div>
          <div className="meta" style={{ textTransform:"capitalize" }}>{desc}</div>
          <div className="time">🕒 Local time: {time}</div>
          <div className="meta">💧 {data.main?.humidity}% • 🌬 {data.wind?.speed} m/s • 🎯 {data.main?.pressure} hPa</div>
          <div className="meta">
            🕘 Sunrise: {formatUnix(data.sys?.sunrise, data.timezone)} | 🌇 Sunset: {formatUnix(data.sys?.sunset, data.timezone)}
          </div>

          <Btn className="pulse" onClick={onBack} style={{ marginTop: 8 }}>⬅ Back (Add to Recently)</Btn>
        </Card>

        <Card><div className="city">Feels Like</div><div className="big">{Math.round(data.main?.feels_like)}°C</div></Card>
        <Card><div className="city">Min / Max</div><div className="big">{Math.round(data.main?.temp_min)}° / {Math.round(data.main?.temp_max)}°</div></Card>
        <Card><div className="city">Visibility</div><div className="big">{(data.visibility/1000).toFixed(1)} km</div></Card>
      </Grid>
    </div>
  );
}

function EmptyState() {
  return (
    <Card style={{ gridColumn:"1/-1", padding:"22px 18px" }}>
      <div style={{
        background: "rgba(0,0,0,0.08)",
        borderRadius: "50%",
        padding: "10px"
      }}>
        <img className="icon" width="84" height="84" alt="clouds"
          src="https://openweathermap.org/img/wn/03d@2x.png" />
      </div>
      <div className="city">No recent cities yet</div>
      <div className="meta">Search above and view details—then press Back to add it here.</div>
    </Card>
  );
}

/* ------------------ Helpers ------------------ */
function formatUnix(unix, tzOffsetSec) {
  if (!unix) return "—";
  const date = new Date((unix + tzOffsetSec) * 1000);
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
