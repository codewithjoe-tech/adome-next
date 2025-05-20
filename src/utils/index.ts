export function formatTimeAgo(timestamp: string | number | Date): string {
    const now = new Date();
    const time = new Date(timestamp);
    const secondsAgo = Math.floor((now.getTime() - time.getTime()) / 1000);
  
    const minute = 60;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
  
    if (secondsAgo < minute) {
      return `${secondsAgo} second${secondsAgo !== 1 ? 's' : ''} ago`;
    } else if (secondsAgo < hour) {
      const minutes = Math.floor(secondsAgo / minute);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (secondsAgo < day) {
      const hours = Math.floor(secondsAgo / hour);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (secondsAgo < week) {
      const days = Math.floor(secondsAgo / day);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (secondsAgo < 2 * week) {
      const weeks = Math.floor(secondsAgo / week);
      return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    } else {
      return time.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  }
  