'use client';

import { Bell, MapPin, User } from 'lucide-react';
import Link from 'next/link';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white border-t shadow-md dark:bg-gray-900 dark:border-gray-700">
      <div className="flex justify-around items-center py-2 text-gray-600 dark:text-gray-300">
        <Link href="/notice" className="flex flex-col items-center gap-1 hover:text-blue-500 transition">
          <Bell className="h-5 w-5" />
          <span className="text-xs">Notices</span>
        </Link>

        <Link href="/location" className="flex flex-col items-center gap-1 hover:text-blue-500 transition">
          <MapPin className="h-5 w-5" />
          <span className="text-xs">Locations</span>
        </Link>

        <Link href="/profile" className="flex flex-col items-center gap-1 hover:text-blue-500 transition">
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
