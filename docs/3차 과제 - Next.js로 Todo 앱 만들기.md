<aside>
📌

**목차**

</aside>

!ezgif.com-speed (1).gif.gif)

# Next.js로 Todo 앱 만들기

---

- 한 줄 소개 : Todo 앱을 Next.js로 만들어 보는 과제예요.
- 최종 프로젝트 바로가기 : https://github.com/elice-ai-training/kakaotech.campus_assignment3
- 과제 목표 :
    - React(Vite) 기반 Todo 앱을 Next.js App Router 구조로 다시 만들어 보며, 파일 기반 라우팅(`page.tsx`, `layout.tsx` 등)의 동작 방식을 이해할 수 있다
    - Server Component와 Client Component의 차이를 이해하고, 역할에 맞게 구분해서 적용할 수 있다
    - FastAPI로 Todo CRUD API를 직접 구현하고, Next.js에서 `route.ts`를 통해 연동하는 풀스택 흐름을 경험할 수 있다
    - 로컬스토리지 기반 상태 관리에서 서버 API 기반 데이터 흐름으로 전환하며, 두 방식의 차이를 설명할 수 있다
    - 환경변수로 API 엔드포인트 등 민감한 값을 분리해 관리할 수 있다
    - AI를 단순 코드 생성 도구가 아닌 구현 보조 수단으로 활용하며, 직접 작성한 코드를 설명하고 개선할 수 있다
- **제출 일정 : 6/24(수) 23:59까지**

# 개발 가이드

---

### 활용 스택

| Frontend | Backend |
| --- | --- |
| Next.js (v15+) | FastAPI (v0.111+) |
| React (v18+) | Uvicorn |
| TypeScript (v5) | SQLAlchemy |
| Tailwind CSS (v4) | SQLite |
| Axios  | Pydantic (v2) |

### 과제 준비

- 과제를 하며 사용할 AI 도구(Claude, ChatGPT 등) 계정이 필요해요. 어떤 툴을 사용하더라도 상관없습니다.

### 과제 진행 순서

모든 기능은 아래 흐름으로 진행해요. 

1. Next와 Tailwind를 직접 세팅해요
2. 기능 단위로 직접 구현해요. 막히는 부분은 AI에게 힌트를 요청해요
3. 브라우저에서 직접 열어 의도한 대로 동작하는지 확인해요
4. 원하는 대로 동작하지 않거나 개선하고 싶은 부분은 AI에게 추가로 요청해요
5. 다음 문서를 확인하고, **Issue 템플릿에 맞추어** 기능 단위 별로 진행한 태스크를 기록하며 진행해요
    
    **👉 Issue 템플릿 확인하러 가기**
    

# 기본 미션

이번 과제에서 **반드시** 진행해야 하는 항목이예요. 아래의 순서대로 하나씩 진행해봅시다.

---

### **0. 전체 구조 잡기**

- Next.js 프로젝트를 생성해요.
- 프론트엔드와 백엔드 디렉토리를 구분하여 생성해요.
- 디렉토리 별 파일 구성은 아래를 참고해주세요. 지금은 ***디렉토리 구조가 이렇구나*** 정도만 이해하고 있으면 됩니다. 앞으로 하나씩 추가할 예정이에요.
    - **[참고] 프로젝트 구조 살펴보기**
        
        App Router 기반의 Next.js 프론트엔드와 FastAPI 백엔드가 완전히 분리된 구조예요. 프론트는 `app/` 안의 파일 구조가 URL이 되고, `route.ts`가 백엔드 프록시 역할을 해요. 백엔드는 이번 과제에서 `main.py` 단일 파일로 모든 로직을 담지만, 실무에서는 역할별로 파일을 분리해요.
        
        ```markdown
        kakao-assignment-3/
        ├── frontend/
        │   ├── app/
        │   │   ├── api/
        │   │   │   └── todos/
        │   │   │       └── route.ts       # API Route (백엔드 프록시)
        │   │   ├── todos/
        │   │   │   ├── [todoId]/
        │   │   │   │   └── page.tsx       # Todo 수정 페이지
        │   │   │   ├── new/
        │   │   │   │   └── page.tsx       # Todo 생성 페이지
        │   │   │   ├── error.tsx
        │   │   │   ├── loading.tsx
        │   │   │   └── page.tsx           # Todo 목록 페이지
        │   │   ├── actions.ts             # Server Actions (CRUD 로직)
        │   │   ├── globals.css
        │   │   ├── layout.tsx
        │   │   └── page.tsx               # 루트 페이지
        │   ├── .env.local
        │   ├── .gitignore
        │   ├── next-env.d.ts
        │   ├── next.config.mjs
        │   ├── postcss.config.mjs
        │   ├── package.json
        │   ├── tsconfig.json
        │   └── README.md
        │
        └── backend/
            ├── main.py                    # FastAPI 앱 + 모든 로직 (라우터, DB, 모델, 스키마)
            ├── requirements.txt
            └── .env.local
        ```
        
    - **프로젝트 생성하기**
        
        ```markdown
        # 루트 디렉토리 생성
        mkdir kakao-assignment-3 && cd kakao-assignment-3
        
        # 프론트엔드 디렉토리 생성 (Next.js 세팅은 1번 미션에서 진행)
        npx create-next-app@latest frontend
        
        # 백엔드 디렉토리 생성
        mkdir backend
        ```
        
- 2차 과제 코드를 기반으로 어떤 기능을 Next.js로 옮길지, 어떤 기능을 FastAPI로 분리할지 직접 정리해요

<aside>
💡

**시작 전 생각해보기**

2차 과제에서는 로컬스토리지로 데이터를 저장했어요. 이번엔 FastAPI 서버가 데이터를 관리해요. 그렇다면 기존에 프론트엔드가 하던 일 중 어떤 것이 백엔드로 넘어가야 할까요? 각 기능을 프론트/백엔드 중 어디에 둘지 먼저 정리해보세요.

</aside>

<aside>
🔎

**확인 포인트**

- 프로젝트 디렉토리 구조가 `app/`, 기반으로 잡혀 있나요?
- FastAPI 디렉토리와 Next.js 디렉토리가 명확히 분리되어 있나요?
- 2차 과제의 어떤 기능이 프론트에 남고, 어떤 기능이 백엔드로 넘어가는지 정리해봤나요?
</aside>

### **1. 프론트엔드 프로젝트 세팅하기**

Next.js 프로젝트를 생성하고, `localhost:3000`에 접속해 화면을 확인해봅니다.

- **프로젝트 생성하기**
    
    터미널에 아래의 커맨드를 입력한 후, 프로젝트 구성 옵션을 차근차근 선택해봅니다.
    
    ```bash
    # frontend/ 디렉토리로 이동
    cd frontend
    
    # 의존성 설치
    npm install
    
    # 개발 서버 실행
    npm run dev
    ```
    
    ```markdown
    # 프로젝트 생성 시 선택 옵션
    
    TypeScript → Yes
    ESLint → Yes
    Tailwind CSS → Yes
    src/ directory → No
    App Router → Yes
    Turbopack → No
    import alias → No
    ```
    

<aside>
🔎

**확인 포인트**

- 생성된 디렉토리 구조에서 `app/` 디렉토리가 보이나요? `pages/` 디렉토리가 없는 것이 App Router 구조예요.
- `localhost:3000`에 접속했을 때 Next.js 기본 화면이 보이면 성공이에요.
    
    !스크린샷 2026-05-18 오후 1.29.51.png
    
</aside>

<aside>
📝

**2차 과제와 비교해보세요**

2차 과제에서는 `npm create vite@latest`로 시작했고 `src/` 디렉토리 안에 컴포넌트를 뒀어요. Next.js에서는 `app/` 디렉토리가 그 역할을 대신하고, 파일 위치 자체가 URL 경로가 돼요.

</aside>

### **2. 백엔드 프로젝트 세팅하기**

- FastAPI 프로젝트를 생성하고, `localhost:8000`에 접속해 서버를 확인해요
- **프로젝트 생성하기**
    
    `backend` 디렉토리에서 `requirements.txt` 파일을 아래와 같이 미리 만들어두고, 다음 커맨드를 순서대로 실행하세요.
    
    ```bash
    # backend/ 디렉토리로 이동
    cd backend
    
    # 가상환경 생성
    python -m venv .venv
    
    # 가상환경 활성화
    source .venv/bin/activate        # Mac/Linux
    .venv\Scripts\activate           # Windows
    ```
    
    ```python
    # backend 디렉토리 하위에서 requirements.txt 파일 생성
    touch requirements.txt
    
    # requirements.txt 파일 내용 업데이트하기
    fastapi>=0.111.0
    uvicorn[standard]>=0.29.0
    sqlalchemy>=2.0.0
    pydantic>=2.0.0
    
    # 패키지 설치
    pip install -r requirements.txt
    ```
    
    ```python
    # backend 디렉토리 하위에서 main.py 파일 생성
    touch main.py
    
    # main.py 파일 내용 업데이트
    from fastapi import FastAPI
    
    app = FastAPI()
    
    @app.get("/")
    def root():
        return {"message": "Hello World"}
    ```
    
    ```python
    # 개발 서버 실행
    uvicorn main:app --reload
    ```
    

<aside>
🔎

**확인 포인트**

- `localhost:8000`에 접속했을 때 아래와 같이 `{"message": "Hello World"}` 같은 JSON 응답이 보이면 성공이에요
    
    !스크린샷 2026-05-18 오후 1.41.07.png
    
- `localhost:8000/docs`에 접속하면 FastAPI가 자동으로 생성한 API 문서를 확인할 수 있어요
    
    !스크린샷 2026-05-18 오후 1.41.56.png
    
- 터미널에 가상환경이 활성화되어 있나요? (`(.venv)` 표시 확인)
</aside>

<aside>
📝

**2차 과제와 비교해보세요**

2차 과제에서는 로컬스토리지에서만 데이터를 다뤘어요. 이번엔 FastAPI 서버가 데이터를 직접 관리하고, 프론트엔드는 API를 통해 데이터를 주고받아요.

</aside>

### **3. FastAPI로 Todo CRUD API 구현하기**

<aside>
💡

**시작 전 생각해보기**

FastAPI에서는 Todo 데이터를 어떤 형태로 정의해야 할까요? DB에 저장할 모델과 API 요청/응답에 사용할 스키마를 어떻게 구성할 지 생각해보세요.

</aside>

- 다음 `main.py`을 참고하여 Todo 데이터 모델, DB 설정, CRUD 엔드포인트를 구현해요
    - **[참고] main.py**
        
        ```python
        from fastapi import FastAPI
        from sqlalchemy import create_engine, Column, Integer, String, Boolean
        from sqlalchemy.ext.declarative import declarative_base
        from sqlalchemy.orm import sessionmaker
        from pydantic import BaseModel
        
        # DB 설정
        DATABASE_URL = "sqlite:///./todos.db"
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        Base = declarative_base()
        
        # DB 모델 (테이블 구조 정의)
        class Todo(Base):
            __tablename__ = "todos"
            id = Column(Integer, primary_key=True, index=True)
            # 나머지 필드를 직접 추가해보세요
        
        # Pydantic 스키마 (요청/응답 데이터 구조 정의)
        class TodoCreate(BaseModel):
            # 생성 시 필요한 필드를 직접 추가해보세요
            pass
        
        # 테이블 생성
        Base.metadata.create_all(bind=engine)
        
        # FastAPI 앱 생성
        app = FastAPI(title="Todo API")
        
        # FastAPI 앱 미들웨어 및 CORS 설정
        app.add_middleware(
            # 필요한 부분을 직접 작성해보세요.
        )
        
        # DB 세션 의존성
        def get_db():
            # 필요한 부분을 직접 작성해보세요.
            pass
        
        # 엔드포인트 구현
        # API 목록에 해당되는 부분을 직접 구현해보세요.
        ```
        
- 구현할 API 목록은 아래와 같아요
    
    
    | Method | URL | 설명 |
    | --- | --- | --- |
    | GET | `/todos` | 전체 Todo 목록 조회 |
    | POST | `/todos` | 새 Todo 생성 |
    | PUT | `/todos/{id}` | Todo 수정 |
    | DELETE | `/todos/{id}` | Todo 삭제 |

<aside>
🔎

**확인 포인트**

- `localhost:8000/docs`에서 각 엔드포인트가 정상적으로 보이나요?
- `todos.db` 파일이 `backend/` 디렉토리에 생성되었나요?
- 각 API를 직접 실행해봤을 때 의도한 대로 응답이 오나요?
- Todo를 생성한 뒤 목록 조회 시 데이터가 포함되어 있나요?
</aside>

### **4. Next.js에서 Todo 페이지 구현하기**

<aside>
💡

**시작 전 생각해보기**

각 페이지에서 어떤 부분이 Server Component이고, 어떤 부분이 Client Component여야 할까요? 예를 들어 목록 페이지에서 데이터를 불러오는 부분과 버튼 클릭 이벤트를 처리하는 부분은 각각 어디서 담당해야 할지 먼저 생각해보세요.

- 사용자 인터랙션(클릭, 입력)이 필요한 부분은 어디인가요?
- 데이터를 단순히 보여주기만 하는 부분은 어디인가요?
</aside>

- `app/todos/page.tsx`에 Todo 목록 페이지를 구현해요
- `app/todos/new/page.tsx`에 Todo 생성 페이지를 구현해요
- `app/todos/[todoId]/page.tsx`에 Todo 수정 페이지를 구현해요
- `app/todos/error.tsx`에 에러 발생 시 보여줄 화면을 구현해요
- `app/todos/loading.tsx`에 데이터 로딩 중 보여줄 화면을 구현해요
- 각 페이지에서 Server Component와 Client Component를 적절히 구분해요

<aside>
🔎

**확인 포인트**

- `localhost:3000/todos`에 접속했을 때 목록 페이지가 보이나요?
- `localhost:3000/todos/new`에 접속했을 때 생성 페이지가 보이나요?
- `"use client"` 선언이 필요한 컴포넌트와 필요하지 않은 컴포넌트를 구분할 수 있나요?
- `loading.tsx`와 `error.tsx`가 의도한 대로 동작하나요?
</aside>

<aside>
📝

**2차 과제와 비교해보세요**

2차 과제에서는 모든 컴포넌트가 클라이언트에서 실행됐어요. Next.js에서는 기본적으로 Server Component이고, 인터랙션이 필요한 경우에만 `"use client"`를 선언해요. 렌더링 위치가 달라지면 무엇이 좋아지는지 생각해보세요.

</aside>

### **5. API Route 작성하고 프론트-백엔드 연동하기**

<aside>
💡

**시작 전 생각해보기**

클라이언트 → `route.ts` → FastAPI 순서로 요청이 흘러가요. `route.ts`가 중간에 있는 이유가 뭘까요? 클라이언트에서 FastAPI로 직접 요청하면 안 되는 이유를 먼저 생각해보세요.

또한 `route.ts`와 `actions.ts`는 둘 다 서버에서 실행되지만 역할이 달라요. 아래 표를 참고해 어떤 코드를 어디에 작성해야 할지 먼저 파악해보세요.

|  | **route.ts** | **action.ts** |
| --- | --- | --- |
| 역할 | HTTP 요청을 받아 FastAPI로 전달하는 프록시 | 페이지/컴포넌트에서 직접 호출하는 서버 함수 |
| 호출 방식 | fetch('/api/todos') | import { createTodo } from '@/app/actions’ |
| 사용 위치 | 외부 HTTP 요청 처리 | Server/Client Component에서 직접 호출 |

예를 들어 Todo 목록을 불러오는 건 `actions.ts`에서 FastAPI를 직접 호출하고, 클라이언트에서 생성/수정/삭제 요청을 보낼 때는 `route.ts`를 거쳐 FastAPI로 전달돼요. 두 방식이 언제 사용되는지 구현하면서 직접 확인해보세요.

</aside>

- `route.ts`에 API Route를 작성해요
- `actions.ts`에 Server Action을 작성하고 각 페이지에서 호출해요
- 목록 조회, 생성, 수정, 삭제 전체 흐름 상 프론트와 백엔드가 연동되도록 구현해요

<aside>
🔎

**확인 포인트**

- Todo를 생성했을 때 FastAPI DB에 실제로 저장되나요?
- 목록 페이지에서 생성한 Todo가 바로 표시되나요?
- 수정, 삭제 후 목록이 올바르게 업데이트되나요?
- 브라우저 네트워크 탭에서 요청이 어떤 순서로 발생하는지 확인해봤나요?
</aside>

<aside>
📝

**2차 과제와 비교해보세요**

2차 과제에서는 `useEffect`로 로컬스토리지에서 데이터를 읽고 썼어요. 
이번엔 데이터가 서버에 있고, 요청을 통해서만 접근할 수 있어요. 데이터 흐름이 단방향에서 클라이언트-서버 왕복으로 바뀐 것을 확인해보세요.

</aside>

### **6. 환경변수 설정하기**

<aside>
💡

**시작 전 생각해보기**

지금까지 코드에 `http://localhost:8000`을 직접 입력했을 거예요. 이 값이 코드에 그대로 남아있으면 어떤 문제가 생길까요? 개발 환경과 배포 환경에서 URL이 달라진다면 어떻게 관리해야 할지 생각해보세요.

</aside>

- 프론트엔드의 `.env.local`에 백엔드 API URL을 환경변수로 분리해요
- 백엔드의 `.env.local`에 DB 설정 등 민감한 값을 환경변수로 분리해요
- 코드에 하드코딩된 URL이 없는지 확인해요

- **[예시] 환경변수 설정**
    
    ```markdown
    # frontend/.env.local
    NEXT_PUBLIC_API_URL=http://localhost:3000/api
    BACKEND_URL=http://localhost:8000
    
    # backend/.env.local 
    DATABASE_URL=sqlite:///./todos.db
    ```
    

<aside>
🔎

**확인 포인트**

- `.env.local`이 `.gitignore`에 포함되어 있나요?
- `NEXT_PUBLIC_` 접두사가 있는 변수와 없는 변수의 차이를 알고 있나요?
- 환경변수로 교체한 뒤에도 기능이 동일하게 동작하나요?
</aside>

<aside>
📝

**2차 과제와 비교해보세요**

2차 과제에서는 외부 서버와 통신하지 않았기 때문에 환경변수가 필요 없었어요. 프론트와 백엔드가 분리되는 순간부터 URL, 키 등 환경에 따라 달라지는 값은 반드시 환경변수로 관리해야 해요.

</aside>

# 도전 미션

필수 미션을 모두 클리어했다면, 조금 더 심화된 미션을 진행해봅니다. 도전 미션은 진행하지 않아도 괜찮습니다.

---

### **1. 서버 기반 상태별 필터링 구현하기**

<aside>
💡

**시작 전 생각해보기**

2차 과제에서는 `useState`로 필터 상태를 관리했어요. URL 파라미터로 관리하면 무엇이 달라질까요? `useSearchParams`와 `useState`의 차이를 먼저 생각해보세요.

</aside>

- 전체 / 진행 중 / 완료 필터 탭을 구현해요
- 필터 상태를 `?filter=active`, `?filter=completed` 형태의 URL 파라미터로 관리해요
- 페이지를 새로고침하거나 URL을 공유해도 필터 상태가 유지돼요
- FastAPI에 필터 조건을 쿼리 파라미터로 전달해 서버에서 필터링해요
    - 필터링은 클라이언트(브라우저)가 아닌 FastAPI 서버에서 처리돼요
    
    ```python
    클라이언트 → route.ts → FastAPI (/todos?filter=active) → DB 조회 → 필터링된 결과 반환
    ```
    
    | Method | URL | 설명 |
    | --- | --- | --- |
    | GET | `/todos?filter=active` | 진행 중 Todo 조회 |
    | GET | `/todos?filter=completed` | 완료 Todo 조회 |

<aside>
🔎

**확인 포인트**

- 필터 탭을 클릭했을 때 URL이 바뀌나요?
- URL을 직접 입력해도 해당 필터가 적용된 상태로 보이나요?
- 새 Todo를 추가했을 때 현재 필터가 유지되나요?
- 필터링이 클라이언트가 아닌 서버(FastAPI)에서 처리되고 있나요? (브라우저 네트워크 탭에서 확인 할 수 있어요)
</aside>

<aside>
📝

**2차 과제와 비교해보세요**

2차 과제에서는 필터 상태를 `useState`로만 관리했기 때문에 새로고침하면 초기화됐어요. URL 파라미터로 관리하면 상태가 URL에 저장되어 새로고침, 공유, 뒤로가기 모두에서 유지돼요.

</aside>

### **2. 서버 기반 Todo 검색 기능 구현하기**

<aside>
💡

**시작 전 생각해보기**

검색어가 바뀔 때마다 API를 호출하면 요청이 너무 많아질 수 있어요. 이를 어떻게 줄일 수 있을지 생각해보세요.

</aside>

- 키워드로 Todo 내용을 검색할 수 있는 검색창을 구현해요
- 검색어를 `?search=키워드` 형태의 URL 파라미터로 관리해요
- 필터링과 검색을 동시에 적용할 수 있어요 (`?filter=active&search=키워드`)
- FastAPI에 검색 엔드포인트를 추가하고, 서버에서 키워드로 필터링해요
    
    ```python
    클라이언트 → route.ts → FastAPI (/todos?search=키워드) → DB에서 키워드 포함된 항목 조회 → 결과 반환
    ```
    
    | Method | URL | 설명 |
    | --- | --- | --- |
    | GET | `/todos?search=키워드` | 키워드로 Todo 검색 |
    | GET | `/todos?filter=active&search=키워드` | 필터 + 검색 동시 적용 |

<aside>
🔎

**확인 포인트**

- 검색어를 입력했을 때 URL이 바뀌나요?
- 검색 결과가 서버에서 필터링되어 오나요? (브라우저 네트워크 탭에서 확인할 수 있어요)
- 필터 탭과 검색을 동시에 사용했을 때 두 조건이 모두 적용되나요?
- 검색어가 없을 때 전체 목록이 다시 표시되나요?
</aside>

<aside>
📝

**2차 과제와 비교해보세요**

2차 과제에서는 검색 기능이 없었어요. 단순히 클라이언트에서 배열을 필터링하는 것과 달리, 서버에서 DB를 직접 조회해 결과를 반환하는 방식이 어떻게 다른지 느껴보세요.

</aside>

# 트러블 슈팅

트러블 슈팅이란 개발 중 발생하는 오류나 예상치 못한 동작의 원인을 찾고 해결하는 과정이에요. 코드를 작성하다 보면 에러가 발생하거나 의도한 대로 동작하지 않는 상황은 매우 자연스러운 일이에요. 중요한 건 당황하지 않고 원인을 찾아가는 과정을 경험하는 거예요. 

이번 과제를 진행하면서 발생할 수 있는 이슈는 무엇이 있는지 미리 살펴보고 해결 팁을 확인해봅니다. 여기에 없는 이슈가 발생한 경우, AI 또는 구글에 검색해보는 습관을 가집시다!

---

### **Next.js에서 자주 발생하는 에러**

Next.js로 개발하다 보면 자주 마주치는 에러들을 모아봤어요. 에러 메시지가 낯설더라도 당황하지 말고, 원인과 해결 방법을 하나씩 확인해보세요.

**① CORS 에러**

<aside>
⚠️

Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' has been blocked by CORS policy

</aside>

클라이언트에서 FastAPI로 직접 요청할 때 발생해요. `route.ts`를 프록시로 사용하거나, FastAPI에 CORS 설정을 추가해요.

```python
# main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**② 환경변수가 undefined로 출력돼요**

<aside>
⚠️

TypeError: Failed to parse URL from undefined

</aside>

`NEXT_PUBLIC_` 접두사 여부와 사용 위치를 확인해요.

```tsx
// 클라이언트 컴포넌트에서 사용할 변수 → NEXT_PUBLIC_ 필요
NEXT_PUBLIC_API_URL=http://localhost:3000/api

// 서버에서만 사용할 변수 → NEXT_PUBLIC_ 불필요
BACKEND_URL=http://localhost:8000
```

환경변수를 추가하거나 수정했다면 반드시 개발 서버를 재시작해요.

```bash
npm run dev
```

**③ Server Component에서 이벤트 핸들러를 사용할 수 없어요**

<aside>
⚠️

Error: Event handlers cannot be passed to Client Component props

</aside>

`onClick`, `onChange` 등 이벤트 핸들러는 Client Component에서만 사용할 수 있어요. 해당 컴포넌트 상단에 `"use client"`를 선언해요.

```tsx
"use client"

export default function TodoForm() {
  return (
    <button onClick={() => console.log("clicked")}>추가</button>
  )
}
```

**④ useSearchParams() 관련 Suspense 에러**

<aside>
⚠️

Missing Suspense boundary with useSearchParams

</aside>

`useSearchParams()`를 사용하는 컴포넌트는 반드시 아래와 같이 `Suspense`로 감싸야 해요.

```tsx
import { Suspense } from "react"
import TodoFilter from "./TodoFilter"

export default function TodoPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <TodoFilter />
    </Suspense>
  )
}
```

---

### FastAPI에서 자주 발생하는 에러

**⑤ 가상환경이 활성화되지 않았어요**

<aside>
⚠️

ModuleNotFoundError: No module named 'fastapi’

</aside>

가상환경이 활성화되지 않은 상태에서 실행하면 발생해요. 터미널에 `(.venv)` 표시가 있는지 확인해요.

```bash
source .venv/bin/activate    # Mac/Linux
.venv\Scripts\activate       # Windows
```

**⑥ DB 테이블이 생성되지 않았어요**

<aside>
⚠️

OperationalError: no such table: todos

</aside>

`main.py`에서 테이블 생성 코드가 실행되지 않았을 때 발생해요.

```python
# main.py
Base.metadata.create_all(bind=engine)
```

---

### AI와 함께 디버깅하는 방법

1️⃣ **브라우저 콘솔 또는 터미널에서 에러 메시지 확인하기**
프론트 에러는 브라우저 콘솔, 백엔드 에러는 터미널에서 확인해요. 에러 메시지 전체와 파일명, 줄 번호를 복사해두세요.

2️⃣ **에러가 발생한 위치 파악하기**
프론트(Next.js)인지 백엔드(FastAPI)인지, 어느 파일의 몇 번째 줄인지 먼저 특정해요.

3️⃣ **AI에게 에러 메시지 + 코드 + 상황을 함께 전달하기**
에러 메시지만 전달하면 정확한 답을 받기 어려워요. 관련 코드와 어떤 동작을 했을 때 발생했는지 함께 전달해요.

4️⃣ **AI의 답변을 이해하고 직접 수정하기**
AI가 수정된 코드를 제시하더라도 바로 붙여넣지 말고, 왜 그렇게 수정해야 하는지 이해한 뒤 적용해요.

- **AI 디버깅 템플릿**
    
    ```
    아래 에러가 발생했어. 현재 코드를 보고 원인과 해결 방법을 알려줘.
    
    [에러 메시지]
    에러 메시지 붙여넣기
    
    [에러 발생 파일 - 파일명]
    코드 붙여넣기
    
    [현재 상황]
    어떤 동작을 했을 때 에러가 발생하는지 설명하기
    ```
    
- **AI 구현 도움 요청 템플릿**
    
    ```
    Next.js App Router에서 [구현하려는 기능]을 만들려고 해.
    현재까지 작성한 코드는 아래와 같아.
    [코드 붙여넣기]
    
    [막히는 부분을 구체적으로 설명]
    전체 코드를 작성해주기보다, 어떤 방향으로 접근하면 좋을지 힌트를 줘.
    ```
    

# 제출 전 최종 체크리스트

최종 제출 전에, 다음 체크리스트를 활용하여 빠진 것은 없는지 확인해봅시다.

---

### 기능 구현

- [ ]  필수 기능이 모두 구현되어 있다
- [ ]  필요에 따라, README.md에 구현한 기능에 대한 설명을 작성했다
- [ ]  예외 상황에서도 오류 없이 동작한다 (ex. 빈 입력값 제출, 데이터 없는 상태 등)
- [ ]  새로고침 후에도 데이터가 유지되거나 의도한 대로 초기화된다

### 코드 품질

- [ ]  불필요한 `console.log`, 주석 처리된 사용하지 않는 코드가 제거되어 있다
- [ ]  변수명과 함수명이 역할을 명확히 나타낸다
- [ ]  중복 코드가 없고, 반복되는 로직은 함수로 분리되어 있다
- [ ]  들여쓰기와 코드 포맷이 일관되게 유지되어 있다

### UI/UX

- [ ]  모든 기능이 UI 상에서 명확하게 인지 가능하다
- [ ]  빈 상태(데이터 없음)에 대한 화면 처리가 되어 있다

### 브라우저 검증

- [ ]  크롬 기준 콘솔에 에러가 없다
- [ ]  주요 기능을 직접 클릭하며 E2E 흐름을 확인했다

### 프로젝트 구조

- [ ]  파일과 디렉토리 구조가 정리되어 있다
- [ ]  불필요한 파일이 포함되어 있지 않다 (ex. node_modules, .DS_Store 등)