'use client';

import { startTransition, useActionState, useEffect, useRef, type ReactNode } from 'react';
import type { FormState } from '@/lib/types';

interface Props {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  children: ReactNode;
  className?: string;
}

// Formulário ligado a uma Server Action; mantém os valores escritos quando a API devolve erro
export function ActionForm({ action, submitLabel, children, className }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state) messageRef.current?.focus();
  }, [state]);

  return (
    <form
      className={className ?? 'space-y-4'}
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
      }}
    >
      {children}
      {state?.error && (
        <p ref={messageRef} tabIndex={-1} role="alert" className="text-sm text-rose-400">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p ref={messageRef} tabIndex={-1} role="status" className="text-sm text-emerald-400">
          {state.success}
        </p>
      )}
      <button type="submit" className="btn" disabled={pending}>
        {pending ? 'A enviar…' : submitLabel}
      </button>
    </form>
  );
}
