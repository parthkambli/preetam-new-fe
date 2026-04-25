export const getUserPermissions = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return [];

    const rolePerms = user.accessRoleId?.permissions || [];
    const customPerms = user.customPermissions || [];
    const removedPerms = user.removedPermissions || [];

    // 🔥 FINAL PERMISSIONS LOGIC
    return [
      ...new Set(
        [...rolePerms, ...customPerms].filter(
          (p) => !removedPerms.includes(p)
        )
      ),
    ];
  } catch {
    return [];
  }
};

export const hasPermission = (permission) => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const rolePermissions = user?.accessRoleId?.permissions || [];
    const custom = user?.customPermissions || [];
    const removed = user?.removedPermissions || [];

    const final = [
      ...new Set([
        ...rolePermissions.filter((p) => !removed.includes(p)),
        ...custom,
      ]),
    ];

    return final.includes(permission);
  } catch {
    return false;
  }
};