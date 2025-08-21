// theme.js

export const lightTheme = {
  bg: "linear-gradient(135deg, #e0f2fe, #fef9c3, #fbcfe8)", // soft blue → yellow → pink
  text: "#1e293b",       // dark slate for good contrast
  subText: "#475569",    // softer gray for secondary text
  cardBg: "rgba(255,255,255,0.75)", 
  cardBorder: "rgba(0,0,0,0.08)",
  glassShadow: "0 8px 20px rgba(0,0,0,.12)",
  buttonBg: "linear-gradient(90deg, #3b82f6, #06b6d4)", // blue → cyan
  buttonText: "#ffffff",
};

export const darkTheme = {
  bg: "linear-gradient(135deg, #0f172a, #1e293b, #334155)", // deep navy shades
  text: "#f8fafc",        // near white
  subText: "#94a3b8",     // gray-blue for subtler text
  cardBg: "rgba(30,41,59,0.7)",
  cardBorder: "rgba(255,255,255,0.08)",
  glassShadow: "0 10px 25px rgba(0,0,0,0.45)",
  buttonBg: "linear-gradient(90deg, #22d3ee, #3b82f6)", // cyan → blue
  buttonText: "#f1f5f9",
};
