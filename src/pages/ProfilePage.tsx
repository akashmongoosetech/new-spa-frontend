import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Save,
  Camera,
  Trash2,
  Loader2,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Key,
  Lock,
  LogOut,
} from 'lucide-react';
import { AdminUser } from '../../types';
import { api } from '../../services/api';
import { showToast } from '../../utils/toastEvents';

const inputClass =
  'w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-[#2CB5A0] focus:outline-none';

const getInitials = (name?: string) =>
  (name || 'A')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

interface ProfileContext {
  currentUser?: AdminUser | null;
  onUpdateCurrentUser?: (u: AdminUser) => void;
  settings?: any;
  searchQuery?: string;
}

export const ProfilePage: React.FC = () => {
  const context = useOutletContext<ProfileContext>() || {};
  const loaded = context.currentUser;

  const [user, setUser] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem('aura_admin_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [pincode, setPincode] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const active = user?.status !== 'inactive';

  useEffect(() => {
    const u = loaded || user;
    if (!u) return;
    setFirstName(u.firstName || '');
    setLastName(u.lastName || '');
    setName(u.name || '');
    setUsername(u.username || '');
    setEmail(u.email || '');
    setPhone(u.phone || '');
    setAddress(u.address || '');
    setCity(u.city || '');
    setState(u.state || '');
    setCountry(u.country || '');
    setPincode(u.pincode || '');
    setDob(u.dob || '');
    setGender(u.gender || '');
  }, [loaded]);

  if (!user) {
    return (
      <div className="max-w-3xl p-8 text-sm text-gray-500">
        Unable to load your profile. Please sign in again.
      </div>
    );
  }

  const emailChanged = email.trim() !== (user.email || '');

  const validateProfile = (): string | null => {
    if (!name.trim()) return 'Full name cannot be empty.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Enter a valid email address.';
    if (username.trim() && !/^[a-zA-Z0-9._-]{3,30}$/.test(username.trim())) {
      return 'Username must be 3-30 characters using letters, numbers, dots, dashes or underscores.';
    }
    if (dob && new Date(dob) > new Date()) return 'Date of birth cannot be in the future.';
    if (emailChanged && !currentPassword) return 'Enter your current password to change your email.';
    return null;
  };

  const validatePassword = (): string | null => {
    if (!currentPassword) return 'Current password is required.';
    if (String(newPassword).length < 6) return 'New password must be at least 6 characters.';
    if (newPassword !== confirmNewPassword) return 'New passwords do not match.';
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    if (!hasLetter || !hasNumber) return 'Password must contain at least one letter and one number.';
    return null;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateProfile();
    if (err) {
      showToast({ type: 'error', title: 'Check the form', message: err });
      return;
    }
    setSaving(true);
    try {
      const updated = await api.updateProfile({
        name: name.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        country: country.trim(),
        pincode: pincode.trim(),
        dob: dob || '',
        gender,
        currentPassword: emailChanged ? currentPassword : undefined,
      });
      context.onUpdateCurrentUser?.(updated);
      setUser(updated);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      showToast({ type: 'success', title: 'Profile updated', message: 'Your profile was saved successfully.' });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Update failed', message: err?.message || 'Could not save your profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileRef.current) fileRef.current.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast({ type: 'error', title: 'Invalid file', message: 'Only image files are allowed.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast({ type: 'error', title: 'File too large', message: 'Profile pictures must be under 5 MB.' });
      return;
    }
    setUploading(true);
    try {
      const updated = await api.uploadAvatar(file);
      context.onUpdateCurrentUser?.(updated);
      setUser(updated);
      showToast({ type: 'success', title: 'Profile picture updated' });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Upload failed', message: err?.message || 'Could not upload the picture.' });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setUploading(true);
    try {
      const updated = await api.removeAvatar();
      context.onUpdateCurrentUser?.(updated);
      setUser(updated);
      showToast({ type: 'info', title: 'Profile picture removed' });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Remove failed', message: err?.message || 'Could not remove the picture.' });
    } finally {
      setUploading(false);
    }
  };

  const formattedDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">My Profile</h1>
        <p className="text-xs text-gray-500 mt-1">Manage your personal details, contact information and profile picture</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: avatar + account summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-[#2CB5A0] shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#2CB5A0]/15 border-2 border-[#2CB5A0] flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#158c7c]">{getInitials(user.name)}</span>
                </div>
              )}
              <div className="text-center">
                <h3 className="font-bold text-gray-900">{user.name || 'Staff Member'}</h3>
                <p className="text-xs text-[#2CB5A0] font-semibold capitalize">
                  {(user.role || 'admin').replace(/_/g, ' ')}
                </p>
              </div>
              <div className="flex items-center gap-2 w-full">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex-1 px-3 py-2.5 bg-[#2CB5A0] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </button>
                {user.avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={uploading}
                    className="px-3 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    title="Remove photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase text-gray-500">Account Status</h4>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className={`font-bold ${active ? 'text-emerald-600' : 'text-rose-600'}`}>
                {active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Role</span>
              <span className="font-bold text-gray-800 capitalize">{(user.role || 'admin').replace(/_/g, ' ')}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" /> Member since
              </span>
              <span className="font-semibold text-gray-700">{formattedDate(user.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Last login</span>
              <span className="font-semibold text-gray-700">{formattedDate(user.lastLogin)}</span>
            </div>
          </div>
        </div>

        {/* Right: editable sections */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase text-gray-500">Personal Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5 flex items-center gap-1">
                  <AtSign className="w-3.5 h-3.5 text-gray-400" /> Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Optional — 3-30 characters"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Date of Birth</label>
                <div className="relative">
                  <Cake className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={dob}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setDob(e.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputClass}>
                  <option value="">Prefer not to say</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#2CB5A0]" /> Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                {emailChanged && (
                  <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-amber-800 uppercase">Email change requires confirmation</p>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        className={`${inputClass} mt-2 bg-white`}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> Mobile Number
                </label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> Address
                </label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">State</label>
                <input type="text" value={state} onChange={(e) => setState(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Country</label>
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Pincode</label>
                <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
              <Key className="w-4 h-4 text-[#2CB5A0]" /> Change Password
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Enter your current password"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={saving || changingPassword}
              className="px-6 py-3 bg-[#2CB5A0] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;