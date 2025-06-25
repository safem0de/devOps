### 1.New Project
```bash
npx create-next-app@latest --typescript next-keycloak-demo
cd next-keycloak-demo
```

### 2.Install Dependencies
```bash
npm install next-auth
```

### 3.สร้าง Route Handler สำหรับ Auth
/app/api/auth/[...nextauth]/route.ts

### 4.สร้างหน้า Login / Logout / Homepage
/app/page.tsx
/app/login/page.tsx
/app/logout/page.tsx

### 5.กำหนด ENV
.env.local

### 6.สร้าง session ฝั่ง Backend (API route protected)
/app/api/protected/route.ts

### 7.สร้าง providers.tsx สำหรับรวม Provider ต่าง ๆ
/app/providers.tsx

### 8.ครอบ Provider ใน layout
/app/layout.tsx


### Clone this project
```bash
npm i
npm run dev
```