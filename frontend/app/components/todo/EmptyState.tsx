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
        Todo 추가 버튼을 눌러 선택한 날짜에 새 할 일을 등록해보세요.
      </p>
    </div>
  );
}
