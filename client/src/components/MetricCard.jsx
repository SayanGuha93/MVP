function MetricCard({ title, value, unit, subtitle, icon, trend, color = "blue" }) {
  const colorMap = {
    blue:   { accent: "#378ADD", light: "#E6F1FB", text: "#0C447C" },
    teal:   { accent: "#1D9E75", light: "#E1F5EE", text: "#085041" },
    amber:  { accent: "#BA7517", light: "#FAEEDA", text: "#633806" },
    coral:  { accent: "#D85A30", light: "#FAECE7", text: "#712B13" },
    purple: { accent: "#7F77DD", light: "#EEEDFE", text: "#3C3489" },
  };

  const c = colorMap[color] || colorMap.blue;
  const trendUp = trend > 0;
  const trendDown = trend < 0;

  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-lg)",
      padding: "1rem 1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      borderTop: `2px solid ${c.accent}`,
      position: "relative",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{
          fontSize: "10px",
          fontWeight: 600,
          color: "var(--color-text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}>
          {title}
        </span>
        {icon && (
          <span style={{
            fontSize: "14px",
            opacity: 0.5,
          }}>{icon}</span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
        <span style={{
          fontSize: "26px",
          fontWeight: 700,
          color: "var(--color-text-primary)",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
        }}>
          {value ?? "—"}
        </span>
        {unit && (
          <span style={{ fontSize: "12px", color: "var(--color-text-secondary)", fontWeight: 500 }}>
            {unit}
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "2px" }}>
        {subtitle && (
          <p style={{
            fontSize: "11px",
            color: "var(--color-text-secondary)",
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {subtitle}
          </p>
        )}
        {trend !== undefined && (
          <span style={{
            fontSize: "11px",
            fontWeight: 600,
            color: trendUp ? "#1D9E75" : trendDown ? "#D85A30" : "var(--color-text-secondary)",
            background: trendUp ? "#E1F5EE" : trendDown ? "#FAECE7" : "var(--color-background-secondary)",
            padding: "2px 6px",
            borderRadius: "4px",
            flexShrink: 0,
            marginLeft: "8px",
          }}>
            {trendUp ? "↑" : trendDown ? "↓" : "→"} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}

export default MetricCard;
