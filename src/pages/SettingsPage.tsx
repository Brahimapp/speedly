import React, { useState } from 'react';
import { Volume2, VolumeX, MapPin, Moon, Sun, Languages } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { UserPreferences } from '@/types';

const SettingsPage: React.FC = () => {
  const { user, updateUserPreferences } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>(
    user?.preferences || {
      speedUnit: 'kph',
      voiceEnabled: true,
      gpsTrackingEnabled: true,
      darkMode: false,
      voiceLanguage: 'en-US',
      voiceGender: 'female',
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const isPremium = user?.isPremium || false;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : value;
    
    setPreferences((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      await updateUserPreferences(preferences);
      toast('success', 'Settings saved', 'Your preferences have been updated successfully');
    } catch (error) {
      toast('error', 'Update failed', 'Failed to update your preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
  ];

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Customize your application experience</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="overflow-hidden rounded-lg bg-white shadow">
          {/* Speed Preferences */}
          <div className="border-b border-gray-200 p-6">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Speed Settings</h2>
            
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Speed Unit
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="speedUnit"
                    value="kph"
                    checked={preferences.speedUnit === 'kph'}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">KPH</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="speedUnit"
                    value="mph"
                    checked={preferences.speedUnit === 'mph'}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">MPH</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <span className="block text-sm font-medium text-gray-700">GPS Tracking</span>
                  <span className="block text-xs text-gray-500">Enable speed monitoring via GPS</span>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="gpsTrackingEnabled"
                  checked={preferences.gpsTrackingEnabled}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100"></div>
              </label>
            </div>
          </div>

          {/* Voice Preferences */}
          <div className="border-b border-gray-200 p-6">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Voice Settings</h2>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {preferences.voiceEnabled ? (
                  <Volume2 className="mr-2 h-5 w-5 text-gray-500" />
                ) : (
                  <VolumeX className="mr-2 h-5 w-5 text-gray-500" />
                )}
                <div>
                  <span className="block text-sm font-medium text-gray-700">Voice Feedback</span>
                  <span className="block text-xs text-gray-500">Enable voice alerts for speed limits</span>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="voiceEnabled"
                  checked={preferences.voiceEnabled}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100"></div>
              </label>
            </div>
            
            {preferences.voiceEnabled && (
              <div className="ml-7 mt-4 space-y-4">
                <div>
                  <label htmlFor="voiceLanguage" className="mb-1 block text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      <Languages className="mr-2 h-4 w-4" />
                      Language
                      {!isPremium && <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">Premium</span>}
                    </div>
                  </label>
                  <select
                    id="voiceLanguage"
                    name="voiceLanguage"
                    value={preferences.voiceLanguage}
                    onChange={handleChange}
                    disabled={!isPremium}
                    className={`mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${!isPremium ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  >
                    {languages.map((language) => (
                      <option key={language.code} value={language.code}>
                        {language.name}
                      </option>
                    ))}
                  </select>
                  {!isPremium && (
                    <p className="mt-1 text-xs text-gray-500">Upgrade to Premium to change language</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Voice Gender
                    {!isPremium && <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">Premium</span>}
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="voiceGender"
                        value="male"
                        checked={preferences.voiceGender === 'male'}
                        onChange={handleChange}
                        disabled={!isPremium}
                        className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 ${!isPremium ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                      <span className={`ml-2 text-gray-700 ${!isPremium ? 'opacity-50' : ''}`}>Male</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="voiceGender"
                        value="female"
                        checked={preferences.voiceGender === 'female'}
                        onChange={handleChange}
                        disabled={!isPremium}
                        className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 ${!isPremium ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                      <span className={`ml-2 text-gray-700 ${!isPremium ? 'opacity-50' : ''}`}>Female</span>
                    </label>
                  </div>
                  {!isPremium && (
                    <p className="mt-1 text-xs text-gray-500">Upgrade to Premium to change voice gender</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Appearance Preferences */}
          <div className="border-b border-gray-200 p-6">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Appearance</h2>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {preferences.darkMode ? (
                  <Moon className="mr-2 h-5 w-5 text-gray-500" />
                ) : (
                  <Sun className="mr-2 h-5 w-5 text-gray-500" />
                )}
                <div>
                  <span className="block text-sm font-medium text-gray-700">Dark Mode</span>
                  <span className="block text-xs text-gray-500">
                    Use dark theme for the app
                    {!isPremium && ' (Premium feature)'}
                  </span>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="darkMode"
                  checked={preferences.darkMode}
                  onChange={handleChange}
                  disabled={!isPremium}
                  className="peer sr-only"
                />
                <div className={`peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 ${!isPremium ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
              </label>
            </div>
            {!isPremium && preferences.darkMode && (
              <p className="mt-2 text-sm text-yellow-600">
                Dark mode will be disabled after save as it requires a Premium subscription.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="bg-gray-50 px-6 py-4 text-right">
            <Button
              type="submit"
              isLoading={isLoading}
            >
              Save Settings
            </Button>
          </div>
        </div>
      </form>
      
      {!isPremium && (
        <div className="mt-6 rounded-lg bg-blue-50 p-4 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Upgrade to Premium</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Unlock all premium features including voice customization, dark mode, and unlimited usage.
                </p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;