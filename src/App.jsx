import { useState, useEffect } from "react";

// ── Theme (same palette as Chaos Predictor) ───────────────────────────────────
const C = {
  bg:      "#0d0f14",
  surface: "#151820",
  card:    "#1c2030",
  border:  "#2a2f42",
  text:    "#e8eaf6",
  sub:     "#8892b0",
  muted:   "#4a5270",
  accent:  "#00e5ff",
  green:   "#4ade80",
  red:     "#f87171",
  yellow:  "#fbbf24",
  orange:  "#fb923c",
};
const FONT = "'JetBrains Mono','Fira Mono',monospace";

// ── Helpers ───────────────────────────────────────────────────────────────────
function confColor(conf) {
  if (!conf) return C.muted;
  const c = conf.toLowerCase();
  if (c === "high")   return C.green;
  if (c === "medium") return C.yellow;
  return C.red;
}

function ResultChip({ r }) {
  const color = r === "W" ? C.green : r === "D" ? C.yellow : C.red;
  return (
    <div style={{
      width: 22, height: 22, borderRadius: 4,
      background: color + "22", border: `1.5px solid ${color}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 10, fontWeight: 700, color, fontFamily: FONT,
    }}>{r}</div>
  );
}

function FormBar({ form }) {
  if (!form) return <span style={{ color: C.muted, fontSize: 11 }}>—</span>;
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {form.split("").map((r, i) => <ResultChip key={i} r={r} />)}
    </div>
  );
}

// ── Prediction badge ──────────────────────────────────────────────────────────
function PredBadge({ label, predict, confidence, reasoning }) {
  const cc = confColor(confidence);
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 10, padding: "0.75rem 1rem",
    }}>
      <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{predict || "—"}</span>
        {confidence && (
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4,
            background: cc + "22", border: `1px solid ${cc}`, color: cc, letterSpacing: 1,
          }}>{confidence.toUpperCase()}</span>
        )}
      </div>
      {reasoning && (
        <p style={{ margin: 0, fontSize: 11, color: C.sub, lineHeight: 1.6 }}>{reasoning}</p>
      )}
    </div>
  );
}

// ── Match card (fixture list) ─────────────────────────────────────────────────
function MatchCard({ item, onClick, selected }) {
  const fx   = item.fixture;
  const pred = item.prediction;
  const mr   = pred?.match_result;
  const cc   = confColor(mr?.confidence);
  return (
    <div onClick={onClick} style={{
      background: selected ? C.accent + "11" : C.card,
      border: `1px solid ${selected ? C.accent : C.border}`,
      borderRadius: 10, padding: "0.85rem 1rem",
      cursor: "pointer", transition: "all 0.15s",
    }}>
      <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 6 }}>
        {fx.date} · {fx.time}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{fx.home_team}</div>
          <div style={{ fontSize: 11, color: C.sub }}>vs {fx.away_team}</div>
        </div>
        {mr?.predict && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{mr.predict}</div>
            <div style={{ fontSize: 9, color: cc, fontWeight: 700 }}>{mr.confidence}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function FixtureCard({ fx, onClick, selected }) {
  return (
    <div onClick={onClick} style={{
      background: selected ? C.accent + "11" : C.card,
      border: `1px solid ${selected ? C.accent : C.border}`,
      borderRadius: 10, padding: "0.85rem 1rem",
      cursor: "pointer", transition: "all 0.15s",
    }}>
      <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 6 }}>
        {fx.date} · {fx.time}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{fx.home_team}</div>
      <div style={{ fontSize: 11, color: C.sub }}>vs {fx.away_team}</div>
      <div style={{ fontSize: 10, color: C.muted, marginTop: 6, fontStyle: "italic" }}>
        No analysis yet
      </div>
    </div>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function DetailPanel({ item }) {
  const fx   = item.fixture || item;
  const pred = item.prediction;
  const hf   = item.home_form;
  const af   = item.away_form;
  const h2h  = item.h2h || [];

  const card = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "1.1rem" };
  const lbl  = { fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginBottom: "0.6rem", display: "block" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* Match header */}
      <div style={{ ...card, borderColor: pred ? C.accent : C.border }}>
        <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 10 }}>
          {fx.date} · {fx.time}{fx.venue ? ` · ${fx.venue}` : ""}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.accent }}>{fx.home_team}</div>
            <div style={{ fontSize: 11, color: C.sub }}>HOME</div>
          </div>
          <div style={{ fontSize: 18, color: C.muted, fontWeight: 700 }}>vs</div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.orange }}>{fx.away_team}</div>
            <div style={{ fontSize: 11, color: C.sub }}>AWAY</div>
          </div>
        </div>
        {pred?.summary && (
          <p style={{ margin: "0.75rem 0 0", fontSize: 11, color: C.sub, fontStyle: "italic", lineHeight: 1.6, borderTop: `1px solid ${C.border}`, paddingTop: "0.6rem" }}>
            {pred.summary}
          </p>
        )}
      </div>

      {/* No analysis placeholder */}
      {!pred && (
        <div style={{ ...card, textAlign: "center", padding: "2rem" }}>
          <p style={{ color: C.sub, fontSize: 13, margin: "0 0 6px", fontWeight: 700 }}>No AI analysis yet</p>
          <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>
            Run the prediction pipeline to generate analysis for this fixture.
          </p>
        </div>
      )}

      {/* 4 prediction markets */}
      {pred && (
        <div>
          <span style={lbl}>AI predictions · claude haiku</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <PredBadge label="Match Result"     {...pred.match_result}  />
            <PredBadge label="Both Teams Score" {...pred.btts}          />
            <PredBadge label="Total Goals"      {...pred.total_goals}   />
            <PredBadge label="Total Corners"    {...pred.total_corners} />
          </div>
        </div>
      )}

      {/* Team form */}
      {pred && (
        <div style={card}>
          <span style={lbl}>team form — last {hf?.played ?? "?"} games</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            {[
              { team: fx.home_team, form: hf, color: C.accent, role: "Home" },
              { team: fx.away_team, form: af, color: C.orange, role: "Away" },
            ].map(({ team, form, color, role }) => (
              <div key={team}>
                <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 6 }}>
                  {team} <span style={{ color: C.muted, fontWeight: 400 }}>({role})</span>
                </div>
                <FormBar form={form?.form} />
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                  {[
                    ["Goals Scored",   form?.avg_goals_scored],
                    ["Goals Conceded", form?.avg_goals_conceded],
                    ["Corners For",    form?.avg_corners_for],
                    ["Clean Sheets",   form?.clean_sheets],
                    ["BTTS",           form?.btts_count   != null ? `${form.btts_count}/${form.played}`   : null],
                    ["Over 2.5",       form?.over25_count != null ? `${form.over25_count}/${form.played}` : null],
                  ].map(([l, v]) => v != null && (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                      <span style={{ color: C.muted }}>{l}</span>
                      <span style={{ color: C.text, fontWeight: 700 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* H2H */}
      {pred && (
        <div style={card}>
          <span style={lbl}>head to head — last {h2h.length} meetings</span>
          {h2h.length === 0
            ? <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>No H2H data in dataset.</p>
            : [...h2h].reverse().map((r, i) => {
                const winner = r.result === "H" ? r.home_team : r.result === "A" ? r.away_team : "Draw";
                const wColor = r.result === "D" ? C.yellow : winner === fx.home_team ? C.accent : C.orange;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 10, color: C.muted, width: 82, flexShrink: 0 }}>{r.date}</span>
                    <span style={{ fontSize: 11, flex: 1, color: C.text }}>
                      {r.home_team} <strong>{r.home_goals}–{r.away_goals}</strong> {r.away_team}
                    </span>
                    <span style={{ fontSize: 10, color: wColor, fontWeight: 700, width: 30, textAlign: "right" }}>
                      {r.result === "D" ? "D" : winner === fx.home_team ? "H" : "A"}
                    </span>
                  </div>
                );
              })
          }
        </div>
      )}

      {pred && (
        <p style={{ margin: 0, fontSize: 10, color: C.muted, fontStyle: "italic", textAlign: "center", lineHeight: 1.6 }}>
          AI analysis is data-driven, not a guarantee. Soccer involves inherent unpredictability.
        </p>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
export default function SoccerPredictor() {
  const [predictions, setPredictions] = useState([]);
  const [fixtures,    setFixtures]    = useState([]);
  const [selected,    setSelected]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState("today");

  useEffect(() => {
    Promise.all([
      fetch("/data/predictions.json").then(r => r.ok ? r.json() : []).catch(() => []),
      fetch("/data/upcoming_fixtures.json").then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([preds, fxs]) => {
      setPredictions(preds);
      setFixtures(fxs);
      if (preds.length) setSelected(preds[0]);
      setLoading(false);
    });
  }, []);

  const predIds     = new Set(predictions.map(p => p.fixture.event_id));
  const unpredicted = fixtures.filter(fx => !predIds.has(fx.event_id));

  // SA is UTC+2 — shift so midnight doesn't flip to yesterday
  const todayDt  = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const today    = todayDt.toISOString().slice(0, 10);
  const weekEnd  = new Date(todayDt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const filterFn = d =>
    filter === "today" ? d === today :
    filter === "week"  ? d >= today && d <= weekEnd :
    true;

  const filteredPreds = predictions.filter(p => filterFn(p.fixture.date));
  const filteredFx    = unpredicted.filter(fx => filterFn(fx.date));

  // Auto-select first analysed match when filter changes and current selection not in list
  useEffect(() => {
    const ids = new Set(filteredPreds.map(p => p.fixture.event_id));
    if (!selected || !ids.has(selected.fixture?.event_id)) {
      setSelected(filteredPreds[0] || null);
    }
  }, [filter, filteredPreds.length]);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: FONT, color: C.text }}>

      {/* Header */}
      <div style={{ padding: "1rem 1.5rem", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 32, background: C.accent, borderRadius: 4 }} />
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>Soccer Predictor</h1>
            <p style={{ margin: 0, fontSize: 10, color: C.sub }}>Simteknologies · SA Betway Premiership · AI powered</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["today", "week", "all"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "5px 12px", borderRadius: 6, fontFamily: FONT, fontSize: 10,
              fontWeight: 700, cursor: "pointer", letterSpacing: 1, textTransform: "uppercase",
              border: `1px solid ${filter === f ? C.accent : C.border}`,
              background: filter === f ? C.accent + "22" : "transparent",
              color: filter === f ? C.accent : C.muted,
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", height: "calc(100vh - 65px)" }}>

        {/* Left — list */}
        <div style={{ borderRight: `1px solid ${C.border}`, padding: "1rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {loading && <p style={{ color: C.muted, fontSize: 12, textAlign: "center", marginTop: "2rem" }}>Loading...</p>}

          {!loading && filteredPreds.length === 0 && filteredFx.length === 0 && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.25rem", marginTop: "1rem", textAlign: "center" }}>
              <p style={{ color: C.sub, fontSize: 12, margin: 0 }}>No matches for this filter.</p>
              <p style={{ color: C.muted, fontSize: 11, margin: "0.5rem 0 0" }}>Try "Week" or "All".</p>
            </div>
          )}

          {filteredPreds.length > 0 && (
            <>
              <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, padding: "0.25rem 0" }}>AI ANALYSED · {filteredPreds.length}</div>
              {filteredPreds.map((item, i) => (
                <MatchCard key={i} item={item} selected={selected?.fixture?.event_id === item.fixture.event_id} onClick={() => setSelected(item)} />
              ))}
            </>
          )}

          {filteredFx.length > 0 && (
            <>
              <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, padding: "0.5rem 0 0.25rem" }}>UPCOMING · {filteredFx.length}</div>
              {filteredFx.map((fx, i) => (
                <FixtureCard
                  key={i}
                  fx={fx}
                  selected={selected?.event_id === fx.event_id}
                  onClick={() => setSelected(fx)}
                />
              ))}
            </>
          )}
        </div>

        {/* Right — detail */}
        <div style={{ padding: "1.25rem", overflowY: "auto" }}>
          {!selected
            ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: C.muted, fontSize: 13 }}>Select a match to see the AI analysis</div>
            : <DetailPanel item={selected} />
          }
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "0.4rem 1.5rem", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, color: C.muted }}>Simteknologies · Soccer Predictor v1</span>
        <span style={{ fontSize: 10, color: C.muted }}>SA Betway Premiership · Claude Haiku</span>
      </div>
    </div>
  );
}
