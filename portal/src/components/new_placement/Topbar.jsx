import { useNavigate } from 'react-router-dom'
import React from 'react'

const routes = {
  1: "/new-placement/personal-details",
  2: "/new-placement/course-details",
  3: "/new-placement/placement-preference",
  4: "/new-placement/documents",
  5: "/new-placement/report-submit"
}

const Topbar = ({ title, description, step }) => {
  const navigate = useNavigate();
  return (
    <div className="card flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-6 pt-3 pb-4 mb-2 border-b border-base bg-surface">
      <div>
        {step && <span className="text-xs font-bold text-accent tracking-wide uppercase">Step {step} of 5</span>}
        <h1 className="text-2xl font-bold text-primary tracking-tight mt-0.5">{title}</h1>
        <p className="text-xs text-muted mt-0.5">{description}</p>
      </div>

      {step && (
        <div className="flex items-center space-x-2 self-start md:self-center">
          {[1, 2, 3, 4, 5].map((item) => (
            <React.Fragment key={item}>
              <button
                onClick={() => navigate(routes[item])}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border cursor-pointer transition-colors ${
                  item === step
                    ? "bg-accent border-accent"
                    : "bg-surface border-base text-muted hover:border-accent hover:text-accent"
                }`}
                style={item === step ? { color: '#fff' } : {}}
              >
                {item}
              </button>
              {item < 5 && <div className="w-6 h-[1px] bg-muted" />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

export default Topbar
