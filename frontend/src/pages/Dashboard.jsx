import { useState, useEffect } from 'react'
import { useAuth } from '../App'
import { api } from '../api'
import Toast from '../components/Toast'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('send')
  const [toast, setToast] = useState(null)

  // Send form state
  const [recipientEmail, setRecipientEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [sending, setSending] = useState(false)

  const currentUserId = api.getUserId()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [walletData, profileData] = await Promise.all([
        api.getWallet(),
        api.getProfile()
      ])
      if (walletData && walletData.wallet) setWallet(walletData.wallet)
      if (profileData && profileData.user) setProfile(profileData.user)
    } catch (err) {
      setToast({ message: 'Failed to load data: ' + err.message, type: 'error' })
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    setSending(true)

    try {
      const result = await api.sendMoney(recipientEmail, parseFloat(amount))
      if (result && result.wallet) {
        setToast({ message: result.message || 'Transfer successful!', type: 'success' })
        setWallet(result.wallet)
        setRecipientEmail('')
        setAmount('')
        loadData()
      }
    } catch (err) {
      setToast({ message: err.message || 'Transfer failed', type: 'error' })
    } finally {
      setSending(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  const balance = wallet ? parseFloat(wallet.balance).toFixed(8) : '0.00000000'
  const activeUser = profile || user

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo">
          <i className="fa-solid fa-wallet" />
          <span>CryptoWallet</span>
        </div>
        <div className="nav-profile">
          <div className="user-badge">
            <i className="fa-regular fa-circle-user" />
            <span>{activeUser?.name || 'User'} (ID: {currentUserId || 'N/A'})</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <i className="fa-solid fa-power-off" /> <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="workspace">
        {/* Left Panel */}
        <div className="wallet-panel">
          <div className="glass-card balance-card">
            <h3>Current Balance</h3>
            <div className="balance-amount">
              <span>{balance}</span>
              <span className="currency-symbol">USDT</span>
            </div>
            <button
              className="btn-copy"
              style={{ marginTop: '12px', fontSize: '0.8rem' }}
              onClick={loadData}
            >
              <i className="fa-solid fa-arrows-rotate" /> Refresh Balance
            </button>
          </div>

          <div className="actions-grid">
            <button
              className={`action-tab-btn ${activeTab === 'send' ? 'active' : ''}`}
              onClick={() => setActiveTab('send')}
            >
              <i className="fa-solid fa-paper-plane" />
              <span>Send Money</span>
            </button>
            <button
              className={`action-tab-btn ${activeTab === 'receive' ? 'active' : ''}`}
              onClick={() => setActiveTab('receive')}
            >
              <i className="fa-solid fa-qrcode" />
              <span>Receive</span>
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="main-panel">
          <div className="glass-card">
            {/* Send Form */}
            {activeTab === 'send' && (
              <div className="form-section">
                <div className="panel-title">
                  <i className="fa-solid fa-paper-plane" />
                  <span>Send Money Instantly</span>
                </div>
                <form onSubmit={handleSend}>
                  <div className="form-group">
                    <label>Recipient Email</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="e.g. recipient@example.com"
                        required
                      />
                      <i className="fa-regular fa-envelope" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Amount (USDT)</label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        min="0.00000001"
                        step="any"
                        required
                      />
                      <i className="fa-solid fa-dollar-sign" />
                    </div>
                  </div>
                  <button type="submit" className="btn-submit" disabled={sending}>
                    {sending ? (
                      <><i className="fa-solid fa-spinner fa-spin" /> Sending...</>
                    ) : (
                      <>Transfer Money <i className="fa-solid fa-arrow-right" /></>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Receive Info */}
            {activeTab === 'receive' && (
              <div className="form-section">
                <div className="panel-title">
                  <i className="fa-solid fa-qrcode" />
                  <span>Receive Digital Assets</span>
                </div>
                <div className="receive-content">
                  <div className="qr-code-box">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(activeUser?.email || '')}&color=06b6d4&bgcolor=0e1117`}
                      alt="Wallet QR Code"
                    />
                  </div>
                  <div className="receive-details">
                    <h4>Your Wallet Address</h4>
                    <p>Share this email with the sender. Transfers are instant and free.</p>
                    <button
                      className="btn-copy"
                      onClick={() => {
                        navigator.clipboard.writeText(activeUser?.email || '')
                        setToast({ message: 'Email copied!', type: 'success' })
                      }}
                    >
                      <i className="fa-regular fa-copy" /> {activeUser?.email}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Profile Card */}
          <div className="glass-card history-card">
            <div className="panel-title">
              <i className="fa-solid fa-id-badge" />
              <span>Current Account Profile (localStorage inspect target)</span>
            </div>
            <div className="history-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Value</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>localStorage.userId</strong></td>
                    <td><span className="ip-badge">{currentUserId || 'None'}</span></td>
                    <td>Client-controlled ID passed to backend</td>
                  </tr>
                  <tr>
                    <td><strong>Account Name</strong></td>
                    <td>{activeUser?.name || 'N/A'}</td>
                    <td>Fetched via <code>/api/user/profile?userId={currentUserId}</code></td>
                  </tr>
                  <tr>
                    <td><strong>Account Email</strong></td>
                    <td>{activeUser?.email || 'N/A'}</td>
                    <td>Recipient identifier for transfers</td>
                  </tr>
                  <tr>
                    <td><strong>Wallet Balance</strong></td>
                    <td>{balance} USDT</td>
                    <td>Fetched via <code>/api/wallet?userId={currentUserId}</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
