interface StateViewProps {
  loading: boolean;
  error: string | null;
  empty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

/** Shared loading/error/empty guard so hooks' async state never has to be handled ad-hoc per component. */
export function StateView({ loading, error, empty, emptyMessage, children }: StateViewProps) {
  if (loading) return <p className="state-message">Cargando…</p>;
  if (error) return <p className="state-message state-message--error">{error}</p>;
  if (empty) return <p className="state-message">{emptyMessage ?? 'No hay contenido disponible.'}</p>;
  return <>{children}</>;
}
