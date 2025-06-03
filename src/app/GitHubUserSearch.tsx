"use client";

import React, { useState } from "react";
import axios from "axios";

interface Repository {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
}

interface UserResult {
  login: string;
}

const GitHubUserSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserResult[]>([]);
  const [repos, setRepos] = useState<Record<string, Repository[]>>({});
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchUsers = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://api.github.com/search/users?q=${query}`
      );
      setUsers(response.data.items);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRepos = async (username: string) => {
    if (repos[username]) return;
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}/repos`
      );
      setRepos((prev) => ({ ...prev, [username]: response.data }));
    } catch (err) {
      setError(`Failed to fetch repos for ${username}`);
    }
  };

  const handleAccordionChange = (username: string) => {
    if (expandedUser === username) {
      setExpandedUser(null);
    } else {
      setExpandedUser(username);
      fetchRepos(username);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <input
        type="text"
        placeholder="Enter username"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && searchUsers()}
        className="w-full border rounded px-3 py-2"
      />
      <button
        onClick={searchUsers}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {users.length > 0 && (
        <p>
          Showing users for <strong>"{query}"</strong>
        </p>
      )}

      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.login} className="border rounded">
            <button
              onClick={() => handleAccordionChange(user.login)}
              className="w-full px-4 py-2 bg-gray-100 text-black text-left flex justify-between items-center"
            >
              {user.login}
              <span>{expandedUser === user.login ? "▲" : "▼"}</span>
            </button>
            {expandedUser === user.login && (
              <div className="space-y-2 p-2">
                {repos[user.login]?.length > 0 ? (
                  repos[user.login].map((repo) => (
                    <div
                      key={repo.id}
                      className="bg-gray-100 p-4 rounded flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-black">{repo.name}</p>
                        <p className="text-sm text-black">
                          {repo.description || "No description"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-black">{repo.stargazers_count}</p>
                        <span>⭐</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Loading repositories...</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GitHubUserSearch;
