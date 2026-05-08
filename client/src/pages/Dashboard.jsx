import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDevelopers } from "../services/api";

const TEAM_COLORS = {
  "Payments API":  { dot: "#378ADD", bg: "#E6F1FB", text: "#0C447C" },
  "Checkout Web":  { dot: "#1D9E75", bg: "#E1F5EE", text: "#085041" },
  "Mobile Growth": { dot: "#7F77DD", bg: "#EEEDFE", text: "#3C3489" },
};

function groupByTeam(devs) {
  return devs.reduce((acc, dev) => {
    if (!acc[dev.team_name]) acc[dev.team_name] = [];
    acc[dev.team_name].push(dev);
    return acc;
  }, {});
}

function getInitials(name) {
  return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??";
}

function Dashboard() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDevelopers()
      .then((res) => setDevelopers(res.data))
      .catch(() => setError("Failed to load developers"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={centeredPage}>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>Loading developers…</p>
    </div>
  );

  if (error) return (
    <div style={centeredPage}>
      <p style={{ color: "var(--color-text-danger)", fontSize: "13px" }}>{error}</p>
    </div>
  );

  const grouped = groupByTeam(developers);

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--color-background-tertiary)",
      padding: "2rem 2rem 4rem",
    }}>
      <div style={{ maxWidth: "880px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem", borderBottom: "0.5px solid var(--color-border-tertiary)", paddingBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
            <h1 style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              margin: 0,
              letterSpacing: "-0.01em",
            }}>
              Developer Productivity
            </h1>
            <span style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
              background: "var(--color-background-secondary)",
              border: "0.5px solid var(--color-border-tertiary)",
              padding: "2px 8px",
              borderRadius: "20px",
            }}>
              {developers.length} devs · {Object.keys(grouped).length} teams
            </span>
          </div>
        </div>

        {/* Teams */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {Object.entries(grouped).map(([teamName, devs]) => {
            const tc = TEAM_COLORS[teamName] || { dot: "#888780", bg: "#F1EFE8", text: "#444441" };
            return (
              <div
                key={teamName}
                style={{
                  background: "var(--color-background-primary)",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: "var(--border-radius-lg)",
                  overflow: "hidden",
                }}
              >
                {/* Team header */}
                <div style={{
                  padding: "10px 16px",
                  borderBottom: "0.5px solid var(--color-border-tertiary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "var(--color-background-secondary)",
                }}>
                  <span style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: tc.dot,
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "0.01em" }}>
                    {teamName}
                  </span>
                  <span style={{
                    marginLeft: "auto",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: "3px",
                    background: tc.bg,
                    color: tc.text,
                    letterSpacing: "0.04em",
                  }}>
                    {devs.length}
                  </span>
                </div>

                {/* Dev rows */}
                <div>
                  {devs.map((dev, idx) => (
                    <div
                      key={dev.developer_id}
                      onClick={() => navigate(`/developer/${dev.developer_id}`)}
                      style={{
                        padding: "12px 16px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        borderBottom: idx < devs.length - 1
                          ? "0.5px solid var(--color-border-tertiary)"
                          : "none",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-background-secondary)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        background: tc.bg,
                        border: `0.5px solid ${tc.dot}40`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: tc.text,
                        flexShrink: 0,
                        letterSpacing: "0.02em",
                      }}>
                        {getInitials(dev.developer_name)}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "var(--color-text-primary)",
                          margin: 0,
                        }}>
                          {dev.developer_name}
                        </p>
                        <p style={{
                          fontSize: "11px",
                          color: "var(--color-text-secondary)",
                          margin: "1px 0 0",
                        }}>
                          {dev.service_type} · {dev.level}
                        </p>
                      </div>

                      <span style={{
                        fontSize: "14px",
                        color: "var(--color-text-secondary)",
                        opacity: 0.4,
                      }}>›</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const centeredPage = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
};

export default Dashboard;
