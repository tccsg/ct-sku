import request from "../seivtFetch";

export type User = {
  role: string;
  account: string;
  userId: string;
  userName: string;
};
export const getCurrentUser = ({ userId }: { userId: string }) => ({
  queryKey: ["user", userId],
  queryFn: async () => {
    return request<any>({ url: `/user/user/${userId}`, method: "POST" });
  },
});
