import { create } from "zustand";

interface User {
  fullName: string;
  callReceiverId: string;
  setFullName: (fullName: string) => void;
  setCallReceiverId: (callReceiverId: string) => void;
}

const useUser = create<User>((set) => ({
  fullName: "",
  setFullName: (fullName: string) => set({ fullName: fullName }),
  callReceiverId: "",
  setCallReceiverId: (callReceiverId: string) =>
    set({ callReceiverId: callReceiverId }),
}));

export default useUser;
