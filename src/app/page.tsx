import { Code2, Database, Layers, Rocket } from "lucide-react";

const stack = [
  {
    icon: Layers,
    title: "Next.js 15 + App Router",
    description: "Renderização no servidor, rotas tipadas e Turbopack no desenvolvimento.",
  },
  {
    icon: Database,
    title: "Prisma + Supabase",
    description: "Modelagem de dados com Prisma ORM e persistência gerenciada no Supabase.",
  },
  {
    icon: Code2,
    title: "TypeScript + Tailwind CSS",
    description: "Tipagem estrita, design system utilitário e componentes acessíveis.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-24 sm:px-8">
        <section className="flex flex-col gap-6">
          <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium tracking-wide text-emerald-300">
            BritosCode HQ
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Ecossistema{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              BCTech
            </span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-400">
            Base full-stack pronta para construir sistemas, produtos digitais e
            soluções sob medida com Next.js, Prisma e Supabase.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {stack.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition-colors hover:border-emerald-400/40"
            >
              <Icon className="mb-4 size-6 text-emerald-300" aria-hidden="true" />
              <h2 className="mb-2 text-base font-medium text-zinc-100">{title}</h2>
              <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
            </article>
          ))}
        </section>

        <footer className="flex flex-col gap-2 border-t border-zinc-800 pt-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2">
            <Rocket className="size-4" aria-hidden="true" />
            Pronto para o próximo deploy.
          </span>
          <span>BritosCode.tech</span>
        </footer>
      </div>
    </main>
  );
}
