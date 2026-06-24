import { type NextRequest } from "next/server";
import { createProxyJsonRequestInit, proxyBackendRequest } from "../../lib/api/proxy";

// Client Component에서 /api/todos로 요청하면 이 Route Handler가 FastAPI /todos로 전달합니다.
// 쿼리 문자열은 그대로 넘겨 서버 기반 필터링과 검색 조건을 유지합니다.
export async function GET(request: NextRequest) {
  return proxyBackendRequest(`/todos${request.nextUrl.search}`);
}

// Todo 생성 요청도 브라우저가 FastAPI를 직접 호출하지 않고 Next.js 서버를 거치게 합니다.
// 이 구조 덕분에 백엔드 실제 주소는 서버 환경변수로 숨길 수 있습니다.
export async function POST(request: NextRequest) {
  return proxyBackendRequest(
    "/todos",
    await createProxyJsonRequestInit(request, { method: "POST" }),
  );
}
