import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

const TaskCard = ({ tasks }) => {
  return (
    <div className="bg-surface rounded-xl p-4 sm:p-5 shadow-pro-md border border-base">
      <h2 className="text-sm sm:text-base font-semibold text-primary mb-3 sm:mb-4">
        Pending Tasks
      </h2>

      <div className="space-y-2 sm:space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-subtle hover:bg-muted transition-colors"
          >
            <div className="mt-0.5 flex-shrink-0">
              {task.done ? (
                <CheckCircle2 size={18} className="text-success" />
              ) : task.urgent ? (
                <AlertCircle size={18} className="text-danger" />
              ) : (
                <Circle size={18} className="text-muted" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p
                className={`text-xs sm:text-sm font-medium ${
                  task.done ? "text-muted line-through" : "text-primary"
                }`}
              >
                {task.title}
              </p>
              <p
                className={`text-xs mt-0.5 ${
                  task.urgent && !task.done ? "text-danger font-semibold" : "text-secondary"
                }`}
              >
                {task.due}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;