
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useState } from "react";

// Define our playful variant without extending ButtonProps variant
type PlayfulVariant = "playful";
type ButtonVariant = ButtonProps["variant"];
type CombinedVariant = ButtonVariant | PlayfulVariant;

interface PlayfulButtonProps extends Omit<ButtonProps, "variant"> {
  showSparkle?: boolean;
  variant?: CombinedVariant;
}

const PlayfulButton = React.forwardRef<HTMLButtonElement, PlayfulButtonProps>(
  ({ className, children, showSparkle = false, variant = "default", ...props }, ref) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    
    // Trigger animation when clicked
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 700);
      
      if (props.onClick) {
        props.onClick(e);
      }
    };
    
    return (
      <Button
        ref={ref}
        variant={variant === "playful" ? "default" : variant}
        className={cn(
          "relative overflow-hidden interactive-btn", 
          variant === "playful" && "bg-gradient-to-r from-habit-primary to-habit-tertiary hover:opacity-95",
          isAnimating && "animate-pop",
          className
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleClick}
        {...props}
      >
        {showSparkle && (
          <span className={cn(
            "absolute top-0 right-0 h-8 w-8 -mt-1 -mr-1 transition-all duration-300 opacity-0",
            isHovering && "opacity-100 rotate-12"
          )}>
            <Sparkles size={16} className="text-yellow-300" />
          </span>
        )}
        {children}
      </Button>
    );
  }
);

PlayfulButton.displayName = "PlayfulButton";

export { PlayfulButton };
