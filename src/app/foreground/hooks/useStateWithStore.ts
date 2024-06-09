import { useState, useEffect } from 'react'
import { getBucket } from '@extend-chrome/storage'

export const useStateWithStore = <T>(
  bucketName: string,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  interface Store {
    [key: string]: T
  }
  const bucket = getBucket<Store>(bucketName, 'sync')
  const [value, setValue] = useState<T>(defaultValue)

  useEffect(() => {
    ;(async () => {
      const value = await bucket.get()
      setValue(value[bucketName] || defaultValue)
    })()
  }, [])

  useEffect(() => {
    bucket.set({ [bucketName]: value })
  }, [value])

  return [value, setValue]
}
