export const isoNow = () => new Date().toISOString();
export const formatDateHuman = (iso: string) =>
  new Date(iso).toLocaleString();
