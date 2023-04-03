const readableNumber = (value: string): string => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default readableNumber;