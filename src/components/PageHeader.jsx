import React from 'react'

export default function PageHeader({ kicker, title, subtitle, pills = [] }) {
  return (
    <div className="page-header">
      {kicker && <span className="page-header-kicker">{kicker}</span>}
      <h1>{title}</h1>
      {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      {pills.length > 0 && (
        <div className="page-header-pills">
          {pills.map((pill) => (
            <div key={pill.label} className="page-header-pill">
              <span>{pill.label}</span>
              <strong>{pill.value}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
