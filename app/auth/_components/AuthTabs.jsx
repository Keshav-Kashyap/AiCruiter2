import React from 'react';
import { Mail, Phone } from 'lucide-react';

const AuthTabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 mb-4 w-full">
            <button
                onClick={() => setActiveTab('email')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 md:py-3 rounded-lg transition-all text-sm md:text-base ${activeTab === 'email'
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white shadow-md border border-white/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
            >
                <Mail className="w-4 h-4" />
                <span className="font-medium">Email</span>
            </button>
            <button
                onClick={() => setActiveTab('phone')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 md:py-3 rounded-lg transition-all text-sm md:text-base ${activeTab === 'phone'
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white shadow-md border border-white/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
            >
                <Phone className="w-4 h-4" />
                <span className="font-medium">Phone</span>
            </button>
        </div>
    );
};

export default AuthTabs;