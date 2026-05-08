import MetricGrid from "./MetricGrid";
import TrendChart from "./TrendChart";

function InsightPanel({ developer, leadTime, cycleTime, deployFreq, prThroughput, bugRate, selectedMonth, onMonthChange }) {

  const allMonths = [
    ...new Set([
      ...leadTime.map((d) => d.month),
      ...cycleTime.map((d) => d.month),
      ...deployFreq.map((d) => d.month),
      ...prThroughput.map((d) => d.month),
    ]),
  ].sort();

  const trendData = allMonths.map((month) => {
    const lt = leadTime.find((d) => d.month === month);
    const ct = cycleTime.find((d) => d.month === month);
    const df = deployFreq.find((d) => d.month === month);
    const pr = prThroughput.find((d) => d.month === month);
    return {
      month: month.slice(5),
      "Lead Time": lt ? Number(Number(lt.avgLeadTimeDays).toFixed(1)) : null,
      "Cycle Time": ct ? Number(Number(ct.avgCycleTimeDays).toFixed(1)) : null,
      "Deployments": df ? df.deploymentCount : null,
      "PRs Merged": pr ? pr.mergedPRCount : null,
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Month selector */}
      <div>
        <p style={{
          fontSize: "10px",
          fontWeight: 600,
          color: "var(--color-text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          margin: "0 0 10px",
        }}>
          Select month
        </p>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {allMonths.map((month) => {
            const isSelected = month === selectedMonth;
            return (
              <button
                key={month}
                onClick={() => onMonthChange(month)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "var(--border-radius-md)",
                  fontSize: "12px",
                  fontWeight: isSelected ? 600 : 400,
                  cursor: "pointer",
                  border: isSelected
                    ? "1px solid #378ADD"
                    : "0.5px solid var(--color-border-secondary)",
                  background: isSelected ? "#378ADD" : "var(--color-background-primary)",
                  color: isSelected ? "#fff" : "var(--color-text-primary)",
                  transition: "all 0.12s",
                  letterSpacing: "0.02em",
                }}
              >
                {month}
              </button>
            );
          })}
        </div>
      </div>

      {selectedMonth ? (
        <>
          {/* Metric cards */}
          <div>
            <SectionLabel>Metrics · {selectedMonth}</SectionLabel>
            <MetricGrid
              leadTime={leadTime}
              cycleTime={cycleTime}
              deployFreq={deployFreq}
              prThroughput={prThroughput}
              bugRate={bugRate}
              month={selectedMonth}
            />
          </div>

          {/* Trend charts */}
          <div>
            <SectionLabel>Trends over time</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <TrendChart
                title="Lead time vs cycle time (days)"
                data={trendData}
                lines={[
                  { dataKey: "Lead Time", name: "Lead Time" },
                  { dataKey: "Cycle Time", name: "Cycle Time" },
                ]}
              />
              <TrendChart
                title="Deployment frequency vs PR throughput"
                data={trendData}
                lines={[
                  { dataKey: "Deployments", name: "Deployments" },
                  { dataKey: "PRs Merged", name: "PRs Merged" },
                ]}
              />
            </div>
          </div>
        </>
      ) : (
        <div style={{
          padding: "2.5rem",
          textAlign: "center",
          background: "var(--color-background-secondary)",
          borderRadius: "var(--border-radius-lg)",
          border: "0.5px solid var(--color-border-tertiary)",
        }}>
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: 0 }}>
            Select a month above to view insights
          </p>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: "10px",
      fontWeight: 600,
      color: "var(--color-text-secondary)",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      margin: "0 0 10px",
    }}>
      {children}
    </p>
  );
}

export default InsightPanel;
