export const generateId = (): string => crypto.randomUUID();

export const sanitizeFileName = (name: string): string => 
  name.replace(/[^a-zA-Z0-9]/g, '_');

export const formatDate = (date: string): string => {
  try {
    return new Date(date).getFullYear().toString();
  } catch {
    return 'N/A';
  }
};

export const validateEmail = (email: string): boolean => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};