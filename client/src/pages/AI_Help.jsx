import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:5000/Profile";

function AI_Help() {

  const { developer_id } = useParams();
  const navigate = useNavigate();

  const [devName, setDevName] = useState("");
  const [metrics, setMetrics] = useState([]);

  const [selectedMonth, setSelectedMonth] =
    useState("");

  const [advice, setAdvice] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [initLoading, setInitLoading] =
    useState(true);

  useEffect(() => {

    const loadData = async () => {

      try {

        const [
          ltRes,
          ctRes,
          dfRes,
          prRes,
          brRes,
        ] = await Promise.all([

          axios.get(
            `${BASE_URL}/${developer_id}/lead-time`
          ),

          axios.get(
            `${BASE_URL}/${developer_id}/cycle-time`
          ),

          axios.get(
            `${BASE_URL}/${developer_id}/deployment-frequency`
          ),

          axios.get(
            `${BASE_URL}/${developer_id}/pr-throughput`
          ),

          axios.get(
            `${BASE_URL}/${developer_id}/bug-rate`
          ),
        ]);

        const lt = ltRes.data;
        const ct = ctRes.data;
        const df = dfRes.data;
        const pr = prRes.data;
        const br = brRes.data;

        const allRows = [
          ...lt,
          ...ct,
          ...df,
          ...pr,
        ];

        const nameRow =
          allRows.find(
            (r) => r.developer_name
          );

        setDevName(
          nameRow?.developer_name ||
          developer_id
        );

        const allMonths = [...new Set([
          ...lt.map((d) => d.month),
          ...ct.map((d) => d.month),
          ...df.map((d) => d.month),
          ...pr.map((d) => d.month),
        ])].sort();

        const assembled = allMonths.map(
          (month) => {

            const ltRow =
              lt.find(
                (d) => d.month === month
              );

            const ctRow =
              ct.find(
                (d) => d.month === month
              );

            const dfRow =
              df.find(
                (d) => d.month === month
              );

            const prRow =
              pr.find(
                (d) => d.month === month
              );

            const brRow =
              br.find(
                (d) => d.month === month
              );

            return {

              month,

              leadTime:
                ltRow
                  ? Number(
                      ltRow.avgLeadTimeDays
                    ).toFixed(1)
                  : null,

              cycleTime:
                ctRow
                  ? Number(
                      ctRow.avgCycleTimeDays
                    ).toFixed(1)
                  : null,

              deployments:
                dfRow?.deploymentCount ??
                null,

              prs:
                prRow?.mergedPRCount ??
                null,

              bugRate:
                brRow?.bugRate ??
                null,
            };
          }
        );

        setMetrics(assembled);

        if (assembled.length > 0) {

          setSelectedMonth(
            assembled[
              assembled.length - 1
            ].month
          );
        }

      } catch (err) {

        console.log(err);

      } finally {

        setInitLoading(false);
      }
    };

    loadData();

  }, [developer_id]);

  const currentMetrics = metrics.find(
    (m) => m.month === selectedMonth
  );

  const generateAdvice = async () => {

    if (!currentMetrics) return;

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/API/AI",

        {
          developerName: devName,

          month: selectedMonth,

          leadTime:
            currentMetrics.leadTime,

          cycleTime:
            currentMetrics.cycleTime,

          deployments:
            currentMetrics.deployments,

          prs:
            currentMetrics.prs,

          bugRate:
            currentMetrics.bugRate ?? 0,
        }
      );

      setAdvice(res.data.advice);

    } catch (err) {

      console.log(err);

      setAdvice(
        "Failed to generate advice."
      );

    } finally {

      setLoading(false);
    }
  };

  if (initLoading) {

    return (
      <div
        style={{
          padding: "3rem",
          fontSize: "14px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (

    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        background:
          "var(--color-background-tertiary)",
      }}
    >

      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >

        {/* Back Button */}

        <button
          onClick={() =>
            navigate(
              `/developer/${developer_id}`
            )
          }

          style={{
            alignSelf: "flex-start",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            color:
              "var(--color-text-secondary)",
          }}
        >
          ← Back
        </button>

        {/* Header */}

        <div
          style={{
            background:
              "var(--color-background-primary)",

            border:
              "0.5px solid var(--color-border-tertiary)",

            borderRadius: "18px",

            padding: "2rem",

            textAlign: "center",
          }}
        >

          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "#EEEDFE",
              border: "1px solid #AFA9EC",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              fontSize: "32px",

              margin: "0 auto 1rem",
            }}
          >
            🧙
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              color: "#3C3489",
            }}
          >
            Guru AI Coaching
          </h1>

          <p
            style={{
              marginTop: "12px",
              fontSize: "14px",
              color:
                "var(--color-text-secondary)",
            }}
          >
            Personalized advice for{" "}
            <strong>{devName}</strong>
          </p>

        </div>

        {/* Month Selector */}

        <div
          style={{
            background:
              "var(--color-background-primary)",

            border:
              "0.5px solid var(--color-border-tertiary)",

            borderRadius: "16px",

            padding: "1rem",
          }}
        >

          <p
            style={{
              marginTop: 0,
              marginBottom: "10px",
              fontSize: "11px",
              fontWeight: 700,
              color:
                "var(--color-text-secondary)",

              letterSpacing: "0.08em",
            }}
          >
            SELECT MONTH
          </p>

          <select
            value={selectedMonth}

            onChange={(e) =>
              setSelectedMonth(
                e.target.value
              )
            }

            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",

              border:
                "0.5px solid var(--color-border-secondary)",

              fontSize: "14px",
            }}
          >

            {metrics.map((m) => (

              <option
                key={m.month}
                value={m.month}
              >
                {m.month}
              </option>
            ))}
          </select>

        </div>

        {/* Metrics */}

        {currentMetrics && (

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(140px,1fr))",
              gap: "12px",
            }}
          >

            {[
              {
                label: "Lead Time",
                value: currentMetrics.leadTime,
                bg: "#E6F1FB",
                color: "#0C447C",
              },

              {
                label: "Cycle Time",
                value: currentMetrics.cycleTime,
                bg: "#E1F5EE",
                color: "#085041",
              },

              {
                label: "Deployments",
                value: currentMetrics.deployments,
                bg: "#EEEDFE",
                color: "#3C3489",
              },

              {
                label: "PR Throughput",
                value: currentMetrics.prs,
                bg: "#FAEEDA",
                color: "#633806",
              },

              {
                label: "Bug Rate",
                value:
                  `${currentMetrics.bugRate ?? "N/A"}%`,
                bg: "#FAECE7",
                color: "#712B13",
              },

            ].map((m) => (

              <div
                key={m.label}

                style={{
                  background: m.bg,

                  border:
                    "0.5px solid var(--color-border-tertiary)",

                  borderRadius: "16px",

                  padding: "1rem",

                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >

                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    fontWeight: 700,
                    color: m.color,

                    opacity: 0.85,

                    textTransform: "uppercase",

                    letterSpacing: "0.05em",
                  }}
                >
                  {m.label}
                </p>

                <h2
                  style={{
                    margin: 0,
                    fontSize: "30px",
                    color: m.color,
                  }}
                >
                  {m.value}
                </h2>

              </div>
            ))}

          </div>
        )}

        {/* Generate Button */}

        <button
          onClick={generateAdvice}

          disabled={loading}

          style={{
            padding: "14px",

            borderRadius: "14px",

            border: "none",

            background: loading
              ? "#B9B5E8"
              : "#7F77DD",

            color: "#fff",

            fontWeight: 700,

            fontSize: "14px",

            cursor: loading
              ? "not-allowed"
              : "pointer",

            transition: "0.15s ease",

            boxShadow:
              "0 4px 12px rgba(127,119,221,0.25)",
          }}
        >

          {loading
            ? "Generating Advice..."
            : "Generate AI Advice"}

        </button>

        {/* Advice */}

        {advice && (

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >

            {/* Strengths */}

            <div
              style={{
                background: "#E8F7EE",
                border: "1px solid #A6D8B8",
                borderLeft:
                  "5px solid #1D9E75",

                borderRadius: "14px",

                padding: "1rem",
              }}
            >

              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "10px",
                  color: "#085041",
                }}
              >
                Strengths
              </h3>

              <div
                style={{
                  color: "#085041",
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                }}
              >
                {advice}
              </div>

            </div>

            {/* Risks */}

            <div
              style={{
                background: "#FCECEC",
                border: "1px solid #E0B4B4",
                borderLeft:
                  "5px solid #D85A30",

                borderRadius: "14px",

                padding: "1rem",
              }}
            >

              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "10px",
                  color: "#712B13",
                }}
              >
                Risks
              </h3>

              <div
                style={{
                  color: "#712B13",
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                }}
              >
                {advice}
              </div>

            </div>

            {/* Recommendations */}

            <div
              style={{
                background: "#FFF8E6",
                border: "1px solid #E7D39A",
                borderLeft:
                  "5px solid #BA7517",

                borderRadius: "14px",

                padding: "1rem",
              }}
            >

              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "10px",
                  color: "#633806",
                }}
              >
                Recommendations
              </h3>

              <div
                style={{
                  color: "#633806",
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                }}
              >
                {advice}
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default AI_Help;