import { InboxIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon: Icon = InboxIcon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Icon className="h-12 w-12 text-ciclus-gray-100" strokeWidth={1.5} />
      <div className="flex flex-col gap-1">
        <p className="text-[15px] text-ciclus-gray-600">{title}</p>
        {description && <p className="text-[13px] text-ciclus-gray-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}
