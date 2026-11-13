"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/services/supaBaseClient';

const fetchInterviewList = async (userId, limit = 10) => {
  if (!userId) return [];
  const { data: interviews, error } = await supabase
    .from("interviews")
    .select("jobPosition, jobDescription, type, duration, interview_id, language, CompanyName, created_at, interview-feedback(userEmail, userName, created_at, final_score, recommended, feedback)")
    .eq("created_by", userId)
    .order("id", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return interviews || [];
};

export const useInterview = (user, userLoading = false, limit = 10) => {
  const userId = user?.id || user?.user?.id;

  const query = useQuery({
    queryKey: ["interviews", userId, limit],
    queryFn: () => fetchInterviewList(userId, limit),
    enabled: !!userId,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const isLoading = (userLoading && !userId) || (userId ? (query.isLoading && !query.data) : false);

  return {
    interviewList: query.data || [],
    loading: isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};

export default useInterview;