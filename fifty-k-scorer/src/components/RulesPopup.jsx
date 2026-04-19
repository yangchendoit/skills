export default function RulesPopup({ onClose }) {
  return (
    <div className="popup show" onClick={(e) => e.target.classList.contains('popup') && onClose()}>
      <div className="popup-content">
        <div className="popup-title">💣 炸弹规则</div>
        <div style={{ textAlign: 'left', fontSize: '13px', color: '#94A3B8', lineHeight: 1.8 }}>
          <p><strong style={{ color: 'var(--color-accent)' }}>炸弹分值：</strong>5张=200 / 6张=500 / 7张=1000 / 8张=2000 / 9张=5000 / 10张=10000</p>
          <p style={{ marginTop: 8 }}><strong style={{ color: 'var(--color-accent)' }}>游次加分：</strong>1、2游=+200分 / 1、3游=+100分</p>
          <p style={{ marginTop: 8 }}><strong style={{ color: 'var(--color-accent)' }}>级数计算：</strong>每100分折算为1级，四舍五入</p>
        </div>
        <button className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-lg)' }} onClick={onClose}>我知道了</button>
      </div>
    </div>
  )
}