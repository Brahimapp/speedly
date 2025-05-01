import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const NotFoundPage: React.FC = () => {
  const { user } = useAuth();
  const redirectPath = user ? '/dashboard' : '/';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 sm:h-24 sm:w-24">
            <AlertTriangle className="h-10 w-10 text-blue-600 sm:h-14 sm:w-14" />
          </div>
          <div className="mt-4 sm:ml-6 sm:mt-0 sm:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
            <p className="mt-2 text-base text-gray-500">
              Sorry, we couldn't find the page you're looking for.
            </p>
            <div className="mt-6 flex space-x-3">
              <Button leftIcon={<ArrowLeft className="mr-2 h-4 w-4" />}>
                <Link to={redirectPath}>
                  Go back
                </Link>
              </Button>
              <Button variant="outline">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotFoundPage;