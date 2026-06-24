import { createApiRequestError } from "./http";

function getClientApiBase() {
  return (process.env.NEXT_PUBLIC_API_URL ?? "/api").replace(/\/$/, "");
}

// Client Component에서 FastAPI를 직접 호출하지 않고 Next.js API Route를 호출하기 위한 유틸입니다.
// NEXT_PUBLIC_API_URL이 없으면 같은 앱의 /api 경로를 기본값으로 사용합니다.
export async function requestClientApi<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${getClientApiBase()}${path}`, init);

  if (!response.ok) {
    throw await createApiRequestError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
