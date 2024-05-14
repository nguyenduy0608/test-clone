import React, { useState, useEffect, useRef } from 'react'

interface PaggingProps {
  total: number
  current: number
  pageSize: number
}

export default function useInfiniteList(
  dependend: number | string,
  element_name: string,
  setPagingMessage: (props: PaggingProps) => void,
  isSrollOnTop: boolean
) {
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [canLoading, setCanLoading] = useState<boolean>(false)

  useEffect(() => {
    const infiniteListBody: any = document.getElementById(element_name)
    if (isSrollOnTop) {
      infiniteListBody.addEventListener('scroll', (e: any) => {
        const el = e.target
        if (
          el.clientHeight - el.scrollHeight > el.scrollTop - 50 &&
          !isLoadingMore
        ) {
          setCanLoading(true)
        }
      })
    }
    setPagingMessage({
      total: 0,
      current: 1,
      pageSize: 0,
    })
    setCanLoading(false)
  }, [dependend])
}
