export const formatDate = (
  date: string | Date | undefined | null, 
  format: 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'DD MMM YYYY' = 'DD/MM/YYYY'
): string => {
  if (!date) return '—';

  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is invalid
  if (isNaN(d.getTime())) return '—';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const monthName = months[d.getMonth()];

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD MMM YYYY':
      return `${day} ${monthName} ${year}`;
    case 'DD/MM/YYYY':
    default:
      return `${day}/${month}/${year}`;
  }
};

/**
 * Format date with time (e.g., 15/10/2023 10:30 AM)
 */
export const formatDateTime = (date: string | Date | undefined | null): string => {
  if (!date) return '—';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';

  const datePart = formatDate(d);
  const timePart = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return `${datePart} ${timePart}`;
};