# Developer Productivity MVP — Architecture

## 1. Overview

This project is a full-stack Developer Productivity Intelligence MVP built using React.js, Node.js, Express.js, MongoDB, and Groq AI.

The platform helps developers understand engineering productivity metrics such as:

* Lead Time
* Cycle Time
* Deployment Frequency
* PR Throughput
* Bug Rate

Instead of only displaying raw metrics, the system also generates AI-powered explanations and recommendations to help developers understand what the metrics mean and how they can improve delivery performance.

The workbook provided in the assignment simulates real SDLC systems such as:

* Jira Issues
* Pull Requests
* CI/CD Deployments
* Bug Reports
* Developer Metadata

---

## 2. High-Level Architecture

```text
Excel Workbook
      ↓
ETL Import Script
      ↓
MongoDB Database
      ↓
Express REST APIs
      ↓
Metrics Engine
      ↓
React Frontend
      ↓
AI Insight Layer
```

---

## 3. Frontend Architecture

The frontend is built using React.js.

Main pages:

* Dashboard
* Developer Profile
* AI Coaching Page

Reusable components:

* MetricGrid
* MetricCard
* TrendChart
* InsightPanel
* DeveloperSelector

Frontend responsibilities:

* Display developer metrics
* Show monthly trends
* Visualize delivery performance
* Trigger AI insight generation
* Present actionable recommendations

---

## 4. Backend Architecture

The backend is built using Node.js and Express.js.

Architecture pattern:

```text
Routes → Controllers → Models → MongoDB
```

Main responsibilities:

* Serve developer and SDLC data
* Calculate engineering metrics
* Provide APIs for the frontend
* Generate AI-powered coaching insights

### API Groups

#### Raw Data APIs

* /API/Developers
* /API/Issues
* /API/PRs
* /API/Deployments
* /API/Bugs

#### Metrics APIs

* /Profile/:developer_id/lead-time
* /Profile/:developer_id/cycle-time
* /Profile/:developer_id/deployment-frequency
* /Profile/:developer_id/pr-throughput
* /Profile/:developer_id/bug-rate

#### AI API

* /API/AI

---

## 5. Database Design

MongoDB is used as the primary database.

Collections:

* Developers
* Issues
* Pull Requests
* Deployments
* Bugs

Each collection represents a simulated SDLC system.

Examples:

* Jira-like issue tracking
* GitHub pull request activity
* CI/CD deployment records
* Production bug reports

---

## 6. ETL / Data Import Pipeline

The project includes a workbook import pipeline.

Flow:

```text
Excel Workbook → XLSX Parser → JSON → MongoDB
```

The import script:

* Reads workbook sheets
* Converts rows into JSON
* Clears old collection data
* Inserts fresh records into MongoDB

Imported sheets:

* Dim_Developers
* Fact_Jira_Issues
* Fact_Pull_Requests
* Fact_CI_Deployments
* Fact_Bug_Reports

---

## 7. Metrics Engine

The metrics layer transforms raw SDLC data into engineering productivity insights.

Implemented metrics:

* Lead Time
* Cycle Time
* Deployment Frequency
* PR Throughput
* Bug Rate

Each metric is implemented using separate calculation modules for modularity and maintainability.

---

## 8. AI Insight Layer

The platform integrates Groq LLM APIs to generate personalized developer coaching insights.

The AI layer:

* Analyzes engineering metrics
* Identifies strengths
* Detects potential delivery risks
* Suggests practical improvements

The goal is to move beyond raw dashboards and provide actionable understanding.

---

## 9. Key Design Decisions

### Why MongoDB?

MongoDB maps naturally to workbook-style SDLC datasets and supports flexible document structures.

### Why Separate Metrics APIs?

Separating metric routes from raw data routes keeps analytics logic modular and easier to maintain.

### Why AI Insights?

The assignment emphasized that metrics alone are insufficient. The AI layer converts raw metrics into actionable recommendations.

### Why React?

React enabled reusable components and rapid dashboard development.

---

## 10. Future Improvements

Possible future enhancements:

* Authentication and role-based access
* Team-level analytics dashboards
* Real-time metrics updates
* Cached metric aggregation
* Historical trend analysis
* Deployment risk prediction
* AI-generated sprint summaries
* Manager performance overview
* Advanced filtering and search
