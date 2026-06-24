function getClientApiBase() {
  return (process.env.NEXT_PUBLIC_API_URL ?? "/api").replace(/\/$/, "");
}

async function readErrorMessage(response: Response) {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    if (response.status === 404) {
      return "요청한 Todo를 찾을 수 없습니다.";
    }

    if (response.status === 503) {
      return "백엔드 서버에 연결할 수 없습니다. FastAPI 서버가 실행 중인지 확인해주세요.";
    }

    return "요청을 처리하지 못했습니다.";
  }

  const body = await response.json();

  if (typeof body?.detail === "string") {
    return body.detail;
  }

  if (Array.isArray(body?.detail)) {
    return body.detail
      .map((item: { msg?: string }) => item.msg)
      .filter(Boolean)
      .join(" ");
  }

  if (response.status === 503) {
    return "백엔드 서버에 연결할 수 없습니다. FastAPI 서버가 실행 중인지 확인해주세요.";
  }

  return "요청을 처리하지 못했습니다.";
}

// Client Component에서 FastAPI를 직접 호출하지 않고 Next.js API Route를 호출하기 위한 유틸입니다.
// NEXT_PUBLIC_API_URL이 없으면 같은 앱의 /api 경로를 기본값으로 사용합니다.
export async function requestClientApi<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${getClientApiBase()}${path}`, init);

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
