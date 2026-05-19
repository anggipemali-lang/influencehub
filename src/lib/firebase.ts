// THIS FILE IS MOCKED TO SUPPORT LEGACY IMPORTS WHILE MIGRATING TO CUSTOM AUTH
export const auth: any = {
  currentUser: null,
  signOut: () => Promise.resolve(),
};

export const db: any = {};

const app = {};
export default app;
