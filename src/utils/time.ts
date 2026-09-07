import dayjs from 'dayjs'

export const getTime = (time: string | number | Date | null | undefined) => {
  return time == null || time === ''
    ? ''
    : dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}
