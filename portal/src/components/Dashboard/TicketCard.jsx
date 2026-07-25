import { HelpCircle, Clock, CheckCircle2 } from "lucide-react";

const TicketCard = ({ tickets }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Open":
        return <HelpCircle size={16} className="text-warning" />;
      case "In Progress":
        return <Clock size={16} className="text-info" />;
      case "Resolved":
        return <CheckCircle2 size={16} className="text-success" />;
      default:
        return <HelpCircle size={16} className="text-muted" />;
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Open":
        return "bg-warning-subtle text-warning";
      case "Resolved":
        return "bg-success-subtle text-success";
      case "In Progress":
        return "bg-info-subtle text-info";
      default:
        return "bg-muted text-secondary";
    }
  };

  return (
    <div className="bg-surface rounded-xl p-4 sm:p-5 shadow-pro-md border border-base">
      <h2 className="text-sm sm:text-base font-semibold text-primary mb-3 sm:mb-4">
        Support Tickets
      </h2>

      <div className="space-y-2 sm:space-y-3">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-subtle hover:bg-muted transition-colors"
          >
            <div className="mt-0.5 flex-shrink-0">{getStatusIcon(ticket.status)}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs sm:text-sm font-medium text-primary flex-1">
                  {ticket.subject}
                </p>
                <span className="text-xs text-muted whitespace-nowrap">
                  {ticket.date}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted font-mono">{ticket.id}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusStyles(ticket.status)}`}
                >
                  {ticket.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketCard;