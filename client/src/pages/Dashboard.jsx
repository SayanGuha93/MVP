import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDevelopers } from "../services/api";

const TEAM_COLORS = {
  "Payments API": {
    dot: "#378ADD",
    bg: "#E6F1FB",
    text: "#0C447C",
  },

  "Checkout Web": {
    dot: "#1D9E75",
    bg: "#E1F5EE",
    text: "#085041",
  },

  "Mobile Growth": {
    dot: "#7F77DD",
    bg: "#EEEDFE",
    text: "#3C3489",
  },
};

function groupByTeam(devs) {
  return devs.reduce((acc, dev) => {
    if (!acc[dev.team_name]) acc[dev.team_name] = [];
    acc[dev.team_name].push(dev);
    return acc;
  }, {});
}

function getInitials(name) {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??"
  );
}

function OverviewCard({
  title,
  value,
  subtitle,
  bg,
  text,
  border,
}) {
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: "18px",
        padding: "18px",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: text,
          opacity: 0.8,
          textTransform: "uppercase",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: "10px 0 6px",
          fontSize: "28px",
          color: text,
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </h2>

      <p
        style={{
          margin: 0,
          fontSize: "12px",
          lineHeight: 1.5,
          color: text,
          opacity: 0.85,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
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

  if (loading)
    return (
      <div style={centeredPage}>
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "13px",
          }}
        >
          Loading developers…
        </p>
      </div>
    );

  if (error)
    return (
      <div style={centeredPage}>
        <p
          style={{
            color: "var(--color-text-danger)",
            fontSize: "13px",
          }}
        >
          {error}
        </p>
      </div>
    );

  const grouped = groupByTeam(developers);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-background-tertiary)",
        padding: "2rem 2rem 4rem",
      }}
    >
      <div
        style={{
          maxWidth: "980px",
          margin: "0 auto",
        }}
      >
        {/* Hero */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #F8F7FE 100%)",
            border:
              "0.5px solid var(--color-border-tertiary)",
            borderRadius: "24px",
            padding: "28px",
            marginBottom: "1.5rem",
            boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: "260px" }}>
              <p
                style={{
                  margin: 0,
                  marginBottom: "12px",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#7F77DD",
                  textTransform: "uppercase",
                }}
              >
                ENGINEERING DELIVERY HEALTH
              </p>

              <h1
                style={{
                  margin: 0,
                  fontSize: "34px",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "var(--color-text-primary)",
                }}
              >
                Developer Productivity
              </h1>

              <p
                style={{
                  marginTop: "14px",
                  marginBottom: 0,
                  maxWidth: "620px",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "var(--color-text-secondary)",
                }}
              >
                Metrics alone do not explain engineering
                problems. This workspace helps teams identify
                delivery bottlenecks, quality risks, and
                operational patterns before they become release
                issues.
              </p>
            </div>

            <div
              style={{
                background: "#EEEDFE",
                border: "1px solid #D8D4FF",
                borderRadius: "18px",
                padding: "18px",
                width: "230px",
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#534AB7",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                WORKSPACE STATUS
              </p>

              <h2
                style={{
                  margin: "10px 0 8px",
                  fontSize: "22px",
                  color: "#3C3489",
                  letterSpacing: "-0.03em",
                }}
              >
                3 Active Teams
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  lineHeight: 1.6,
                  color: "#534AB7",
                }}
              >
                Review developer performance, delivery metrics,
                and productivity insights across teams.
              </p>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            marginBottom: "1.75rem",
          }}
        >
          <OverviewCard
            title="Developers"
            value={developers.length}
            subtitle="Active contributors tracked in this workspace"
            bg="#E6F1FB"
            text="#0C447C"
            border="#CFE3FA"
          />

          <OverviewCard
            title="Teams"
            value={Object.keys(grouped).length}
            subtitle="Cross-functional engineering delivery groups"
            bg="#E8F7EE"
            text="#085041"
            border="#CBECDD"
          />

          <OverviewCard
            title="Focus Area"
            value="Delivery"
            subtitle="Monitor engineering throughput and release flow"
            bg="#EEEDFE"
            text="#3C3489"
            border="#DDD8FF"
          />

          <OverviewCard
            title="Assignment"
            value="IC View"
            subtitle="Focused developer productivity experience"
            bg="#FAECE7"
            text="#712B13"
            border="#F5D8CC"
          />
        </div>

        {/* Team Sections */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {Object.entries(grouped).map(
            ([teamName, devs]) => {
              const tc =
                TEAM_COLORS[teamName] || {
                  dot: "#888780",
                  bg: "#F1EFE8",
                  text: "#444441",
                };

              return (
                <div
                  key={teamName}
                  style={{
                    background:
                      "var(--color-background-primary)",
                    border:
                      "0.5px solid var(--color-border-tertiary)",
                    borderRadius: "22px",
                    overflow: "hidden",
                    boxShadow:
                      "0 6px 18px rgba(0,0,0,0.02)",
                  }}
                >
                  {/* Team Header */}
                  <div
                    style={{
                      padding: "18px 20px",
                      borderBottom:
                        "0.5px solid var(--color-border-tertiary)",
                      background:
                        "var(--color-background-secondary)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "20px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: tc.dot,
                          }}
                        />

                        <h2
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: 700,
                            color:
                              "var(--color-text-primary)",
                          }}
                        >
                          {teamName}
                        </h2>
                      </div>

                      <div
                        style={{
                          background: tc.bg,
                          border: `1px solid ${tc.dot}20`,
                          borderRadius: "14px",
                          padding: "10px 14px",
                          minWidth: "90px",
                          textAlign: "center",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: "10px",
                            fontWeight: 700,
                            color: tc.text,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Contributors
                        </p>

                        <h3
                          style={{
                            margin: "6px 0 0",
                            fontSize: "22px",
                            color: tc.text,
                          }}
                        >
                          {devs.length}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Developers */}
                  <div>
                    {devs.map((dev, idx) => (
                      <div
                        key={dev.developer_id}
                        onClick={() =>
                          navigate(
                            `/developer/${dev.developer_id}`
                          )
                        }
                        style={{
                          padding: "16px 20px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          borderBottom:
                            idx < devs.length - 1
                              ? "0.5px solid var(--color-border-tertiary)"
                              : "none",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "var(--color-background-secondary)";
                          e.currentTarget.style.transform =
                            "translateX(2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "transparent";
                          e.currentTarget.style.transform =
                            "translateX(0px)";
                        }}
                      >
                        {/* Avatar */}
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            background: tc.bg,
                            border: `1px solid ${tc.dot}30`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: tc.text,
                            flexShrink: 0,
                            letterSpacing: "0.03em",
                          }}
                        >
                          {getInitials(
                            dev.developer_name
                          )}
                        </div>

                        {/* Info */}
                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              fontWeight: 600,
                              color:
                                "var(--color-text-primary)",
                              marginBottom: "4px",
                            }}
                          >
                            {dev.developer_name}
                          </p>

                          <p
                            style={{
                              margin: 0,
                              fontSize: "11px",
                              color:
                                "var(--color-text-secondary)",
                              lineHeight: 1.5,
                            }}
                          >
                            {dev.service_type} ·{" "}
                            {dev.level}
                          </p>
                        </div>

                        {/* Arrow */}
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background:
                              "var(--color-background-secondary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color:
                              "var(--color-text-secondary)",
                            fontSize: "16px",
                            flexShrink: 0,
                          }}
                        >
                          ›
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          )}
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