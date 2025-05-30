import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_SIP_URL: z.string().optional(),
    VITE_SIP_USER_NAME: z.string().optional(),
    VITE_SIP_USER_PASSWORD: z.string().optional(),
    VITE_CALL_TO_URL: z.string().optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
