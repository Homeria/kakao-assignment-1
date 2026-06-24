import { type NextRequest } from "next/server";
import { createProxyJsonRequestInit, proxyBackendRequest } from "../../../lib/proxy";

type RouteContext = {
  params: Promise<{
    todoId: string;
  }>;
};

// Todo 수정 페이지나 클라이언트 상세 조회가 필요할 때 단일 Todo를 백엔드에서 가져옵니다.
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { todoId } = await params;

  return proxyBackendRequest(`/todos/${encodeURIComponent(todoId)}`);
}

// 클라이언트의 수정 요청을 FastAPI PUT /todos/{id}로 전달합니다.
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { todoId } = await params;

  return proxyBackendRequest(
    `/todos/${encodeURIComponent(todoId)}`,
    await createProxyJsonRequestInit(request, { method: "PUT" }),
  );
}

// 클라이언트의 삭제 요청을 FastAPI DELETE /todos/{id}로 전달합니다.
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { todoId } = await params;

  return proxyBackendRequest(`/todos/${encodeURIComponent(todoId)}`, {
    method: "DELETE",
  });
}
