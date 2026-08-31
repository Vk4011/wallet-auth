import { useEffect, useState } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 50)
    const hideTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 400)
    }, 4000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [onClose])

  return (
    <div className={`toast ${type} ${visible ? 'show' : ''}`}>
      <i className={type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'} />
      <span className="toast-message">{message}</span>
    </div>
  )
}
