type EmptyStateProps = {
  search: string;
};

export default function EmptyState({ search }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
      <p className="text-sm font-semibold text-slate-700">
        {search ? "검색 조건에 맞는 Todo가 없습니다." : "이 날짜에 등록된 Todo가 없습니다."}
      </p>
      <p className="mt-2 text-sm text-slate-500">
        다음 단계에서 생성 폼을 연결해 이 영역에 Todo를 추가할 예정입니다.
      </p>
    </div>
  );
}

