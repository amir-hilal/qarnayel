'use client';

import { ADMIN_ROUTES } from '@/config/routes';
import { signIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// =============================================================================
// Login page — email + password sign-in for admin users
// =============================================================================

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      router.push(ADMIN_ROUTES.DASHBOARD);
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
        background: 'var(--color-surface)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '24rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBlockEnd: 'var(--space-8)' }}>
          <h1
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text)',
              marginBlockEnd: 'var(--space-1)',
            }}
          >
            Qarnayel Admin
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-muted)',
            }}
          >
            Sign in to manage content
          </p>
        </div>

        <div className="admin-card">
          <div className="admin-card__body">
            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div
                  className="alert alert--error"
                  role="alert"
                  style={{ marginBlockEnd: 'var(--space-4)' }}
                >
                  {error}
                </div>
              )}

              <div
                className="form-field"
                style={{ marginBlockEnd: 'var(--space-4)' }}
              >
                <label
                  htmlFor="email"
                  className="form-field__label form-field__label--required"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="form-field__input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div
                className="form-field"
                style={{ marginBlockEnd: 'var(--space-6)' }}
              >
                <label
                  htmlFor="password"
                  className="form-field__label form-field__label--required"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="form-field__input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn btn--primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
