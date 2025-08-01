import React, { useState, useEffect, useRef } from 'react'
import { SocialMediaShareCountProps } from '../types'

const defaultChildren = (shareCount: number) => shareCount

const SocialMediaShareCount: React.FC<SocialMediaShareCountProps> = ({
  url,
  appId,
  appSecret,
  getCount,
  children = defaultChildren,
  className,
  ...rest
}) => {
  const [count, setCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isMountedRef = useRef<boolean>(false)

  useEffect(() => {
    isMountedRef.current = true
    
    const updateCount = () => {
      setIsLoading(true)
      
      getCount(
        url,
        (count) => {
          if (isMountedRef.current) {
            setCount(count || 0)
            setIsLoading(false)
          }
        },
        appId,
        appSecret,
      )
    }
    
    updateCount()

    return () => {
      isMountedRef.current = false
    }
  }, [url, appId, appSecret, getCount])

  return (
    <span className={className} {...rest}>
      {!isLoading && count !== undefined && children(count)}
    </span>
  )
}

export default function createShareCount(
  getCount: SocialMediaShareCountProps['getCount'],
) {
  const ShareCount = (props: Omit<SocialMediaShareCountProps, 'getCount'>) => (
    <SocialMediaShareCount getCount={getCount} {...props} />
  )

  ShareCount.displayName = `ShareCount(${getCount.name})`

  return ShareCount
}
