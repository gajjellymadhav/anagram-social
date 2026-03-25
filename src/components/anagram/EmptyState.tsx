import { Camera } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

const EmptyState = ({ icon, title, description }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-muted-foreground/30">
      {icon || <Camera size={28} className="text-muted-foreground" />}
    </div>
    <h3 className="text-xl font-semibold mb-1">{title}</h3>
    {description && <p className="text-sm text-muted-foreground max-w-xs">{description}</p>}
  </div>
);

export default EmptyState;
