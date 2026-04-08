const ROLE_PERMISSIONS = {
  admin: ['dashboard', 'arsip', 'inventaris', 'admin'],
  management: ['dashboard', 'arsip', 'inventaris'],
  staff: ['dashboard', 'arsip', 'inventaris'],
}

export const canAccess = (role, feature) =>
  ROLE_PERMISSIONS[role]?.includes(feature) ?? false
