import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Lock, Trash2, Save, AlertTriangle, Camera } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchProfile,
  updateProfile,
  changePassword,
  deleteProfile,
  uploadAvatar,
  clearProfileError,
  clearSuccessMessage,
} from '../store/slices/profileSlice';
import { logout } from '../store/slices/authSlice';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { profile, isLoading, error, successMessage } = useAppSelector((s) => s.profile);
  const { user } = useAppSelector((s) => s.auth);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'danger'>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);



  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setIsUploading(true);
    await dispatch(uploadAvatar(file));
    setIsUploading(false);
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setStreet(profile.address?.street || '');
      setCity(profile.address?.city || '');
      setState(profile.address?.state || '');
      setZip(profile.address?.zip || '');
      setCountry(profile.address?.country || '');
    }
  }, [profile]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
    }
    if (error) {
      toast.error(error);
      dispatch(clearProfileError());
    }
  }, [successMessage, error, dispatch]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      updateProfile({
        name,
        phone,
        address: { street, city, state, zip, country },
      })
    );
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    const result = await dispatch(changePassword({ currentPassword, newPassword }));
    if (changePassword.fulfilled.match(result)) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleDeleteAccount = async () => {
    const result = await dispatch(deleteProfile());
    if (deleteProfile.fulfilled.match(result)) {
      await dispatch(logout());
      toast.success('Account deleted successfully');
      navigate('/', { replace: true });
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earth-50 pt-24">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'password' as const, label: 'Security', icon: Lock },
    { id: 'danger' as const, label: 'Account', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-earth-50 pt-28 pb-16">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <div className="relative group">
              <div className="w-20 h-20 bg-earth-200 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-earth-200 ring-offset-2">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={32} className="text-earth-500" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-200 cursor-pointer"
                aria-label="Upload avatar"
              >
                <Camera
                  size={20}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
              </button>
              {isUploading && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
                aria-hidden="true"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif text-earth-900">
                {profile?.name || 'Your Profile'}
              </h1>
              <p className="text-earth-500 text-sm">{profile?.email}</p>
              <p className="text-earth-400 text-xs mt-0.5">Click photo to change</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-earth-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-gold-500 text-earth-900'
                    : 'border-transparent text-earth-500 hover:text-earth-700'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleUpdateProfile}
              className="bg-white rounded-sm border border-earth-100 shadow-sm p-6 md:p-8 space-y-6"
            >
              <h2 className="font-serif text-xl text-earth-900 mb-2">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<User size={16} />}
                  required
                />
                <Input
                  label="Email Address"
                  value={profile?.email || ''}
                  icon={<Mail size={16} />}
                  disabled
                  className="bg-earth-50"
                />
                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={<Phone size={16} />}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div className="pt-4 border-t border-earth-100">
                <h3 className="font-serif text-lg text-earth-900 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-earth-500" />
                  Shipping Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <Input
                      label="Street Address"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <Input
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                  />
                  <Input
                    label="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Maharashtra"
                  />
                  <Input
                    label="ZIP Code"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="400001"
                  />
                  <Input
                    label="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="India"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save size={16} />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </motion.form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-sm border border-earth-100 shadow-sm p-6 md:p-8"
            >
              {user?.googleId ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock size={24} className="text-earth-400" />
                  </div>
                  <h3 className="font-serif text-lg text-earth-700 mb-2">
                    Signed in with Google
                  </h3>
                  <p className="text-earth-500 text-sm max-w-md mx-auto">
                    Your account uses Google for authentication. Password management is handled through your Google account settings.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
                  <h2 className="font-serif text-xl text-earth-900 mb-2">Change Password</h2>

                  <Input
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    icon={<Lock size={16} />}
                    required
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    icon={<Lock size={16} />}
                    required
                    minLength={6}
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={<Lock size={16} />}
                    required
                    minLength={6}
                    error={
                      confirmPassword && newPassword !== confirmPassword
                        ? 'Passwords do not match'
                        : undefined
                    }
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Lock size={16} />
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              )}
            </motion.div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-sm border border-red-100 shadow-sm p-6 md:p-8"
            >
              <h2 className="font-serif text-xl text-red-700 mb-2 flex items-center gap-2">
                <AlertTriangle size={20} />
                Danger Zone
              </h2>
              <p className="text-earth-600 text-sm mb-6">
                Once you delete your account, there is no going back. All your data including orders, wishlist, and cart will be permanently removed.
              </p>
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(true)}
                className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Account
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-sm shadow-2xl p-8 max-w-md w-full"
          >
            <div className="text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <h3 className="font-serif text-xl text-earth-900 mb-2">
                Delete Account?
              </h3>
              <p className="text-earth-500 text-sm mb-6">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-sm font-medium hover:bg-red-700 transition-colors text-sm"
                >
                  {isLoading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
