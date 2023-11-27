export default function convertDate(date) {
  const createdDate = new Date(date);
  const formattedDate =
    createdDate.toDateString() + ' ' + createdDate.toLocaleTimeString();
  return formattedDate;
}
