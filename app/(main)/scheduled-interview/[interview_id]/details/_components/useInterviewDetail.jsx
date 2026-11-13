"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/services/supaBaseClient';

const fetchInterviewDetail = async (userId, interviewId) => {
  if (!userId || !interviewId) return null;

  const { data, error } = await supabase
    .from('interviews')
    .select(`jobPosition, jobDescription, type, questionList, created_at, duration, interview_id, CompanyName, language, interview-feedback(userEmail, userName, created_at, final_score, recommended, feedback)`)
    .eq('created_by', userId)
    .eq('interview_id', interviewId)
    .order('id', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data?.[0] || null;
};

export const useInterviewDetail = (user, userLoading = false, interviewId) => {
  const userId = user?.id || user?.user?.id;

  const query = useQuery({
    queryKey: ["interview-detail", userId, interviewId],
    queryFn: () => fetchInterviewDetail(userId, interviewId),
    enabled: !!userId && !!interviewId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const isLoading = (userLoading && !userId) || (userId && interviewId ? (query.isLoading && !query.data) : false);

  return {
    interviewDetail: query.data || null,
    loading: isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};

export default useInterviewDetail;
