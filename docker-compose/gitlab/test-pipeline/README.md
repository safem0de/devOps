## How to create POC project

### create poc project
```bash
cd test-pipeline
npx create-next-app@latest nextjs-poc --typescript --eslint --no-tailwind --app --src-dir --import-alias "@/*"
```
---
### create test (jest)
```bash
cd nextjs-poc
npm i -D babel-jest @babel/preset-env @babel/preset-react @babel/preset-typescript
```
babel.config.js
```bash
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
};
```
jest.config.js
```bash
/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
};

module.exports = config;
```
jest.setup.ts
```bash
import "@testing-library/jest-dom";
```
package.json
```bash
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "test": "jest" // <--- เพิ่มบรรทัดนี้เข้าไป
}
```
tsconfig.json
```bash
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "types": ["@types/jest"]   // 👈 เพิ่มบรรทัดนี้
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "**/*.test.tsx"], 
  "exclude": ["node_modules"]
}
```
src/app/page.tsx
```bash
export default function Page() {
  return (
    <main>
      <h1>Hello Next.js 🚀</h1>
      <p>POC CI/CD with GitLab + Docker + Rancher</p>
    </main>
  );
}
```
สร้างไฟล์เล็ก ๆ ลองก่อน:
src/app/page.test.tsx
```bash
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Page component", () => {
  it("renders hello text", () => {
    render(<Page />);
    expect(screen.getByText("Hello Next.js 🚀")).toBeInTheDocument();
  });
});
```
ลบ cache ของ Jest (กันมันค้าง config เก่า)
run
```bash
npx jest --clearCache
npm test
```
