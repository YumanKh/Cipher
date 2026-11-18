import { useNavigate } from 'react-router-dom'

export default function SettingsPage() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button onClick={() => navigate('/vault')} style={{ alignSelf: 'flex-start', border: 0, background: 'transparent', cursor: 'pointer', fontSize: 15, fontWeight: 600 }}>← Back to vault</button>
      <h1 style={{ margin: 0 }}>Settings</h1>
      <p style={{ color: '#668487' }}>Work In Progress</p>
    </div>
  )
}