"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { CircleCheck, Loader2, Send } from "lucide-react";

import {
  createTicket,
  type TicketPriorityValue,
} from "@/app/actions/ticket-actions";

const products = ["BC Health", "BCModas", "BCTech Core"];
const priorities = [
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Média" },
  { value: "HIGH", label: "Alta" },
];

const fieldClassName =
  "w-full rounded-xl border border-zinc-800 bg-background px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20";

type SubmittedTicket = {
  protocol: string;
  source: "database" | "mock";
};

export function TicketForm() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState<SubmittedTicket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const product = String(formData.get("product") ?? "");
    const priority = String(
      formData.get("priority") ?? "MEDIUM",
    ) as TicketPriorityValue;
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    setError(null);

    startTransition(async () => {
      const result = await createTicket({
        product,
        priority,
        title,
        description,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSubmitted({
        protocol: result.ticket.protocol,
        source: result.source,
      });
      form.reset();
      router.refresh();
    });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-accent/30 bg-accent/5 p-6">
        <span className="grid size-11 place-items-center rounded-full bg-accent/15 text-accent">
          <CircleCheck className="size-6" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-base font-semibold text-zinc-100">
            Chamado aberto com sucesso
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            Protocolo{" "}
            <strong className="text-accent">{submitted.protocol}</strong>. Nossa
            equipe responde em até 4 horas úteis.
          </p>
          <p
            className={`mt-2 text-xs ${
              submitted.source === "database" ? "text-accent" : "text-amber-300"
            }`}
          >
            {submitted.source === "database"
              ? "Chamado gravado na tabela Ticket via Prisma."
              : "Registro em modo demonstração: o banco não está disponível."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmitted(null);
            setError(null);
          }}
          className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-brand/50 hover:text-brand"
        >
          Abrir outro chamado
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="ticket-product" className="text-xs font-medium text-zinc-400">
            Produto
          </label>
          <select id="ticket-product" name="product" className={fieldClassName} defaultValue="BC Health">
            {products.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="ticket-priority" className="text-xs font-medium text-zinc-400">
            Prioridade
          </label>
          <select id="ticket-priority" name="priority" className={fieldClassName} defaultValue="MEDIUM">
            {priorities.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ticket-title" className="text-xs font-medium text-zinc-400">
          Assunto
        </label>
        <input
          id="ticket-title"
          name="title"
          type="text"
          required
          minLength={3}
          maxLength={120}
          placeholder="Ex.: Erro ao emitir relatório de atendimentos"
          className={fieldClassName}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ticket-description" className="text-xs font-medium text-zinc-400">
          Descrição
        </label>
        <textarea
          id="ticket-description"
          name="description"
          required
          minLength={10}
          rows={4}
          maxLength={2000}
          placeholder="Descreva o que aconteceu, quando e qual o impacto na sua operação."
          className={`${fieldClassName} resize-none`}
        />
      </div>

      {error ? (
        <p role="alert" className="text-xs font-medium text-red-300">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-zinc-500">
          SLA de primeira resposta: até 4 horas úteis.
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {isPending ? "Enviando..." : "Abrir chamado"}
        </button>
      </div>
    </form>
  );
}
