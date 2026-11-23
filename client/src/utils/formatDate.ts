export const getTodayDate = (): string => {
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 10);
};

export const formatDate = (date: string | null): string => {
  if (!date) return '-';

  const [year, month, day] = date.split('T')[0].split('-');

  return `${day}/${month}/${year}`;
};