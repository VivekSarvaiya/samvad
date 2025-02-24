import getAvatarFormUsername from "./getAvatarFormUsername";

const getUserAvatar = (user) => {
   if (!user) return "";

   if (user?.avatar) return user.avatar;

   return getAvatarFormUsername(user.username);
}

export default getUserAvatar;