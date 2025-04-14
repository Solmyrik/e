export function getStatusIcon(task) {
  let color = 'red';

  if (task) {
    const date = new Date();
    const taskDate = new Date(task * 1000);

    if (taskDate.toDateString() === date.toDateString()) {
      color = 'green';
    }

    if (taskDate > date) {
      const oneDay = 24 * 60 * 60 * 1000;
      if (taskDate - date > oneDay) {
        color = 'yellow';
      }
    }
  }

  return `
     <svg width="16" height="16">
       <circle cx="8" cy="8" r="8" fill="${color}" />
     </svg>
   `;
}

export function formatDate(time) {
  const date = new Date(time * 1000);

  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}.${date.getFullYear()}`;
}
