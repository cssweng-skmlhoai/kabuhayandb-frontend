import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const useAuthStore = create(
  persist(
    (set) => ({
      isAuth: false,
      isAdmin: false,
      memberId: null,

      login: async (username, password) => {
        const API_SECRET = import.meta.env.VITE_API_SECRET;
        const API_URL = "https://kabuhayandb-backend.onrender.com";

        try {
          const res = await axios.post(
            `${API_URL}/credentials/login`,
            {
              username,
              password,
            },
            {
              headers: {
                Authorization: `Bearer ${API_SECRET}`,
              },
            }
          );

          const user = res.data.user;
          set({
            isAuth: true,
            isAdmin: user.is_admin,
            memberId: user.member_id,
          });
        } catch (error) {
          console.log(error);
          set({
            isAuth: false,
            isAdmin: false,
            memberId: null,
          });
          throw error;
        }
      },

      logout: () =>
        set({ user: null, isAuth: false, isAdmin: false, memberId: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
