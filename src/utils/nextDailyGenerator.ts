const nextDailyStringGenerator = (lastDailyRedeem: Date): string => {
  const now = Date.now();

  const hours =
    24 - Math.round((now - lastDailyRedeem.getTime()) / 1000 / 60 / 60);
  const minutes =
    24 * 60 - Math.round((now - lastDailyRedeem.getTime()) / 1000 / 60);

  if (hours <= 0 && minutes <= 0) return "now";
  else if (minutes === 1) return `in ${minutes} minute`;
  else if (hours <= 0 && minutes > 0) return `in ${minutes} minutes`;
  else if (hours === 1 && minutes <= 60) return `in ${hours} hour`;
  else return `in ${hours} hours`;
};

export default nextDailyStringGenerator;
