import getAvatarFormUsername from "../../../utils/getAvatarFormUsername";
import getTime from "../../../utils/getTime";

const getGroupLastMessages = (chat) => {
   if (!chat) return "";
   if (!chat?.members) return "";
   if (!chat?.lastMessage?.text) return "";

   const sender = chat?.lastMessage?.sender;
   if (!sender) return "";

   const user = chat?.members?.find((member) => member._id == sender);
   if (!user) return "";

   return `${user.username}: ${chat.lastMessage.text}`
}

const getChatDetails = (chat, userId) => {

   const chatUser = chat?.members?.find((user) => user._id !== userId);
   const unRead = chat?.unread?.find((unread) => unread.user === userId);

   const chatName = chat?.groupName || chatUser?.username || "";
   const chatAvatar = chat?.groupIcon || chatUser?.avatar || getAvatarFormUsername(chatName);
   const lastMessage = (chat.type == "group" ? getGroupLastMessages(chat) : chat?.lastMessage?.text) || "";
   const lastMessageTime = getTime(chat?.lastMessage?.createdAt) || "";
   const unread = unRead?.unread || 0;


   return { chatName, chatAvatar, lastMessage, lastMessageTime, unread };

}

export default getChatDetails;