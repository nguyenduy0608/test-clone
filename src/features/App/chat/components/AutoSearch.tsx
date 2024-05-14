import React, { useState, useRef, useEffect } from 'react'
import Icon, { SearchOutlined, LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import './css/styles.css'
import useWsListTopicMessage from '../hooks/useWsListTopicMessage'

type TypingAutoSearchProps = {
    onSearchSubmit: (key: string) => void
    isSearchLoading: boolean
    isSearchMode: boolean
    placeholder?: string
    onFocus?: () => void
    onBlur?: () => void
    setListSearchTopicMessage: React.Dispatch<React.SetStateAction<any[]>>
}

function AutoSearch({
    onSearchSubmit,
    isSearchLoading,
    isSearchMode,
    placeholder,
    onFocus,
    onBlur,
    setListSearchTopicMessage,
}: TypingAutoSearchProps) {
    const refInput = useRef<any>(null)
    const { getListTopic } = useWsListTopicMessage()
    const [searchKey, setSearchKey] = useState<string>('')
    const [isTyping, setIsTyping] = useState(false)
    const timeOut = useRef<any>(null)

    useEffect(() => {
        onSearchSubmit(searchKey)
    }, [searchKey])

    return (
        <div className="search-slidebar">
            <div className="search-slidebar-container">
                {isSearchLoading ? (
                    <Spin className="search-icon" indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} />
                ) : (
                    <SearchOutlined className="search-icon" />
                )}
                <input
                    ref={refInput}
                    type="text"
                    placeholder={placeholder}
                    onChange={e => {
                        setSearchKey(e.target.value)
                        if (timeOut.current) {
                            setIsTyping(true)
                            clearTimeout(timeOut.current)
                        }
                        timeOut.current = setTimeout(() => {
                            setIsTyping(false)
                        }, 300)
                    }}
                    onFocus={onFocus}
                    // onBlur={onBlur}
                />
            </div>
            {isSearchMode && (
                <button
                    className="btn-close-search-mode"
                    onClick={() => {
                        refInput.current.value = ''
                        onBlur && onBlur()
                        setListSearchTopicMessage([])
                        getListTopic()
                    }}
                >
                    <strong style={{ fontSize: 'x-small' }}>Đóng</strong>
                </button>
            )}
        </div>
    )
}
export default AutoSearch
