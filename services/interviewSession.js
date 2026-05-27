import { supabase } from '@/services/supaBaseClient';

const getStoredSession = (interviewSession) => {
    if (!interviewSession) return null;

    return JSON.stringify(interviewSession);
};

export const joinInterviewSession = async ({
    interviewId,
    userName,
    userEmail,
    router,
    onError,
}) => {
    try {
        if (!interviewId) {
            throw new Error('Interview id is missing.');
        }

        const { data: interviews, error } = await supabase
            .from('interviews')
            .select('*')
            .eq('interview_id', interviewId)
            .limit(1);

        if (error) {
            throw error;
        }

        if (!interviews?.length) {
            throw new Error('Interview details not found.');
        }

        const interviewSession = {
            userName: userName?.trim() || 'Candidate',
            userEmail: userEmail?.trim() || '',
            interviewData: interviews[0],
        };

        if (typeof window !== 'undefined') {
            sessionStorage.setItem('interviewSession', getStoredSession(interviewSession));
        }

        if (router?.push) {
            router.push(`/interview/${interviewId}/start`);
        }

        return interviewSession;
    } catch (error) {
        if (onError) {
            onError(error);
        }

        throw error;
    }
};
