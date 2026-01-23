import { useCallback, useState } from "react";

export function useDialog<T = void>(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);
  const [data, setData] = useState<T | null>(null);

  const handleOpen = useCallback((newData?: T) => {
    if (newData !== undefined) {
      setData(newData);
    }
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    // Optional: clear data on close if desired, or keep it for animations
    // setData(null);
  }, []);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return {
    open,
    data,
    handleOpen,
    handleClose,
    handleToggle,
    setOpen,
    setData,
  };
}
