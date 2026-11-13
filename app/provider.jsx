"use client"

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider, useUser } from './context/UserProvider';

const Provider = ({ children }) => {
    const [queryClient] = useState(
        () => new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 1000 * 60 * 60 * 24, // 24 hours
                    gcTime: 1000 * 60 * 60 * 24,
                    refetchOnWindowFocus: false,
                    refetchOnMount: false,
                    refetchOnReconnect: false,
                },
            },
        })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <div>{children}</div>
            </UserProvider>
        </QueryClientProvider>
    )
}

export default Provider;
export { useUser };