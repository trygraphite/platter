import { cn } from "@platter/ui/lib/utils";

interface ContainerProps extends React.HtmlHTMLAttributes<HTMLDivElement> {}

function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "h-full mx-auto w-full max-w-screen-xl px-6 md:px-12 lg:px-20",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Container;
