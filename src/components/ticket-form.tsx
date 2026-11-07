"use client";

import { useState, type FormEvent } from "react";
import { CircleCheck, Loader2, Send } from "lucide-react";

const products = ["BC Health", "BCModas", "BCTech Core"];
const priorities = [
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Média" },
  { value: "HIGH", label: "Alta" },
];

const fieldClassName =
  "w-full rounded-xl border border-zinc-800 bg-background px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20";

export function TicketForm() {
  const [submitted, setSubmitted] = useState(false);
  const [protocol, setProtocol] = useState("");
  const [sending, setSending] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);

    // Simulação de abertura de chamado — substituir por Server Action/API.
    window.setTimeout(() => {
      setProtocol(`SUP-${Math.floor(1000 + Math.random() * 9000)}`);
      setSending(false);
      setSubmitted(true);
    }, 600);
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
            Protocolo <strong className="text-accent">{protocol}</strong>. Nossa
            equipe responde em até 4 horas úteis.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
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
          rows={4}
          maxLength={2000}
          placeholder="Descreva o que aconteceu, quando e qual o impacto na sua operação."
          className={`${fieldClassName} resize-none`}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-zinc-500">
          SLA de primeira resposta: até 4 horas úteis.
        </p>
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          Abrir chamado
        </button>
      </div>
    </form>
  );
}
