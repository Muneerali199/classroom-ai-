'use client';

import Link from 'next/link';
import { useRouter } from '@/routing';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

import { motion } from 'framer-motion';

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await getSupabase().auth.signOut();
    router.push('/login');
  };

  const getInitials = (name: string | null | undefined, fallback: string) => {
    if (!name) return fallback;
    const parts = name.split(' ');
    if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (name[0] || '').toUpperCase();
  }
<<<<<<< HEAD

  const getFirstName = (name: string | null | undefined) => {
    if (!name) return 'Teacher';
    return name.split(' ')[0];
  }

  const getNeumorphicStyle = (pressed = false, inset = false, size = 'normal') => {
    const shadowSize = size === 'large' ? '12px' : size === 'small' ? '4px' : '8px';
    const shadowBlur = size === 'large' ? '24px' : size === 'small' ? '8px' : '16px';
    
    return {
      background: pressed || inset ? 
        'linear-gradient(145deg, #d0d0d0, #f0f0f0)' : 
        'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
      boxShadow: pressed || inset ?
        `inset ${shadowSize} ${shadowSize} ${shadowBlur} #bebebe, inset -${shadowSize} -${shadowSize} ${shadowBlur} #ffffff` :
        `${shadowSize} ${shadowSize} ${shadowBlur} #bebebe, -${shadowSize} -${shadowSize} ${shadowBlur} #ffffff`
    };
  };

=======
  
>>>>>>> 199af3475761fe42d3e41253973aa62af258ba8f
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-10 flex h-16 items-center gap-4 px-4 md:px-6 backdrop-blur-lg"
      style={{
        background: 'linear-gradient(135deg, #e3e3e3 0%, #f7f7f7 50%, #e8e8e8 100%)',
        boxShadow: getNeumorphicStyle(false, false, 'small').boxShadow
      }}
    >
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex w-full items-center justify-end gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                className="relative h-10 w-10 rounded-full p-0"
                style={getNeumorphicStyle()}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL ?? "https://picsum.photos/100"} alt="User avatar" data-ai-hint="person" />
                  <AvatarFallback className="text-sm">
                    {getInitials(user?.displayName || user?.email, 'T')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-56 rounded-2xl border-0 p-2" 
            align="end" 
            forceMount
            style={getNeumorphicStyle(false, false, 'large')}
          >
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-700">
                  {user?.displayName ?? 'Teacher'}
                </p>
                <p className="text-xs leading-none text-gray-600">
                  {user?.email ?? 'teacher@edutrack.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-gray-300" />
            <DropdownMenuItem 
              className="rounded-xl cursor-pointer px-3 py-2 my-1 text-gray-700 focus:text-gray-900 focus:bg-transparent"
              style={getNeumorphicStyle(false, true, 'small')}
              asChild
            >
              <Link href="/dashboard/profile" className="w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="rounded-xl cursor-pointer px-3 py-2 my-1 text-gray-700 focus:text-gray-900 focus:bg-transparent"
              style={getNeumorphicStyle(false, true, 'small')}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-gray-300" />
            <DropdownMenuItem 
              className="rounded-xl cursor-pointer px-3 py-2 my-1 text-red-600 focus:text-red-800 focus:bg-transparent"
              style={getNeumorphicStyle(false, true, 'small')}
              onClick={handleLogout}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}