import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'

// 기존 saju_app.html의 전체 로직을 하나의 App으로 가져옴
// 점진적으로 모듈화할 예정
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
