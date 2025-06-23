"use client";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

// ตั้งค่า URL ให้ตรงกับ Keycloak ของคุณ
const KEYCLOAK_LOGOUT_URL = process.env.NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL!;

export default function LogoutPage() {
  useEffect(() => {
    // 1. Logout ฝั่ง NextAuth (ลบ session ของ Next.js)
    signOut({ redirect: false }).then(() => {
      // 2. Redirect ไป Keycloak SSO Logout (ลบ session SSO)
      window.location.href = KEYCLOAK_LOGOUT_URL;
    });
  }, []);

  return <div>กำลัง logout...</div>; 
}
