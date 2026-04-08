const ROLE_PERMISSIONS = {
  admin: ['dashboard', 'arsip', 'arsip.crud', 'arsip.download', 'inventaris', 'admin', 'log'],
  management: ['dashboard', 'arsip', 'arsip.crud', 'arsip.download', 'inventaris'],
  staff: ['dashboard', 'arsip', 'inventaris'],
}

export const canAccess = (role, feature) =>
  ROLE_PERMISSIONS[role]?.includes(feature) ?? false
