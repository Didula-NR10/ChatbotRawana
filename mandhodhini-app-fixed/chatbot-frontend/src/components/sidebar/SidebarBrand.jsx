export default function SidebarBrand({ collapsed }) {
  return (
    <div className="brand">
      <img src="/assets/atha1.png" alt="Mandodari lotus emblem" className="brand-mark" />
      {!collapsed && (
        <>
          <h1 className="brand-title">MANDHODARI</h1>
          <p className="brand-subtitle">The Wisdom of Lanka</p>
        </>
      )}
    </div>
  )
}
