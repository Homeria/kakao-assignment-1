# Backend

FastAPI와 SQLite를 사용하는 Todo 백엔드입니다.

## 구조

```text
backend/
├─ app/
│  ├─ __init__.py
│  ├─ database.py
│  ├─ models.py
│  └─ schemas.py
├─ main.py
├─ requirements.txt
└─ README.md
```

- `main.py`: FastAPI app 설정, CORS 설정, root/health/Todo endpoint 정의
- `app/database.py`: 환경변수 로드, DB engine/session/Base/get_db 정의
- `app/models.py`: SQLAlchemy Todo 모델 정의
- `app/schemas.py`: Pydantic 요청/응답 스키마 정의

## 실행 준비

```powershell
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
Copy-Item .env.local.example .env.local
```

`backend/.env.local` 기본값:

```text
DATABASE_URL=sqlite:///./todos.db
```

## 개발 서버 실행

```powershell
uvicorn main:app --reload
```

확인 주소:

```text
http://localhost:8000
http://localhost:8000/health
http://localhost:8000/docs
```

## API

```text
GET    /todos
POST   /todos
GET    /todos/{todo_id}
PUT    /todos/{todo_id}
DELETE /todos/{todo_id}
```

`GET /todos`는 아래 쿼리 파라미터를 지원합니다.

```text
date=YYYY-MM-DD
filter=all | active | completed
search=검색어
```

## 검증

```powershell
.\venv\Scripts\python.exe -m py_compile main.py app\__init__.py app\database.py app\models.py app\schemas.py
```

## 참고

- `todos.db`는 로컬 실행 시 자동 생성됩니다.
- `venv`, `__pycache__`, `.env.local`, `todos.db`는 Git에 포함하지 않습니다.
