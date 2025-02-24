const filterChatFriendsBasedOnSearch = (chatList = null, search = "", userId = "") => {
    if (!userId || !search?.trim()) return chatList;
    if (!chatList?.length) return chatList;

    const searchedChat = [];

    for (let i = 0; i < chatList.length; i++) {
        const chat = chatList[i];

        if (chat?.type == "normal") {
            const member = chat?.members?.find((member) => member?._id != userId);

            if (member?.username?.toLowerCase()?.includes(search.toLowerCase())) {
                searchedChat.push(chat);
            }
        }
        else if (chat?.type == "group") {
            if (chat?.groupName?.toLowerCase()?.includes(search.toLowerCase())) {
                searchedChat.push(chat);
            }
        }
    }

    return searchedChat;
}

export default filterChatFriendsBasedOnSearch;