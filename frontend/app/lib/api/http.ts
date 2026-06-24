export const JSON_HEADERS = {
  "Content-Type": "application/json",
} as const;

type FastApiValidationError = {
  msg?: string;
};

type ErrorMessageOptions = {
  fallbackMessage?: string;
};

// HTTP 실패 응답의 status와 원본 detail을 함께 보존합니다.
// 화면에는 message만 보여주고, 필요하면 detail로 실제 응답 내용을 추적할 수 있습니다.
export class ApiRequestError extends Error {
  status: number;
  detail: unknown;

  constructor(message: string, status: number, detail: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.detail = detail;
  }
}

function getDetailMessage(detail: unknown) {
  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item: FastApiValidationError) => item.msg)
      .filter(Boolean);

    return messages.length > 0 ? messages.join(" ") : "";
  }

  return "";
}

export function getResponseErrorMessage(
  status: number,
  detail: unknown,
  { fallbackMessage = "요청을 처리하지 못했습니다." }: ErrorMessageOptions = {},
) {
  const detailMessage =
    typeof detail === "object" && detail !== null && "detail" in detail
      ? getDetailMessage(detail.detail)
      : getDetailMessage(detail);

  if (detailMessage) {
    return detailMessage;
  }

  if (status === 404) {
    return "요청한 Todo를 찾을 수 없습니다.";
  }

  if (status === 422) {
    return "입력값을 확인해주세요.";
  }

  if (status === 503) {
    return "백엔드 서버에 연결할 수 없습니다. FastAPI 서버가 실행 중인지 확인해주세요.";
  }

  if (status >= 500) {
    return "백엔드 서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  return fallbackMessage;
}

// 204 No Content나 빈 JSON 응답처럼 본문이 없을 수도 있어 text를 먼저 읽습니다.
// content-type이 JSON이어도 비어 있거나 깨진 본문이면 파싱 예외 대신 원문을 보존합니다.
export async function readResponseBody(response: Response) {
  const contentType = response.headers.get("content-type");
  const text = await response.text();

  if (!text) {
    return null;
  }

  if (!contentType?.includes("application/json")) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function createApiRequestError(
  response: Response,
  options: ErrorMessageOptions = {},
) {
  const detail = await readResponseBody(response);
  const message = getResponseErrorMessage(response.status, detail, options);

  return new ApiRequestError(message, response.status, detail);
}
