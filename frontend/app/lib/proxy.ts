import { type NextRequest } from "next/server";
import { fetchBackendResponse, toProxyErrorResponse, toProxyResponse } from "./api";

type ProxyJsonRequestOptions = {
  method: "POST" | "PUT";
};

// Route Handler에서 FastAPI로 요청을 넘길 때 반복되는 try/catch와 응답 변환을 한곳에 모읍니다.
// 각 route 파일은 어떤 backend path와 method를 쓰는지만 드러내도록 유지합니다.
export async function proxyBackendRequest(path: string, init: RequestInit = {}) {
  try {
    const response = await fetchBackendResponse(path, init);

    return toProxyResponse(response);
  } catch (error) {
    return toProxyErrorResponse(error);
  }
}

export async function createProxyJsonRequestInit(
  request: NextRequest,
  { method }: ProxyJsonRequestOptions,
) {
  return {
    method,
    headers: {
      "Content-Type": request.headers.get("content-type") ?? "application/json",
    },
    body: await request.text(),
  };
}
