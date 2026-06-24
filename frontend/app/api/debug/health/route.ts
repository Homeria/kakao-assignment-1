import { proxyBackendRequest } from "../../../lib/api/proxy";

// 디버그 패널에서 백엔드 연결 상태를 확인할 때 사용하는 health 프록시입니다.
// 브라우저가 FastAPI 주소를 직접 알 필요 없이 기존 Next.js API Route 흐름을 재사용합니다.
export async function GET() {
  return proxyBackendRequest("/health");
}
