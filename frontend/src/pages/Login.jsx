import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import Toast from '../components/Toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await login(email, password)
      setToast({ message: 'Login successful!', type: 'success' })
      setTimeout(() => navigate('/dashboard'), 500)
    } catch (err) {
      setToast({ message: err.message || 'Login failed', type: 'error' })
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="ambient-glow" />
      <div className="auth-card">
        <div className="auth-header">
          <i className="fa-solid fa-wallet brand-icon" />
          <h2>Welcome Back</h2>
          <p>Sign in to access your wallet</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <i className="fa-regular fa-envelope" />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <i className="fa-solid fa-lock" />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? (
              <><i className="fa-solid fa-spinner fa-spin" /> Authenticating...</>
            ) : (
              <>Sign In <i className="fa-solid fa-arrow-right" /></>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
