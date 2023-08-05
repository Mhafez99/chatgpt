'use client';

import { useEffect } from 'react';

import { Crisp } from 'crisp-sdk-web';

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure('0d5e8fdd-9821-4a36-b47b-69fe34752045');
  }, []);
    return null;
};
