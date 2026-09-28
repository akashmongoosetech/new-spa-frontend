import React from 'react';
import { AlertCircle, AtSign, Cake, Mail, MapPin, Phone, User } from 'lucide-react';
import type { ProfileForm } from './useProfileForm';
import type { ProfileTone } from './profileTheme';
import { cardClass, inputClassFor, sectionTitleClass } from './profileTheme';

export const inputClass =
  'w-full rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#2CB5A0] focus:outline-none focus:ring-1 focus:ring-[#2CB5A0]';

function Field({
  id,
  label,
  required,
  icon,
  children,
  hint,
}: {
  id: string;
  label: React.ReactNode;
  required?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase text-gray-400"
      >
        {icon}
        <span>
          {label} {required ? <span className="text-rose-500">*</span> : null}
        </span>
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-[11px] text-gray-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface CardsProps {
  form: ProfileForm;
  tone?: ProfileTone;
}

export const PersonalFormCard: React.FC<CardsProps> = ({ form, tone = 'light' }) => {
  const { fields } = form;
  const input = inputClassFor(tone);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <section aria-label="Personal information" className={`${cardClass(tone)} space-y-4 p-5 sm:p-6`}>
      <h3 className={sectionTitleClass(tone)}>
        <User className={`h-4 w-4 ${tone === 'dark' ? 'text-[#C7A36A]' : 'text-[#2CB5A0]'}`} />
        Personal Information
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id="pf-first-name" label="First Name">
          <input
            id="pf-first-name"
            type="text"
            autoComplete="given-name"
            value={fields.firstName}
            onChange={(e) => fields.setFirstName(e.target.value)}
            className={input}
          />
        </Field>
        <Field id="pf-last-name" label="Last Name">
          <input
            id="pf-last-name"
            type="text"
            autoComplete="family-name"
            value={fields.lastName}
            onChange={(e) => fields.setLastName(e.target.value)}
            className={input}
          />
        </Field>
        <Field id="pf-full-name" label="Full Name" required>
          <input
            id="pf-full-name"
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={(e) => fields.setName(e.target.value)}
            className={input}
          />
        </Field>
        <Field
          id="pf-username"
          label="Username"
          icon={<AtSign className="h-3.5 w-3.5 opacity-60" />}
          hint="Optional — 3-30 characters"
        >
          <input
            id="pf-username"
            type="text"
            autoComplete="username"
            value={fields.username}
            onChange={(e) => fields.setUsername(e.target.value)}
            placeholder="e.g. master.director"
            aria-describedby="pf-username-hint"
            className={input}
          />
        </Field>
        <Field id="pf-dob" label="Date of Birth" icon={<Cake className="h-4 w-4 opacity-60" />}>
          <input
            id="pf-dob"
            type="date"
            value={fields.dob}
            max={today}
            onChange={(e) => fields.setDob(e.target.value)}
            className={`${input} [color-scheme:light] dark:[color-scheme:dark]`}
          />
        </Field>
        <Field id="pf-gender" label="Gender">
          <select
            id="pf-gender"
            value={fields.gender}
            onChange={(e) => fields.setGender(e.target.value)}
            className={input}
          >
            <option value="">Prefer not to say</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </Field>
      </div>
    </section>
  );
};

export const ContactFormCard: React.FC<CardsProps> = ({ form, tone = 'light' }) => {
  const { fields, emailChanged } = form;
  const input = inputClassFor(tone);
  const dark = tone === 'dark';

  return (
    <section aria-label="Contact and address" className={`${cardClass(tone)} space-y-4 p-5 sm:p-6`}>
      <h3 className={sectionTitleClass(tone)}>
        <Mail className={`h-4 w-4 ${dark ? 'text-[#C7A36A]' : 'text-[#2CB5A0]'}`} /> Contact
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field id="pf-email" label="Email Address" required>
            <input
              id="pf-email"
              type="email"
              autoComplete="email"
              value={fields.email}
              onChange={(e) => fields.setEmail(e.target.value)}
              className={input}
            />
          </Field>
          {emailChanged ? (
            <div
              role="alert"
              className={`mt-3 flex items-start gap-2 rounded-xl border p-3 ${
                dark ? 'border-amber-300/30 bg-amber-400/10' : 'border-amber-200 bg-amber-50'
              }`}
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div className="min-w-0 flex-1">
                <p className={`text-[11px] font-bold uppercase ${dark ? 'text-amber-200' : 'text-amber-800'}`}>
                  Email change requires confirmation
                </p>
                <label
                  htmlFor="pf-email-password"
                  className={`mt-1 block text-[11px] ${dark ? 'text-amber-200/80' : 'text-amber-700'}`}
                >
                  Enter your current password to confirm the new address
                </label>
                <input
                  id="pf-email-password"
                  type="password"
                  autoComplete="current-password"
                  value={fields.currentPassword}
                  onChange={(e) => fields.setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  className={`${input} mt-2`}
                />
              </div>
            </div>
          ) : null}
        </div>
        <Field id="pf-phone" label="Mobile Number" icon={<Phone className="h-3.5 w-3.5 opacity-60" />}>
          <input
            id="pf-phone"
            type="tel"
            autoComplete="tel"
            value={fields.phone}
            onChange={(e) => fields.setPhone(e.target.value)}
            className={input}
          />
        </Field>
        <Field id="pf-address" label="Address" icon={<MapPin className="h-3.5 w-3.5 opacity-60" />}>
          <input
            id="pf-address"
            type="text"
            autoComplete="street-address"
            value={fields.address}
            onChange={(e) => fields.setAddress(e.target.value)}
            className={input}
          />
        </Field>
        <Field id="pf-city" label="City">
          <input
            id="pf-city"
            type="text"
            autoComplete="address-level2"
            value={fields.city}
            onChange={(e) => fields.setCity(e.target.value)}
            className={input}
          />
        </Field>
        <Field id="pf-state" label="State">
          <input
            id="pf-state"
            type="text"
            autoComplete="address-level1"
            value={fields.state}
            onChange={(e) => fields.setState(e.target.value)}
            className={input}
          />
        </Field>
        <Field id="pf-country" label="Country">
          <input
            id="pf-country"
            type="text"
            autoComplete="country-name"
            value={fields.country}
            onChange={(e) => fields.setCountry(e.target.value)}
            className={input}
          />
        </Field>
        <Field id="pf-pincode" label="Pincode">
          <input
            id="pf-pincode"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            value={fields.pincode}
            onChange={(e) => fields.setPincode(e.target.value)}
            className={input}
          />
        </Field>
      </div>
    </section>
  );
};
