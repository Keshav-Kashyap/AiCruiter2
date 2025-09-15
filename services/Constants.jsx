import { BriefcaseBusinessIcon, Calendar, Code2Icon, Crown, LayoutDashboard, List, Puzzle, Settings, User2Icon, WalletCards, Users, Zap, MoreHorizontal } from "lucide-react";
import { SiAdobeacrobatreader } from "react-icons/si";
import { RiNetflixFill } from "react-icons/ri";
import { FaGoogle, FaMicrosoft, FaFacebook, FaAmazon, FaPhone, FaPaypal, FaApple } from "react-icons/fa";
export const SideBarOptions = [
    {
        name: 'Dashboard',
        icon: LayoutDashboard,
        path: '/dashboard'
    },
    {
        name: 'Scheduled Interview',
        icon: Calendar,
        path: '/scheduled-interview'
    },
    {
        name: 'All Interview',
        icon: List,
        path: '/all-interview'
    },
    {
        name: 'Billing',
        icon: WalletCards,
        path: '/billing'
    },
    {
        name: 'Settings',
        icon: Settings,
        path: '/settings'
    }
]


export const InterviewType = [
    {
        title: 'Technical',
        icon: Code2Icon
    },
    {
        title: 'Behavioral',
        icon: User2Icon
    },
    {
        title: 'Experience',
        icon: BriefcaseBusinessIcon
    },
    {
        title: 'Problem Solving',
        icon: Puzzle
    },
    {
        title: 'Leadership',
        icon: Crown
    },

]

export const QUESTION_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:
Job Title: {{jobTitle}}
Job Description: {{jobDescription}
CompanyName:{{companyName}}
Interview Duration: {{duration}}
Interview Type: {{type}}
Interview Language: {{language}}

📝 Your task:
Analyze the job description to identify key responsibilities, required skills, and expected experience.
Generate a list of interview questions depends on interview duration.
Adjust the number and depth of questions to match the interview duration.
Ensure the questions match the tone and structure of a real-life {{type}} interview.

🍀 Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
  question:"",
  type:'Technical/Behavioral/Experince/Problem Solving/Leaseship'
},...
]

🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`


export const FEEDBACK_PROMT = `{{conversation}}

Depends on this Interview Conversation between assitant and user, 

Give me feedback for user interview. Give me rating out of 10 for technical Skills, 

Communication, Problem Solving, Experince. Also give me summery in 3 lines 

about the interview and one line to let me know whether is recommanded 

for hire or not with msg. Give me response in JSON format

{

    feedback:{

        rating:{

            techicalSkills:5,

            communication:6,

            problemSolving:4,

            experince:7

        },

        summery:<in 3 Line>,

        Recommendation:'',

        RecommendationMsg:''



    }

}

`



export const plans = [
    {
        id: 'free',
        price: 0,
        name: 'Free',
        icon: <Zap className="w-6 h-6" />,
        color: 'blue',
        features: [
            '3 AI Interview Credits',
            'Basic Interview Templates',
            'Basic Analytics'
        ],
        popular: false
    },
    {
        id: 'basic',
        name: 'Basic Plan',
        price: 12,
        icon: <Zap className="w-6 h-6" />,
        color: 'blue',
        features: [
            '50 AI Interview Credits',
            'Basic Interview Templates',
            'Email Support',
            'Standard Question Bank',
            'Basic Analytics'
        ],
        popular: false
    },

    {
        id: 'professional',
        name: 'Professional Plan',
        price: 15,
        icon: <Users className="w-6 h-6" />,
        color: 'blue',
        features: [
            '150 AI Interview Credits',
            'Advanced Interview Templates',
            'Priority Support',
            'Custom Question Bank',
            'Advanced Analytics',
            'Video Recording Feature'
        ],
        popular: true
    },
    {
        id: 'enterprise',
        name: 'Enterprise Plan',
        price: 30,
        icon: <Crown className="w-6 h-6" />,
        color: 'blue',
        features: [
            'Unlimited AI Interview Credits',
            'Premium Templates & Customization',
            '24/7 Dedicated Support',
            'AI-Powered Question Generation',
            'Comprehensive Analytics Dashboard',
            'Multi-format Export',
            'Team Collaboration Tools',
            'White-label Solution'
        ],
        popular: false
    }
];
// Vibrant, modern colors (hand-picked)
// avatarUtils.js
const avatarColors = [
    '#5A4FCF', '#F06292', '#4DB6AC', '#BA68C8',
    '#FFD54F', '#4FC3F7', '#81C784', '#9575CD',
];

export function getAvatarColor(name = '') {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % avatarColors.length;
    return avatarColors[index];
}

export function getInitial(name = '') {
    return name.charAt(0).toUpperCase();
}


export const companySelected=[
        {
      title:  "Google",
      icon:FaGoogle,
      
        },
         {
      title:  "Microsoft",
      icon:FaMicrosoft,
      
        },
         {
      title:  "Amazon",
      icon:FaAmazon,
      
        },
         {
      title:  "Facebook",
      icon:FaFacebook,
      
        },
         {
      title:  "Paypal",
      icon:FaPaypal,
      
        },
         {
      title:  "Adobe",
      icon:SiAdobeacrobatreader,
      
        },
        
        
         {
      title:  "Netflix",
      icon: RiNetflixFill,
      
        },
        {
      title:  "Other",
      icon:MoreHorizontal,
      
        },

        
     
]