// Todo 목록이 비어 있을 때 보여주는 컴포넌트입니다.
// 목록 컴포넌트의 조건 분기를 단순하게 유지하기 위해 분리했습니다.
export function EmptyState() {
    return (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-[#672be0]/10 text-[#672be0]">
                <span className="text-xl font-semibold">!</span>
            </div>
            <p className="mt-3 text-sm font-medium text-slate-600">등록된 할 일이 없습니다.</p>
        </div>
    )
}
