import { useNavigate } from "react-router-dom";

const LEVEL_COLORS = {
  SDE1: { bg: "#FAEEDA", text: "#633806" },
  SDE2: { bg: "#E6F1FB", text: "#0C447C" },
  SDE3: { bg: "#EEEDFE", text: "#3C3489" },
};

function getInitials(name) {
  return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??";
}

function DeveloperSelector({ developers, activeId }) {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {developers.map((dev) => {
        const isActive = dev.developer_id === activeId;
        const lc = LEVEL_COLORS[dev.level] || { bg: "#F1EFE8", text: "#444441" };

        return (
          <div
            key={dev.developer_id}
            onClick={() => navigate(`/developer/${dev.developer_id}`)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 10px",
              borderRadius: "var(--border-radius-md)",
              cursor: "pointer",
              background: isActive ? "var(--color-background-secondary)" : "transparent",
              borderLeft: isActive ? "2px solid #378ADD" : "2px solid transparent",
              transition: "all 0.12s",
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = "var(--color-background-secondary)";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = "transparent";
            }}
          >
            {/* Avatar */}
            <div style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: isActive ? "#378ADD" : "var(--color-background-tertiary)",
              border: isActive ? "none" : "0.5px solid var(--color-border-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: 700,
              color: isActive ? "#fff" : "var(--color-text-secondary)",
              flexShrink: 0,
              letterSpacing: "0.02em",
            }}>
              {getInitials(dev.developer_name)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: "12px",
                fontWeight: isActive ? 600 : 400,
                color: "var(--color-text-primary)",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {dev.developer_name}
              </p>
              <p style={{
                fontSize: "10px",
                color: "var(--color-text-secondary)",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {dev.team_name}
              </p>
            </div>

            <span style={{
              fontSize: "9px",
              fontWeight: 700,
              padding: "2px 5px",
              borderRadius: "3px",
              background: lc.bg,
              color: lc.text,
              flexShrink: 0,
              letterSpacing: "0.04em",
            }}>
              {dev.level}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default DeveloperSelector;
