interface HeadingProps {
  title: string;
  description: string;
}
export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className="min-w-0">
      <h3 className="text-xl sm:text-3xl font-bold tracking-tight truncate">{title}</h3>
      <p className="text-sm text-muted-foreground  truncate">{description}</p>
    </div>
  );
};
