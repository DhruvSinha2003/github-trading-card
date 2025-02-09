"use client";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}`
      );
      const user = response.data;

      // Fetch commit data (This is a simplified example.  Rate limits apply!)
      const commitResponse = await axios.get(
        `https://api.github.com/users/${username}/events/public`
      );
      const events = commitResponse.data;

      // Calculate total commits (very basic)
      const totalCommits = events.filter(
        (event) => event.type === "PushEvent"
      ).length;

      // Calculate commits in the past year (very basic)
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const recentCommits = events.filter(
        (event) =>
          event.type === "PushEvent" && new Date(event.created_at) > oneYearAgo
      ).length;

      setUserData({
        ...user,
        totalCommits,
        recentCommits,
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setUserData(null);
      setError("User not found or API error.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>GitHub User Card</h1>
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={handleInputChange}
        style={{ padding: "8px", marginRight: "10px" }}
      />
      <button
        onClick={fetchData}
        style={{
          padding: "8px 16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Fetch Data
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {userData && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "400px",
          }}
        >
          <img
            src={userData.avatar_url}
            alt="User Avatar"
            style={{ width: "100px", borderRadius: "50%" }}
          />
          <h2>{userData.name || userData.login}</h2>
          <p>Total Commits: {userData.totalCommits}</p>
          <p>Commits in Past Year: {userData.recentCommits}</p>
          <a href={userData.html_url} target="_blank" rel="noopener noreferrer">
            View Profile
          </a>
        </div>
      )}
    </div>
  );
}
