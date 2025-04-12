'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { useSupabase } from '../providers/SupabaseProvider';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user, isLoading } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if not loading and user is not authenticated
    if (!isLoading && !user) {
      router.push('/auth/signin');
      return;
    }
  }, [user, isLoading, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your platform content and settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Problems Management Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Problems</CardTitle>
            <CardDescription>Manage problem challenges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Create, edit, or delete problem challenges on the platform.
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <span className="text-sm text-blue-600">Manage problems</span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/problems">
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Solutions Management Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Solutions</CardTitle>
            <CardDescription>Review user solutions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              View and moderate user-submitted solutions to problems.
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <span className="text-sm text-blue-600">Manage solutions</span>
            <Button variant="outline" size="sm" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Users Management Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              View, edit user accounts and manage permissions.
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <span className="text-sm text-blue-600">Manage users</span>
            <Button variant="outline" size="sm" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 