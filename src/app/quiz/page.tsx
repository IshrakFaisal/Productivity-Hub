import { Quiz } from "@/components/Quiz";

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-white">Find your productivity stack</h1>
        <p className="mt-3 text-neutral-400">
          Answer a few practical questions and get a home base plus supporting
          tools recommendation.
        </p>
      </div>
      <Quiz />
    </div>
  );
}
