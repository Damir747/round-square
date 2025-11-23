const BASE_URL = "http://localhost:3001";

export async function login(username: string, password: string) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) return { error: data.error || "Ошибка" };
    return { ok: true };
  } catch (err) {
    return { error: "Ошибка соединения с сервером" };
  }
}

export async function me() {
  const res = await fetch("/me", { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
}

export async function logout() {
  await fetch("/logout", { method: "POST", credentials: "include" });
}
