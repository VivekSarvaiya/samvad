import moment from "moment";

const getTime = (createdAt) => {
   if (!createdAt) return createdAt;

   const createdAtMoment = moment(createdAt);

   const today = moment();

   if (!createdAtMoment.isSame(today, 'day')) {
      // Format the date as "d/m/y"
      const formattedDate = createdAtMoment.format('L');
      return formattedDate;
   } else {
      // Format the time as "HH:MM"
      const formattedTime = createdAtMoment.format('LT');
      return formattedTime;
   }
}

export default getTime;
