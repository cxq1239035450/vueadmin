import dayjs from 'dayjs'

export const getTime = (time: Date) => {
  return dayjs(time || '').format('YYYY-MM-DD HH:mm:ss')
}
