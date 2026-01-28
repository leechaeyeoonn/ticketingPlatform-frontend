## Frontend Setup

### Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Axios
- Zustand
- MSW

### Requirements

- Node.js **18 이상**
- Package Manager: **Yarn 사용**

---

### 1. Node.js 버전 확인

```bash
node -v
```

### 2. Yarn 활성화

```bash
corepack enable
yarn -v
```

### 3. Vite (React + TypeScript) 프로젝트 생성

```bash
yarn create vite 프로젝트명 --template react-ts
cd react-frontend
yarn install
```

### 4. 주요 라이브러리 설치

```bash
yarn add axios
yarn add react-router-dom
yarn add zustand
```

### 5. Tailwind CSS 설치

```bash
yarn add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 5-1. src/index.css에 아래 내용 추가

```bash
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 6. 실행

```bash
yarn dev
```
