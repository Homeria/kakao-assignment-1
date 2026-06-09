# Kakao Tech Campus Todo App

Vanilla JS로 구현했던 Todo 앱을 React Function Component 구조로 마이그레이션한 과제입니다.

## 기술 스택

- React
- Vite
- Tailwind CSS v4
- JavaScript
- Web Storage API (`localStorage`)

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:5173
```

빌드와 린트 확인은 아래 명령으로 실행합니다.

```bash
npm run build
npm run lint
```

## 구현 기능

- Todo 생성, 조회, 수정, 삭제
- 빈 입력값 제출 방지와 안내 메시지 표시
- 완료 상태 토글과 완료 Todo 시각적 구분
- `prompt()`를 사용하지 않는 인라인 수정 UI
- 전체 / 진행 중 / 완료 필터링
- 일간 날짜 이동
- 선택 날짜별 Todo 분리 저장
- 월요일부터 일요일까지의 주간 뷰
- 주간 뷰 날짜 선택과 일간 뷰 연동
- 이전 주 / 다음 주 이동
- 날짜별 진행 중 Todo 개수 표시
- 오늘 날짜와 선택 날짜 시각적 구분
- localStorage 기반 Todo 데이터 유지
- 새로고침 후 선택 날짜와 주간 뷰 상태 유지
- 과제 검증용 디버그 상태 패널

## 프로젝트 구조

```text
src/
  components/
    date/
    debug/
    filter/
    todo/
  constants/
  hooks/
  repositories/
  services/
  utils/
```

## 계층 책임

- `components`: 화면 표시와 사용자 이벤트 전달
- `hooks`: React state와 저장소 계층 연결
- `services`: Todo 도메인 규칙과 순수 데이터 변환
- `repositories`: localStorage 입출력과 JSON 직렬화
- `utils`: 날짜 계산 유틸리티
- `constants`: 필터 값과 storage key 관리

## 데이터 저장 구조

Todo 데이터는 날짜별 객체 형태로 localStorage에 저장됩니다.

```js
{
  "2026-06-09": [
    {
      id: 1717900000000,
      text: "React Todo 구현하기",
      completed: false
    }
  ]
}
```

사용하는 localStorage key는 다음과 같습니다.

- `taskflow_todos_data`
- `taskflow_selected_date`
- `taskflow_week_start_date`

## 검증 결과

- `npm run build` 통과
- `npm run lint` 통과
- 브라우저에서 주요 Todo CRUD 흐름 확인
- 브라우저에서 날짜 이동과 주간 뷰 연동 확인
- 브라우저 콘솔 에러 없음
