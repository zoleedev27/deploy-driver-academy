import React from "react"
import { cn } from "@/lib/utils"

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full p-4 border-2 rounded-xl bg-transparent text-base transition-all focus:outline-none shadow-xs placeholder:text-muted-foreground dark:bg-input/30 dark:text-white dark:placeholder:text-muted-foreground",
        "border-gray-300 hover:border-gray-400 focus:border-ring focus:ring-2 focus:ring-gray-500 focus-visible:ring-2 focus-visible:ring-gray-500",
        className
      )}
    />
  )
}

export { Textarea }
