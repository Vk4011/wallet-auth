import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import Toast from '../components/Toast'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await signup(name, email, password)
      setToast({ message: 'Account created!', type: 'success' })
      setTimeout(() => navigate('/dashboard'), 500)
    } catch (err) {
      setToast({ message: err.message || 'Registration failed', type: 'error' })
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="ambient-glow" />
      <div className="auth-card">
        <div className="auth-header">
          <i className="fa-solid fa-wallet brand-icon" />
          <h2>Create Account</h2>
          <p>Set up your wallet in seconds</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                required
              />
              <i className="fa-regular fa-user" />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@example.com"
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
                placeholder="Min. 6 characters"
                required
                minLength={6}
              />
              <i className="fa-solid fa-lock" />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? (
              <><i className="fa-solid fa-spinner fa-spin" /> Creating...</>
            ) : (
              <>Create Account <i className="fa-solid fa-arrow-right" /></>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
