import type { TodoQuery } from "./todo";

// FastAPI가 실패 응답을 보냈을 때 status와 원본 detail을 함께 보존합니다.
// 화면에서는 message만 써도 되고, 디버깅이나 보고서 작성 때는 detail까지 확인할 수 있습니다.
export class BackendRequestError extends Error {
  status: number;
  detail: unknown;

  constructor(message: string, status: number, detail: unknown) {
    super(message);
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
    throw new Error("BACKEND_URL 환경변수가 설정되어 있지 않습니다.");
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

// 204 No Content 응답처럼 JSON 본문이 없는 경우도 있어 content-type을 먼저 확인합니다.
async function readResponseBody(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

// fetch 자체는 404/422/500에서도 예외를 던지지 않으므로 직접 실패 응답을 검사합니다.
async function assertOk(response: Response) {
  if (response.ok) {
    return;
  }

  const detail = await readResponseBody(response);
  const message =
    typeof detail === "object" && detail !== null && "detail" in detail
      ? String(detail.detail)
      : "백엔드 API 요청에 실패했습니다.";

  throw new BackendRequestError(message, response.status, detail);
}

// Server Component, Server Action, Route Handler에서 공통으로 사용하는 FastAPI fetch 함수입니다.
// Todo 데이터는 항상 최신 서버 상태가 중요하므로 기본적으로 no-store를 사용합니다.
export async function fetchBackendResponse(path: string, init: RequestInit = {}) {
  return fetch(`${getBackendUrl()}${path}`, {
    cache: "no-store",
    ...init,
  });
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
