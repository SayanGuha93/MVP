import MetricCard from "./MetricCard";

function MetricGrid({ leadTime, cycleTime, deployFreq, prThroughput, bugRate, month }) {
  const lt = leadTime?.find((d) => d.month === month);
  const ct = cycleTime?.find((d) => d.month === month);
  const df = deployFreq?.find((d) => d.month === month);
  const pr = prThroughput?.find((d) => d.month === month);
  const br = bugRate?.find((d) => d.month === month);

  const metrics = [
    {
      title: "Avg Lead Time",
      value: lt ? Number(lt.avgLeadTimeDays).toFixed(1) : "—",
      unit: lt ? "days" : "",
      subtitle: lt ? `${lt.prodDeploymentCount} prod deployments` : "No data",
      icon: "⏱",
      color: "blue",
    },
    {
      title: "Avg Cycle Time",
      value: ct ? Number(ct.avgCycleTimeDays).toFixed(1) : "—",
      unit: ct ? "days" : "",
      subtitle: ct ? `${ct.doneIssueCount} issues closed` : "No data",
      icon: "🔄",
      color: "teal",
    },
    {
      title: "Deployments",
      value: df ? df.deploymentCount : "—",
      unit: df ? "/ mo" : "",
      subtitle: "Prod deploys",
      icon: "🚀",
      color: "purple",
    },
    {
      title: "PR Throughput",
      value: pr ? pr.mergedPRCount : "—",
      unit: pr ? "merged" : "",
      subtitle: "Pull requests",
      icon: "⇄",
      color: "amber",
    },
    {
      title: "Bug Rate",
      value: br ? `${br.bugRate}` : "—",
      unit: br ? "%" : "",
      subtitle: br ? `${br.escapedBugCount} escaped` : "No bugs",
      icon: "⚠",
      color: "coral",
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "10px",
    }}>
      {metrics.map((m) => (
        <MetricCard key={m.title} {...m} />
      ))}
    </div>
  );
}

export default MetricGrid;
