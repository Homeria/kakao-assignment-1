# Frontend

Next.js App Router 기반 Todo 프론트엔드입니다.

## 실행 준비

```powershell
Copy-Item .env.local.example .env.local
npm install
```

`frontend/.env.local` 기본값:

```text
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=/api
```

- `BACKEND_URL`: Next.js 서버에서 FastAPI를 호출할 때 사용합니다.
- `NEXT_PUBLIC_API_URL`: Client Component가 Next.js API Route를 호출할 때 사용합니다. 같은 앱의 `/api` 경로를 기본으로 둡니다.

## 개발 서버 실행

```powershell
npm.cmd run dev
```

기본 주소:

```text
http://localhost:3000
```

## 주요 경로

```text
/todos            Todo 목록
/todos/new        Todo 생성
/todos/[todoId]   Todo 수정
/api/todos        FastAPI 프록시
```

## 검증

```powershell
npm.cmd run lint
npm.cmd run build
```

## 구조

```text
app/
  api/          Next.js Route Handler
  components/   화면 컴포넌트
  lib/          API, 날짜, URL, Todo 유틸
  todos/        Todo 페이지 라우트
  actions.ts    Server Component용 서버 함수
```
