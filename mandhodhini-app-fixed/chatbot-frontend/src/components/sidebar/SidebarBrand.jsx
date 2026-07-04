export default function SidebarBrand({ collapsed }) {
  return (
    <div className="brand">
      <img src="/assets/atha1.png" alt="Mandhodhini lotus emblem" className="brand-mark" />
      {!collapsed && (
        <>
          <h1 className="brand-title">MANDHODHINI</h1>
          <p className="brand-subtitle">The Wisdom of Lanka</p>
        </>
      )}
    </div>
  )
}
