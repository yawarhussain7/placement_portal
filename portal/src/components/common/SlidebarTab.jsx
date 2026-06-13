import { NavLink } from "react-router-dom";

export default function SidebarTab({ icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
          isActive
            ? "bg-accent-subtle text-accent"
            : "text-secondary hover:bg-subtle hover:text-primary"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={isActive ? "text-accent" : "text-muted"}>{icon}</div>
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
