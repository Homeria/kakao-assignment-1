import { type NextRequest } from "next/server";
import { fetchBackendResponse, toProxyResponse } from "../../../lib/api";

type RouteContext = {
  params: Promise<{
    todoId: string;
  }>;
};

// Todo 수정 페이지나 클라이언트 상세 조회가 필요할 때 단일 Todo를 백엔드에서 가져옵니다.
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { todoId } = await params;
  const response = await fetchBackendResponse(`/todos/${encodeURIComponent(todoId)}`);

  return toProxyResponse(response);
}

// 클라이언트의 수정 요청을 FastAPI PUT /todos/{id}로 전달합니다.
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { todoId } = await params;
  const response = await fetchBackendResponse(`/todos/${encodeURIComponent(todoId)}`, {
    method: "PUT",
    headers: {
      "Content-Type": request.headers.get("content-type") ?? "application/json",
    },
    body: await request.text(),
  });

  return toProxyResponse(response);
}

// 클라이언트의 삭제 요청을 FastAPI DELETE /todos/{id}로 전달합니다.
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { todoId } = await params;
  const response = await fetchBackendResponse(`/todos/${encodeURIComponent(todoId)}`, {
    method: "DELETE",
  });

  return toProxyResponse(response);
}
