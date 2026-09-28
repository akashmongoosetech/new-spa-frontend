import { useEffect, useRef, useState } from 'react';
import { AdminUser } from '../../types';
import { api } from '../../services/api';
import { showToast } from '../../utils/toastEvents';

export interface ProfileFormContext {
  currentUser?: AdminUser | null;
  onUpdateCurrentUser?: (u: AdminUser) => void;
}

function readStoredUser(): AdminUser | null {
  try {
    const stored = localStorage.getItem('aura_admin_user');
    return stored ? (JSON.parse(stored) as AdminUser) : null;
  } catch {
    localStorage.removeItem('aura_admin_user');
    return null;
  }
}

export function getInitials(name?: string): string {
  return (name || 'A')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export function formatProfileDate(d?: string): string {
  if (!d) return '—';
  const parsed = new Date(d);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatRole(role?: string): string {
  return (role || 'admin').replace(/_/g, ' ');
}

/**
 * Shared profile-form state + server actions for ProfilePage and
 * AdminProfilePage. Keeps validation, toasts and API calls in one place so
 * the two pages stay in sync.
 */
export function useProfileForm(context: ProfileFormContext) {
  const loaded = context.currentUser;

  const [user, setUser] = useState<AdminUser | null>(readStoredUser);
  const [loading, setLoading] = useState<boolean>(() => !readStoredUser());

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

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [savingUrl, setSavingUrl] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Populate the form from the freshest user object, then fall back to storage.
  useEffect(() => {
    const u = loaded || readStoredUser();
    if (!u) {
      setLoading(false);
      return;
    }
    setUser(u);
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
    setCurrentPassword('');
    setLoading(false);
  }, [loaded]);

  const active = user?.status !== 'inactive';
  const emailChanged = email.trim() !== (user?.email || '');

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
      try {
        localStorage.setItem('aura_admin_user', JSON.stringify(updated));
      } catch {
        /* storage full or unavailable — session continues in memory */
      }
      setUser(updated);
      setCurrentPassword('');
      showToast({ type: 'success', title: 'Profile updated', message: 'Your profile was saved successfully.' });
    } catch (err: unknown) {
      showToast({
        type: 'error',
        title: 'Update failed',
        message: err instanceof Error ? err.message : 'Could not save your profile.',
      });
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
      try {
        localStorage.setItem('aura_admin_user', JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      setUser(updated);
      showToast({ type: 'success', title: 'Profile picture updated' });
    } catch (err: unknown) {
      showToast({
        type: 'error',
        title: 'Upload failed',
        message: err instanceof Error ? err.message : 'Could not upload the picture.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAvatarUrl = async () => {
    const value = avatarUrlInput.trim();
    if (!value) {
      showToast({ type: 'error', title: 'Enter a URL', message: 'Paste an https image link first.' });
      return;
    }
    setSavingUrl(true);
    try {
      const updated = await api.setAvatarUrl(value);
      context.onUpdateCurrentUser?.(updated);
      try {
        localStorage.setItem('aura_admin_user', JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      setUser(updated);
      setAvatarUrlInput('');
      showToast({ type: 'success', title: 'Profile picture updated' });
    } catch (err: unknown) {
      showToast({
        type: 'error',
        title: 'Invalid image link',
        message: err instanceof Error ? err.message : 'Could not use that image URL.',
      });
    } finally {
      setSavingUrl(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setUploading(true);
    try {
      const updated = await api.removeAvatar();
      context.onUpdateCurrentUser?.(updated);
      try {
        localStorage.setItem('aura_admin_user', JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      setUser(updated);
      showToast({ type: 'info', title: 'Profile picture removed' });
    } catch (err: unknown) {
      showToast({
        type: 'error',
        title: 'Remove failed',
        message: err instanceof Error ? err.message : 'Could not remove the picture.',
      });
    } finally {
      setUploading(false);
    }
  };

  return {
    user,
    loading,
    active,
    emailChanged,
    fields: {
      firstName, setFirstName,
      lastName, setLastName,
      name, setName,
      username, setUsername,
      email, setEmail,
      phone, setPhone,
      address, setAddress,
      city, setCity,
      state, setState,
      country, setCountry,
      pincode, setPincode,
      dob, setDob,
      gender, setGender,
      currentPassword, setCurrentPassword,
    },
    saving,
    uploading,
    avatarUrlInput,
    setAvatarUrlInput,
    savingUrl,
    fileRef,
    validateProfile,
    handleSave,
    handleAvatarChange,
    handleSaveAvatarUrl,
    handleRemoveAvatar,
  };
}

export type ProfileForm = ReturnType<typeof useProfileForm>;
