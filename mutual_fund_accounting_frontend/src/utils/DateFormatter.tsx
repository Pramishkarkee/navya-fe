// const DateFormatter = (dateString: string) => {
//   const date = new Date(dateString);

//   const day = date.getDate();
//   const month = date.getMonth();
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// };

// export default DateFormatter;



const DateFormatter = {
  format: (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }
};

export default DateFormatter;
