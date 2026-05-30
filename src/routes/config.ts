import { 
    LayoutDashboard, 
    FileText, 
    Mail, 
    MessageSquare, 
    Briefcase, 
    Settings, 
    LucideIcon 
  } from 'lucide-react';
  
  export interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
  }
  
  export const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Analyzer', href: '/analyzer', icon: FileText },
    { name: 'Cover Letters', href: '/cover-letters', icon: Mail },
    { name: 'Interview Prep', href: '/interview', icon: MessageSquare },
    { name: 'Applications', href: '/applications', icon: Briefcase },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];