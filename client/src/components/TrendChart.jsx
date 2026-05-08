import { useEffect, useRef } from "react";

function TrendChart({ title, data, lines, height = 200 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const pad = { top: 16, right: 16, bottom: 36, left: 36 };

    ctx.clearRect(0, 0, W, H);

    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;

    let allValues = [];
    lines.forEach(({ dataKey }) => {
      data.forEach((point) => {
        const v = point[dataKey];
        if (v !== null && v !== undefined) allValues.push(v);
      });
    });
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const range = maxVal - minVal || 1;

    const toX = (i) => pad.left + (i / (data.length - 1)) * chartW;
    const toY = (val) => pad.top + chartH - ((val - minVal) / range) * chartH;

    const COLORS = ["#378ADD", "#1D9E75", "#D85A30", "#BA7517", "#7F77DD"];

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (i / 4) * chartH;
      ctx.beginPath();
      ctx.strokeStyle = "rgba(136,135,128,0.12)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + chartW, y);
      ctx.stroke();
      ctx.setLineDash([]);

      const labelVal = maxVal - (i / 4) * range;
      ctx.fillStyle = "rgba(136,135,128,0.7)";
      ctx.font = "10px system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(labelVal.toFixed(1), pad.left - 5, y + 4);
    }

    // X axis labels
    data.forEach((point, i) => {
      ctx.fillStyle = "rgba(136,135,128,0.7)";
      ctx.font = "10px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(point.month, toX(i), H - 8);
    });

    // Lines + dots
    lines.forEach(({ dataKey }, li) => {
      const color = COLORS[li % COLORS.length];

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      let started = false;
      data.forEach((point, i) => {
        const val = point[dataKey];
        if (val === null || val === undefined) return;
        if (!started) { ctx.moveTo(toX(i), toY(val)); started = true; }
        else ctx.lineTo(toX(i), toY(val));
      });
      ctx.stroke();

      data.forEach((point, i) => {
        const val = point[dataKey];
        if (val === null || val === undefined) return;
        ctx.beginPath();
        ctx.arc(toX(i), toY(val), 3.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(toX(i), toY(val), 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = "var(--color-background-primary, #fff)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    });

  }, [data, lines]);

  if (!data || data.length === 0) {
    return (
      <div style={wrapStyle}>
        {title && <p style={titleStyle}>{title}</p>}
        <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>No trend data available.</p>
      </div>
    );
  }

  const COLORS = ["#378ADD", "#1D9E75", "#D85A30", "#BA7517", "#7F77DD"];

  return (
    <div style={wrapStyle}>
      {title && (
        <p style={titleStyle}>{title}</p>
      )}

      <canvas
        ref={canvasRef}
        width={620}
        height={height}
        style={{ width: "100%", height: `${height}px`, display: "block" }}
      />

      {lines.length > 1 && (
        <div style={{ display: "flex", gap: "14px", marginTop: "10px", flexWrap: "wrap" }}>
          {lines.map(({ dataKey, name }, i) => (
            <div key={dataKey} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{
                width: "16px", height: "2px", borderRadius: "2px",
                background: COLORS[i % COLORS.length],
                display: "inline-block",
              }} />
              <span style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
                {name || dataKey}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const wrapStyle = {
  background: "var(--color-background-secondary)",
  border: "0.5px solid var(--color-border-tertiary)",
  borderRadius: "var(--border-radius-lg)",
  padding: "1rem 1.25rem",
};

const titleStyle = {
  fontSize: "11px",
  fontWeight: 600,
  color: "var(--color-text-secondary)",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  marginBottom: "12px",
  margin: "0 0 12px",
};

export default TrendChart;
