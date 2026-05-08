import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/API",
});

// Developers
export const fetchDevelopers =
  () => API.get("/Developers");

// Issues
export const fetchIssues =
  () => API.get("/Issues");

// PRs
export const fetchPRs =
  () => API.get("/PRs");

// Deployments
export const fetchDeployments =
  () => API.get("/Deployments");

// Bugs
export const fetchBugs =
  () => API.get("/Bugs");