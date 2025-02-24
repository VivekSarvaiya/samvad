export const sendNotification = (title, options) => {
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  }
}