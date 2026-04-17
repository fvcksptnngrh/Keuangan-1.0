const ROLE_PERMISSIONS = {
  admin: ['dashboard', 'arsip', 'arsip.crud', 'arsip.download', 'admin', 'log'],
  management: ['dashboard', 'arsip', 'arsip.crud', 'arsip.download'],
  staff: ['dashboard', 'arsip'],
}

export const canAccess = (role, feature) =>
  ROLE_PERMISSIONS[role]?.includes(feature) ?? false
