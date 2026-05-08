import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import InsightPanel from "../components/InsightPanel";

const BASE_URL = "http://localhost:5000/Profile";

function getInitials(name) {
  return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??";
}

function Badge({ label, value, colorBg, colorText }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
      <span style={{
        fontSize: "9px", fontWeight: 700,
        color: "var(--color-text-secondary)",
        textTransform: "uppercase", letterSpacing: "0.08em",
      }}>
        {label}
      </span>
      <span style={{
        fontSize: "12px", fontWeight: 600,
        color: colorText || "var(--color-text-primary)",
        background: colorBg || "transparent",
        padding: colorBg ? "2px 7px" : 0,
        borderRadius: colorBg ? "3px" : 0,
        width: "fit-content",
      }}>
        {value}
      </span>
    </div>
  );
}

const METRIC_DOCS = [
  {
    key: "lead_time",
    icon: "⏱",
    color: { accent: "#378ADD", light: "#E6F1FB", text: "#0C447C" },
    title: "Lead Time",
    tagline: "How fast does code reach production?",
    what: "Measures the total elapsed time from when a task is created (or a commit is first made) to when it is successfully deployed to production.",
    why: "A short lead time means the team can deliver value to users quickly and respond to feedback fast. Long lead times often indicate bottlenecks in planning, review, or deploy pipelines.",
    good: "Under 1 day is elite. 1–7 days is healthy. Over a week signals process friction worth investigating.",
    tips: [
      "Break large tasks into smaller, shippable units.",
      "Reduce waiting time in code review queues.",
      "Automate deploy pipelines to eliminate manual gates.",
    ],
  },
  {
    key: "cycle_time",
    icon: "🔄",
    color: { accent: "#378ADD", light: "#E6F1FB", text: "#0C447C" },
    title: "Cycle Time",
    tagline: "How fast does work move once started?",
    what: "The time between when a developer actively starts working on a task (moves it to 'In Progress') and when it is marked Done. Unlike lead time, it excludes queue/wait time before work begins.",
    why: "Cycle time is a direct measure of execution efficiency. It tells you whether the developer or team is moving quickly once they actually pick something up.",
    good: "Under 2 days is strong. 2–5 days is acceptable. Over 5 days consistently suggests tasks are too large or there are too many context switches.",
    tips: [
      "Limit work-in-progress (WIP) to keep focus.",
      "Identify if long cycle times correlate with specific task types.",
      "Reduce interruptions and unplanned work.",
    ],
  },
  {
    key: "deployments",
    icon: "🚀",
    color: { accent: "#1D9E75", light: "#E1F5EE", text: "#085041" },
    title: "Deployment Frequency",
    tagline: "How often does code ship to production?",
    what: "Counts the number of successful deployments to production in a given month. Each deployment is a discrete release of code.",
    why: "High deployment frequency is a hallmark of high-performing teams (per DORA research). It means smaller, safer releases with faster feedback loops and lower risk per deploy.",
    good: "Multiple times per day is elite. Once per day to once per week is high. Less than once per month increases release risk significantly.",
    tips: [
      "Adopt trunk-based development to reduce long-lived branches.",
      "Invest in automated testing so deploys are confidence-inspiring.",
      "Use feature flags to ship code independently of feature activation.",
    ],
  },
  {
    key: "pr_throughput",
    icon: "⇄",
    color: { accent: "#378ADD", light: "#E6F1FB", text: "#0C447C" },
    title: "PR Throughput",
    tagline: "How many pull requests are shipped per month?",
    what: "The count of pull requests merged to the main/production branch in a given month. Includes all PRs regardless of size.",
    why: "PR throughput reflects a developer's output velocity. Consistently merging PRs is a sign of steady, focused contribution.",
    good: "8–20 PRs/month is typical for an individual contributor. Above 30 may indicate very small PRs; below 5 may indicate blockers or very large batches.",
    tips: [
      "Aim for PRs that can be reviewed in under 30 minutes.",
      "Avoid combining unrelated changes in a single PR.",
      "Review and merge others' PRs promptly to maintain team flow.",
    ],
  },
{
  key: "bug_rate",
  icon: "⚠",
  color: {
    accent: "#DC2626",
    light: "#DC2626",
    text: "#991B1B",
  },
  title: "Bug Rate",
  tagline: "How often do bugs escape to production?",
  what: "The percentage of work that results in bugs discovered after deployment (escaped bugs). Calculated as escaped bug count divided by total deployments, expressed as a percentage.",
  why: "Escaped bugs are costly — they damage user trust, consume on-call time, and require emergency fixes. A low bug rate signals strong code quality practices.",
  good: "Under 5% is excellent. 5–15% is acceptable. Above 15% warrants a review of testing strategy and code review thoroughness.",
  tips: [
    "Write unit and integration tests before or alongside new code.",
    "Use staging environments that closely mirror production.",
    "Track which types of changes generate the most bugs and add targeted coverage.",
  ],
},
];

function MetricGuideCard({ metric }) {
  const [open, setOpen] = useState(false);
  const { color, icon, title, tagline, what, why, good, tips } = metric;

  return (
    <div style={{
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-lg)",
      overflow: "hidden",
      background: "var(--color-background-primary)",
    }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "13px 16px",
          background: open ? color.light : "none",
          border: "none",
          borderTop: `2px solid ${color.accent}`,
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.12s",
        }}
      >
        <div style={{
          width: "34px", height: "34px", borderRadius: "8px",
          background: color.light,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "16px", flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>
            {title}
          </p>
          <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", margin: "2px 0 0" }}>
            {tagline}
          </p>
        </div>
        <span style={{
          fontSize: "16px",
          color: "var(--color-text-secondary)",
          transition: "transform 0.18s",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          display: "inline-block",
          flexShrink: 0,
        }}>›</span>
      </button>

      {open && (
        <div style={{
          padding: "16px",
          borderTop: "0.5px solid var(--color-border-tertiary)",
          display: "flex", flexDirection: "column", gap: "14px",
        }}>
          <GuideRow label="What it measures" text={what} />
          <GuideRow label="Why it matters" text={why} />
          <GuideRow label="Benchmarks" text={good} highlight={color} />
          <div>
            <span style={guideLabel}>How to improve</span>
            <ul style={{ margin: "6px 0 0", paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "5px" }}>
              {tips.map((tip, i) => (
                <li key={i} style={{ fontSize: "12px", color: "var(--color-text-primary)", lineHeight: 1.55 }}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function GuideRow({ label, text, highlight }) {
  return (
    <div>
      <span style={guideLabel}>{label}</span>
      <p style={{
        fontSize: "12px",
        color: "var(--color-text-primary)",
        margin: "5px 0 0",
        lineHeight: 1.6,
        background: highlight ? highlight.light : "transparent",
        padding: highlight ? "7px 10px" : 0,
        borderRadius: highlight ? "6px" : 0,
        borderLeft: highlight ? `3px solid ${highlight.accent}` : "none",
      }}>
        {text}
      </p>
    </div>
  );
}

const guideLabel = {
  fontSize: "9px",
  fontWeight: 700,
  color: "var(--color-text-secondary)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

function DeveloperProfile() {
  const { developer_id } = useParams();
  const navigate = useNavigate();

  const [leadTime, setLeadTime]           = useState([]);
  const [cycleTime, setCycleTime]         = useState([]);
  const [deployFreq, setDeployFreq]       = useState([]);
  const [prThroughput, setPrThroughput]   = useState([]);
  const [bugRate, setBugRate]             = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");

  useEffect(() => {
    setLoading(true);
    setSelectedMonth(null);

    const fetchAll = async () => {
      try {
        const [lt, ct, df, pr, br] = await Promise.all([
          axios.get(`${BASE_URL}/${developer_id}/lead-time`),
          axios.get(`${BASE_URL}/${developer_id}/cycle-time`),
          axios.get(`${BASE_URL}/${developer_id}/deployment-frequency`),
          axios.get(`${BASE_URL}/${developer_id}/pr-throughput`),
          axios.get(`${BASE_URL}/${developer_id}/bug-rate`),
        ]);

        setLeadTime(lt.data);
        setCycleTime(ct.data);
        setDeployFreq(df.data);
        setPrThroughput(pr.data);
        setBugRate(br.data);

        const allMonths = [...new Set([
          ...lt.data.map((d) => d.month),
          ...ct.data.map((d) => d.month),
          ...df.data.map((d) => d.month),
          ...pr.data.map((d) => d.month),
        ])].sort();
        if (allMonths.length) setSelectedMonth(allMonths[allMonths.length - 1]);
      } catch (err) {
        console.error(err);
        setError("Failed to load developer metrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [developer_id]);

  if (loading) return (
    <div style={centeredPage}>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>Loading metrics…</p>
    </div>
  );

  if (error) return (
    <div style={centeredPage}>
      <p style={{ color: "var(--color-text-danger)", fontSize: "13px" }}>{error}</p>
    </div>
  );

  const allRows = [...leadTime, ...cycleTime, ...deployFreq, ...prThroughput];
  const metaRow = allRows.find((r) => r.developer_name);

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--color-background-tertiary)",
      padding: "2rem 2rem 4rem",
    }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        <button
          onClick={() => navigate("/")}
          style={{
            alignSelf: "flex-start",
            display: "flex", alignItems: "center", gap: "5px",
            fontSize: "12px", color: "var(--color-text-secondary)",
            background: "none", border: "none", cursor: "pointer",
            padding: 0, fontWeight: 500,
          }}
        >
          ← All developers
        </button>

        {/* Profile card */}
        <div style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "1.25rem",
            borderBottom: "0.5px solid var(--color-border-tertiary)",
            display: "flex", alignItems: "center", gap: "14px",
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "50%",
              background: "#E6F1FB", border: "0.5px solid #B5D4F4",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", fontWeight: 700, color: "#0C447C",
              flexShrink: 0, letterSpacing: "0.02em",
            }}>
              {getInitials(metaRow?.developer_name || developer_id)}
            </div>
            <div>
              <h1 style={{ fontSize: "17px", fontWeight: 700, color: "var(--color-text-primary)", margin: 0, letterSpacing: "-0.01em" }}>
                {metaRow?.developer_name || developer_id}
              </h1>
              <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", margin: "2px 0 0", fontFamily: "monospace" }}>
                {developer_id}
              </p>
            </div>
          </div>
          <div style={{ padding: "1.25rem" }}>
            <DeveloperInfoGrid developer_id={developer_id} />
          </div>
        </div>

        {/* Get advice from Guru */}
        <div
          onClick={() => navigate(`/developer/${developer_id}/ai-help`)}
          style={{
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderLeft: "3px solid #7F77DD",
            borderRadius: "var(--border-radius-lg)",
            padding: "1rem 1.25rem",
            display: "flex", alignItems: "center", gap: "14px",
            cursor: "pointer",
            transition: "background 0.12s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#EEEDFE"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-background-primary)"}
        >
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%",
            background: "#EEEDFE", border: "0.5px solid #AFA9EC",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", flexShrink: 0,
          }}>
            🧙
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#3C3489", margin: 0 }}>
              Get advice from Guru
            </p>
            <p style={{ fontSize: "11px", color: "#534AB7", margin: "2px 0 0", opacity: 0.85 }}>
              AI-powered coaching — personalized analysis of this developer's metrics
            </p>
          </div>
          <span style={{ fontSize: "18px", color: "#7F77DD", opacity: 0.6, flexShrink: 0 }}>›</span>
        </div>

      {/* Performance Insights */}
      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "1.25rem",
      }}>
        <div style={{ marginBottom: "1.25rem", borderBottom: "0.5px solid var(--color-border-tertiary)", paddingBottom: "1rem" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>
            Performance Insights
          </h2>
          <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", marginTop: "3px", marginBottom: 0 }}>
            Select a month to view metric breakdown
          </p>
        </div>
        <InsightPanel
          developer_id={developer_id}
          leadTime={leadTime}
          cycleTime={cycleTime}
          deployFreq={deployFreq}
          prThroughput={prThroughput}
          bugRate={bugRate}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      </div>

      {/* Metrics Guide */}
      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "1.25rem",
      }}>
        <div style={{ marginBottom: "1rem", borderBottom: "0.5px solid var(--color-border-tertiary)", paddingBottom: "1rem" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>
            Metrics Guide
          </h2>
          <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", marginTop: "3px", marginBottom: 0 }}>
            What each metric means, why it matters, and how to improve it — click any metric to expand
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {METRIC_DOCS.map((m) => (
            <MetricGuideCard key={m.key} metric={m} />
          ))}
        </div>
      </div>

      </div>
    </div>
  );
}

function DeveloperInfoGrid({ developer_id }) {
  const [dev, setDev] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/API/Developers")
      .then((res) => {
        const found = res.data.find((d) => d.developer_id === developer_id);
        setDev(found || null);
      })
      .catch(() => setDev(null));
  }, [developer_id]);

  if (!dev) return null;

  const sc = {
    backend:  { bg: "#E6F1FB", text: "#0C447C" },
    frontend: { bg: "#E1F5EE", text: "#085041" },
    mobile:   { bg: "#EEEDFE", text: "#3C3489" },
  }[dev.service_type] || {};

  const lc = {
    SDE1: { bg: "#FAEEDA", text: "#633806" },
    SDE2: { bg: "#E6F1FB", text: "#0C447C" },
    SDE3: { bg: "#EEEDFE", text: "#3C3489" },
  }[dev.level] || {};

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "16px 20px" }}>
      <Badge label="Team" value={dev.team_name} />
      <Badge label="Role" value={dev.service_type} colorBg={sc.bg} colorText={sc.text} />
      <Badge label="Level" value={dev.level} colorBg={lc.bg} colorText={lc.text} />
      <Badge label="Manager" value={dev.manager_name} />
      <Badge label="Manager ID" value={dev.manager_id} />
    </div>
  );
}

const centeredPage = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
};

export default DeveloperProfile;