"use client"
import { useUser } from '@/app/provider'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supaBaseClient'
import { Video, Plus, Loader2, RefreshCw, Archive, Calendar, Search, Filter, Grid, List, Clock, FileText } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import InterviewCard from '../dashboard/_components/InterviewCard'
import { toast } from 'sonner'

const AllInterview = () => {
    const [interviewList, setInterviewList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const { user } = useUser();

    useEffect(() => {
        user && GetInterViewList();
    }, [user])

    useEffect(() => {
        // Filter interviews based on search term
        if (searchTerm) {
            const filtered = interviewList.filter(interview =>
                interview.jobPosition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                interview.jobDescription?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredList(filtered);
        } else {
            setFilteredList(interviewList);
        }
    }, [searchTerm, interviewList]);

    const GetInterViewList = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            let { data: interviews, error } = await supabase
                .from('interviews')
                .select('*')
                .eq('userEmail', user?.email)
                .order('id', { ascending: false })

            if (error) {
                toast.error('Failed to fetch interviews');
                console.error('Error:', error);
                return;
            }

            console.log(interviews);
            setInterviewList(interviews || []);
            setFilteredList(interviews || []);

            if (isRefresh) {
                toast.success('Interviews refreshed successfully');
            }
        } catch (error) {
            console.error('Error fetching interviews:', error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    const handleRefresh = () => {
        GetInterViewList(true);
    }

    const getStats = () => {
        const total = interviewList.length;
        const thisMonth = interviewList.filter(interview => {
            const created = new Date(interview.created_at);
            const now = new Date();
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length;

        return { total, thisMonth };
    }

    const { total, thisMonth } = getStats();

    return (
        <div className='my-8 space-y-6'>
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <Archive className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Interview Archive
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Browse and manage all your created interviews
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </Button>
                </div>
            </div>

            {/* Stats and Controls */}
            {!loading && interviewList.length > 0 && (
                <div className="space-y-4">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Interviews</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">This Month</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{thisMonth}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Search Results</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredList.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and View Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search interviews by job position or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                            >
                                <List className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Section */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                            <Loader2 className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Loading Interviews
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center">
                            Please wait while we fetch your interview data...
                        </p>
                    </div>
                ) : (
                    <>
                        {interviewList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
                                    <Video className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No Interviews Found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
                                    You haven't created any interviews yet. Start by creating your first interview to begin the hiring process.
                                </p>
                                <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Create New Interview
                                </Button>
                            </div>
                        ) : filteredList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                <Search className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    No Results Found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-center">
                                    No interviews match your search criteria. Try different keywords.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => setSearchTerm('')}
                                    className="mt-4"
                                >
                                    Clear Search
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Archive className="w-5 h-5" />
                                        {searchTerm ? `Search Results (${filteredList.length})` : `All Interviews (${interviewList.length})`}
                                    </h2>
                                </div>

                                <div className={`grid gap-6 ${viewMode === 'grid'
                                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                                    : 'grid-cols-1'
                                    }`}>
                                    {filteredList.map((interview, index) => (
                                        <div key={index} className="group hover:scale-[1.02] transition-transform duration-200">
                                            <InterviewCard interview={interview} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default AllInterview