import React, { useState } from 'react';
import { User as UserIcon, Mail, Camera, LogOut, Shield, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { User } from '@/types';

const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>(user || {});
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500">User profile is not available</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await updateUser(formData);
      toast('success', 'Profile updated', 'Your profile has been updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast('error', 'Update failed', 'Failed to update your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your account information and subscription status</p>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="relative h-32 bg-blue-600">
          {/* Profile header */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end px-6 pb-6 pt-32 sm:flex-row sm:items-center sm:space-x-6">
            <div className="relative -mt-16 flex">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 text-gray-300">
                {user.displayName ? (
                  <span className="text-3xl font-bold uppercase text-blue-600">
                    {user.displayName.charAt(0)}
                  </span>
                ) : (
                  <UserIcon size={36} className="text-gray-400" />
                )}
              </div>
            </div>
            <div className="mt-6 flex w-full flex-1 flex-col sm:mt-0">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{user.displayName || user.email}</h2>
                <p className="text-blue-200">
                  {user.isPremium ? 'Premium Member' : 'Free User'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="displayName" className="mb-2 block text-sm font-medium text-gray-700">
                    Display Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserIcon size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={formData.displayName || ''}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 py-2 pl-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      disabled
                      className="block w-full rounded-md border border-gray-300 bg-gray-100 py-2 pl-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="mb-8 grid gap-y-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Display Name</h3>
                  <div className="mt-1 flex items-center">
                    <UserIcon size={16} className="mr-2 text-gray-400" />
                    <span className="text-gray-900">{user.displayName || 'Not set'}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <div className="mt-1 flex items-center">
                    <Mail size={16} className="mr-2 text-gray-400" />
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Membership</h3>
                  <div className="mt-1 flex items-center">
                    <Shield size={16} className="mr-2 text-gray-400" />
                    <span className={`${user.isPremium ? 'text-green-600' : 'text-gray-900'}`}>
                      {user.isPremium ? 'Premium Member' : 'Free User'}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                  <div className="mt-1 flex items-center">
                    <CreditCard size={16} className="mr-2 text-gray-400" />
                    <span className="text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:space-x-4 sm:space-y-0">
                <Button
                  variant="outline"
                  leftIcon={<Camera size={16} />}
                  className="justify-center"
                >
                  Change Photo
                </Button>
                
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="justify-center"
                  >
                    Edit Profile
                  </Button>
                  
                  <Button
                    variant="danger"
                    onClick={() => {
                      logout();
                      toast('info', 'Logged out', 'You have been logged out successfully');
                    }}
                    leftIcon={<LogOut size={16} />}
                    className="justify-center"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        
        {!user.isPremium && (
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900">Upgrade to Premium</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get unlimited access to all premium features
                </p>
              </div>
              <div className="mt-3 sm:mt-0">
                <Button className="w-full sm:w-auto">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;