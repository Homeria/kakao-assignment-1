import ButtonLink from "../components/ui/ButtonLink";
import PageCard from "../components/ui/PageCard";

export default function TodoNotFound() {
  return (
    <main className="min-h-screen px-5 py-10 text-slate-950">
      <PageCard className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#672be0]">
          Todo Not Found
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Todo를 찾을 수 없습니다</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          이미 삭제되었거나 존재하지 않는 Todo입니다.
        </p>
        <ButtonLink href="/todos" className="mt-5">
          목록으로 돌아가기
        </ButtonLink>
      </PageCard>
    </main>
  );
}
