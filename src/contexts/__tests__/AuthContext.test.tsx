import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext';
import api from '../../lib/api';

const TestComponent = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>loading</div>;
  return <div>{user ? `hi:${user.email}` : 'no-user'}</div>;
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('bootstraps with no token', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await waitFor(() => expect(screen.getByText('no-user')).toBeInTheDocument());
  });

  it('loads user from token', async () => {
    const fakeUser = { id: 1, name: 'John', email: 'john@example.com' };
    localStorage.setItem('talenthub_token', 'tok');
    // mock api.get without replacing the whole api object so interceptors remain
    // @ts-ignore
    api.get = vi.fn().mockResolvedValue({ data: fakeUser });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText(/hi:/)).toBeInTheDocument());
  });
});
