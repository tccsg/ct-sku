import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "./queries";

export const useGetUser = () => {
  const userId = localStorage.getItem("userId");
  if (!userId) throw new Response("error", { status: 401 });
  return useQuery(getCurrentUser({ userId }));
};
