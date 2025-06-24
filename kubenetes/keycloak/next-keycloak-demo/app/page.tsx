"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SessionBlock from "@/components/SessionBlock";

// Navbar Component
function Navbar({ username }: { username?: string }) {
  const router = useRouter();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#1e293b",
        color: "#fff",
        padding: "10px 24px",
        marginBottom: "20px",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
        🔒 Next.js + Keycloak
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span>สวัสดี, {username}</span>
        <button
          style={{
            padding: "6px 16px",
            background: "#f87171",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => router.push("/logout")}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // redirect ถ้าไม่ได้ login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (!session) return null;

  // decode role (browser only)
  let roles: string[] = [];
  if (session.accessToken) {
    try {
      const payload = JSON.parse(atob(session.accessToken.split(".")[1]));
      roles = payload?.realm_access?.roles ?? [];
    } catch (e) {
      // ignore
      console.log(e);
    }
  }

  return (
    <div>
      <Navbar username={session.user?.name || session.user?.email || "User"} />

      <main style={{ padding: "24px" }}>
        <h2>ยินดีต้อนรับ, {session.user?.name || session.user?.email}</h2>
        <h3>Role ของคุณ:</h3>
        <ul>
          {roles.length > 0 ? (
            roles.map((r) => <li key={r}>{r}</li>)
          ) : (
            <li>ไม่พบ role</li>
          )}
        </ul>
        <h3>ข้อมูล session</h3>
          <SessionBlock session={session} />
      </main>
    </div>
  );
}
