import { ApiRequestError, createApiRequestError } from "./http";
import type { TodoQuery } from "./todo";

const BACKEND_UNAVAILABLE_MESSAGE =
  "백엔드 서버에 연결할 수 없습니다. FastAPI 서버가 실행 중인지 확인해주세요.";
const BACKEND_URL_MISSING_MESSAGE =
  "환경변수 BACKEND_URL이 설정되어 있지 않습니다. frontend/.env.local을 확인해주세요.";

// FastAPI가 실패 응답을 보냈을 때 status와 원본 detail을 함께 보존합니다.
// 화면에서는 message만 써도 되고, 디버깅이나 보고서 작성 때는 detail까지 확인할 수 있습니다.
export class BackendRequestError extends ApiRequestError {
  constructor(message: string, status: number, detail: unknown) {
    super(message, status, detail);
    this.name = "BackendRequestError";
    this.status = status;
    this.detail = detail;
  }
}

// BACKEND_URL은 서버에서만 사용하는 값입니다.
// Client Component는 이 값을 직접 읽지 않고, /api/todos 같은 Next.js API Route를 통해 접근합니다.
function getBackendUrl() {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    throw new BackendRequestError(BACKEND_URL_MISSING_MESSAGE, 500, {
      code: "BACKEND_URL_MISSING",
    });
  }

  return backendUrl.replace(/\/$/, "");
}

// Todo 목록 조회 조건을 FastAPI의 쿼리 문자열로 변환합니다.
// filter=all은 서버에 보내지 않아도 전체 조회와 같으므로 생략합니다.
export function buildTodosPath(query: TodoQuery = {}) {
  const searchParams = new URLSearchParams();

  if (query.date?.trim()) {
    searchParams.set("date", query.date.trim());
  }

  if (query.filter && query.filter !== "all") {
    searchParams.set("filter", query.filter);
  }

  if (query.search?.trim()) {
    searchParams.set("search", query.search.trim());
  }

  const queryString = searchParams.toString();

  return queryString ? `/todos?${queryString}` : "/todos";
}

// fetch 자체는 404/422/500에서도 예외를 던지지 않으므로 직접 실패 응답을 검사합니다.
async function assertOk(response: Response) {
  if (response.ok) {
    return;
  }

  const error = await createApiRequestError(response, {
    fallbackMessage: "백엔드 API 요청에 실패했습니다.",
  });

  throw new BackendRequestError(error.message, error.status, error.detail);
}

// Server Component, Server Action, Route Handler에서 공통으로 사용하는 FastAPI fetch 함수입니다.
// Todo 데이터는 항상 최신 서버 상태가 중요하므로 기본적으로 no-store를 사용합니다.
export async function fetchBackendResponse(path: string, init: RequestInit = {}) {
  try {
    return await fetch(`${getBackendUrl()}${path}`, {
      cache: "no-store",
      ...init,
    });
  } catch (error) {
    if (error instanceof BackendRequestError) {
      throw error;
    }

    throw new BackendRequestError(BACKEND_UNAVAILABLE_MESSAGE, 503, {
      code: "BACKEND_UNAVAILABLE",
      cause: error instanceof Error ? error.message : String(error),
    });
  }
}

// JSON 응답을 기대하는 요청에서 사용합니다.
// FastAPI의 실패 응답은 BackendRequestError로 통일해 상위 코드가 같은 방식으로 처리할 수 있게 합니다.
export async function fetchBackendJson<T>(path: string, init: RequestInit = {}) {
  const response = await fetchBackendResponse(path, init);

  await assertOk(response);

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// DELETE처럼 성공 시 응답 본문이 필요 없는 요청에서 사용합니다.
export async function fetchBackendNoContent(path: string, init: RequestInit = {}) {
  const response = await fetchBackendResponse(path, init);

  await assertOk(response);
}

// Next.js API Route가 FastAPI 응답을 클라이언트에 거의 그대로 전달할 때 사용합니다.
// 이렇게 두면 Client Component는 백엔드 주소나 CORS를 신경 쓰지 않고 /api 경로만 호출하면 됩니다.
export async function toProxyResponse(response: Response) {
  if (response.status === 204) {
    return new Response(null, { status: response.status });
  }

  const body = await response.text();
  const contentType = response.headers.get("content-type") ?? "application/json";

  return new Response(body, {
    status: response.status,
    headers: {
      "content-type": contentType,
    },
  });
}

// Route Handler 안에서 FastAPI 호출 자체가 실패했을 때 클라이언트가 읽을 수 있는 JSON 응답으로 바꿉니다.
// 이 처리가 없으면 브라우저에는 모호한 fetch failed 또는 HTML 에러 페이지가 전달될 수 있습니다.
export function toProxyErrorResponse(error: unknown) {
  if (error instanceof ApiRequestError) {
    return Response.json(
      {
        detail: error.message,
        status: error.status,
        backendDetail: error.detail,
      },
      { status: error.status },
    );
  }

  return Response.json(
    {
      detail: "알 수 없는 서버 오류가 발생했습니다.",
      status: 500,
    },
    { status: 500 },
  );
}
