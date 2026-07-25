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
    <div className="bg-white border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 mb-2 shadow-sm">
      <div>
        {step && <span className="text-xs font-bold text-emerald-600 tracking-wide uppercase">Step {step} of 5</span>}
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">{title}</h1>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>

      {step && (
        <div className="flex items-center space-x-2 self-start md:self-center">
          {[1, 2, 3, 4, 5].map((item) => (
            <React.Fragment key={item}>
              <button
                onClick={() => navigate(routes[item])}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border cursor-pointer transition-all ${
                  item === step
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                    : "bg-white border-gray-300 text-gray-600 hover:border-emerald-400 hover:text-emerald-600"
                }`}
              >
                {item}
              </button>
              {item < 5 && <div className="w-6 h-[1px] bg-gray-300" />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

export default Topbar
