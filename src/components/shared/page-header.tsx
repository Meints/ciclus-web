interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b-[0.5px] border-ciclus-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-[20px] font-medium tracking-tight text-ciclus-gray-900">{title}</h1>
        {description && <p className="text-[13px] text-ciclus-gray-600">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
