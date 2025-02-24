const getAvatarFormUsername = (username) => {
   if (!username) return "https://ui-avatars.com/api/?name=Unknown";

   const splittedName = username?.split(" ");

   const name = splittedName.map((name, i, arr) => {
      if (i === arr.length - 1) {
         return name;
      }
      else {
         return name + "+";
      }
   })

   return `https://ui-avatars.com/api/?name=${name}`
}

export default getAvatarFormUsername;