export const getAdminPassword = () => import.meta.env.ADMIN_PASSWORD;
export const getAdminUser = () => import.meta.env.ADMIN_USER;
export const isDev = () => import.meta.env.DEV || (typeof process !== 'undefined' && process.env.NODE_ENV === 'test');

