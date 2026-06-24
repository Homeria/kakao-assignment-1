# Kakao Assignment 3 Todo App

Next.js App Router와 FastAPI를 연동해 구현한 날짜 기반 Todo 앱입니다.

2차 과제의 React(Vite) Todo 앱에서 날짜별 Todo 관리, 주간 뷰, 상태 필터를 이어받고, localStorage 저장 방식은 FastAPI와 SQLite 기반 서버 저장 방식으로 전환했습니다.

## 프로젝트 구조

```text
kakao-assignment-1/
  frontend/   # Next.js App Router 프론트엔드
  backend/    # FastAPI + SQLite 백엔드
  docs/       # 과제 조건, 작업 계획, 검증 결과, 보고서
```

## 주요 기능

- 날짜별 Todo 생성, 조회, 수정, 삭제
- Todo 완료 상태 토글
- 월요일부터 일요일까지의 주간 날짜 선택
- 선택 날짜 기준 Todo 목록 조회
- URL 쿼리 기반 필터링과 검색
- FastAPI 서버 기반 필터링과 검색
- 백엔드 연결 실패 상황에 대한 안내 UI

## 실행 준비

프론트엔드와 백엔드는 각각 환경변수 파일이 필요합니다.

```powershell
Copy-Item frontend\.env.local.example frontend\.env.local
Copy-Item backend\.env.local.example backend\.env.local
```

기본값은 아래와 같습니다.

```text
# frontend/.env.local
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=/api

# backend/.env.local
DATABASE_URL=sqlite:///./todos.db
```

`BACKEND_URL`은 Next.js 서버에서 FastAPI를 호출할 때 사용합니다. 브라우저에서 직접 FastAPI를 호출하지 않고 `/api` 경로의 Next.js API Route를 거칩니다.

## 백엔드 실행

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

확인 주소:

```text
http://localhost:8000
http://localhost:8000/health
http://localhost:8000/docs
```

SQLite DB 파일은 `backend/todos.db`로 생성되며 Git 추적 대상에서 제외됩니다.

## 프론트엔드 실행

새 터미널에서 실행합니다.

```powershell
cd frontend
npm install
npm.cmd run dev
```

확인 주소:

```text
http://localhost:3000
```

루트 경로(`/`)로 접속하면 `/todos`로 이동합니다.

## 요청 흐름

```text
Client Component
  -> /api/todos
  -> Next.js Route Handler
  -> FastAPI /todos
  -> SQLite
```

Server Component에서 목록이나 상세 데이터를 조회할 때는 `app/actions.ts`의 서버 함수가 FastAPI를 직접 호출합니다.

## 검증 명령어

프론트엔드:

```powershell
cd frontend
npm.cmd run lint
npm.cmd run build
```

백엔드:

```powershell
cd backend
.\venv\Scripts\python.exe -m py_compile main.py
```

## 참고

- `.env.local`, `node_modules`, `.next`, `venv`, `todos.db`는 Git에 포함하지 않습니다.
- Swagger UI에서 API를 직접 테스트할 수 있습니다.
- 백엔드 서버가 꺼져 있으면 Todo 화면에 연결 실패 안내가 표시됩니다.
