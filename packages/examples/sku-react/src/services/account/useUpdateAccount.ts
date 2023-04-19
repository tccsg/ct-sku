import { useMutation, useQueryClient } from "@tanstack/react-query";
import request from "../seivtFetch";
import { useGetUser } from "./useGetUser";

export type MemberParams = {
  userName?: string;
  role?: string;
  passwd?: string;
  userId: string;
};
export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (p: MemberParams) => {
      await request({ url: "/user/updateUser", method: "POST", body: p });
    },
    onSuccess() {
      queryClient.invalidateQueries(useGetUser());
    },
  });
};
