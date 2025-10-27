import { cn } from "@/utils/cn"

const Card = ({ 
  children, 
  className,
  variant = "default",
  hover = false,
  ...props 
}) => {
  const variants = {
    default: "bg-white border border-slate-200 shadow-sm",
    elevated: "bg-white border border-slate-200 shadow-lg",
    outlined: "bg-white border border-slate-300",
    glass: "bg-white/80 backdrop-blur-md border border-white/20 shadow-xl"
  }

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-200",
        variants[variant],
        hover && "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ children, className, ...props }) => (
  <div className={cn("p-6 pb-0", className)} {...props}>
    {children}
  </div>
)

const CardContent = ({ children, className, ...props }) => (
  <div className={cn("p-6", className)} {...props}>
    {children}
  </div>
)

const CardFooter = ({ children, className, ...props }) => (
  <div className={cn("px-6 pb-6", className)} {...props}>
    {children}
  </div>
)

Card.Header = CardHeader
Card.Content = CardContent
Card.Footer = CardFooter

export default Card