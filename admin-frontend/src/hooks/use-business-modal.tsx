import { create } from "zustand";

interface useBusinessModalInterface {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useBusinessModal = create<useBusinessModalInterface>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
