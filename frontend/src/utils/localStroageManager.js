export const ACCESS_TOKEN = "chat_access_token"
export const USER_DATA = "chat_user_data"

export function getLocalStorageItem(key) {
   const item = localStorage.getItem(key);
   return JSON.parse(item);
}

export function setLocalStorageItem(key, value) {
   localStorage.setItem(key, JSON.stringify(value));
}

export function removeLocalStorageItem(...keys) {
   keys.forEach((key) => {
      localStorage.removeItem(key);
   });
}
