import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'
import { usePortalData } from './PortalDataContext'

const SocketContext = createContext(null)

const SOCKET_URL = 'http://localhost:2000'

export function SocketProvider({ children }) {
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const { data } = usePortalData()

  // Extract userId from account data
  const userId = data?.account?.id || null

  useEffect(() => {
    if (!userId) return

    const socket = io(SOCKET_URL, {
      auth: { userId },
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id)
      setConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected')
      setConnected(false)
    })

    socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message)
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
      socketRef.current = null
      setConnected(false)
    }
  }, [userId])

  const onNewMessage = useCallback((handler) => {
    if (!socketRef.current) return () => {}
    socketRef.current.on('new_message', handler)
    return () => {
      socketRef.current?.off('new_message', handler)
    }
  }, [])

  const onNewConversation = useCallback((handler) => {
    if (!socketRef.current) return () => {}
    socketRef.current.on('new_conversation', handler)
    return () => {
      socketRef.current?.off('new_conversation', handler)
    }
  }, [])

  const value = {
    socket: socketRef.current,
    connected,
    onNewMessage,
    onNewConversation,
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)