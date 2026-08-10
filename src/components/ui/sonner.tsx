import { CircleCheck, Info, OctagonX, TriangleAlert } from "lucide-react"
import { useSelector } from "react-redux"
import { Toaster as Sonner } from "sonner"
import { CircularProgress } from "@mui/material"
import type { RootState } from "../../app/store"

type ToasterProps = React.ComponentProps<typeof Sonner>

// Sonner ships its own light/dark styling driven entirely by the `theme` prop below —
// no custom classNames override needed (a previous shadcn/Tailwind-token-based override
// was removed here since those tokens no longer exist in this codebase).
const Toaster = ({ ...props }: ToasterProps) => {
  const mode = useSelector((state: RootState) => state.theme.mode)

  return (
    <Sonner
      theme={mode}
      icons={{
        success: <CircleCheck size={16} />,
        info: <Info size={16} />,
        warning: <TriangleAlert size={16} />,
        error: <OctagonX size={16} />,
        loading: <CircularProgress size={16} />,
      }}
      {...props}
    />
  )
}

export { Toaster }
