
const calcMinutesToDate = (date: Date) => {
  const now = new Date().getTime()
  const diff = date.getTime() - now
  const minutes = Math.floor(diff / 1000 / 60)
  return minutes
}

const calcMinutesAfterDate = (date: Date) => {
  const now = new Date().getTime()
  const diff = now - date.getTime()
  const minutes = Math.floor(diff / 1000 / 60)
  return minutes
}


export  {
  calcMinutesToDate,
  calcMinutesAfterDate
};