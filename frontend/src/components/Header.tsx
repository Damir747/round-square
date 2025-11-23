import { useEffect, useState } from "react";

export default function Header() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUsername(data.user.username);
      })
      .catch(() => setUsername(null));
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:3001/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/";
  };

  return (
    <header
      style={{ display: "flex", justifyContent: "space-between", padding: 10 }}
    >
      <div>{username ? `Logged in as ${username}` : "Not logged in"}</div>
      {username && <button onClick={handleLogout}>Logout</button>}
    </header>
  );
}
