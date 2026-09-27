'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/shell/Layout';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { AuthFlow } from '@/components/auth/AuthFlow';

export function AuthGate() {
  const [checked, setChecked] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    setOnboarded(window.localStorage.getItem('poprate-onboarded') === '1');
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (!onboarded) return <AuthFlow onComplete={() => setOnboarded(true)} />;
  return <Layout><HomeScreen /></Layout>;
}
