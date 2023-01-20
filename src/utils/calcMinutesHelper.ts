
const calcMinutesToDate = (from: Date, to: Date) => {
  const diff = to.getTime() - from.getTime()
  const minutes = Math.round(diff / 1000 / 60)
  return minutes
}

const calcMinutesAfterDate = (date: Date) => {
  const now = new Date().getTime()
  const diff = now - date.getTime()
  const minutes = Math.round(diff / 1000 / 60)
  return minutes
}

export  {
  calcMinutesToDate,
  calcMinutesAfterDate
};