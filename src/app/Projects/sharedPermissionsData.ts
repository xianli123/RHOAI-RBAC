// Shared data store for Permissions tab, Edit role assignment, and Role assignment pages

export interface UserRole {
  role: string;
  roleType: 'openshift-default' | 'openshift-custom' | 'regular';
}

export interface GroupRole {
  role: string;
  roleType: 'openshift-default' | 'openshift-custom' | 'regular';
}

export interface User {
  id: string;
  name: string;
  roles: UserRole[];
  dateCreated: string;
}

export interface Group {
  id: string;
  name: string;
  roles: GroupRole[];
  dateCreated: string;
}

// Shared mock data - this will be updated when roles are saved
export let mockUsers: User[] = [
  {
    id: '1',
    name: 'Maude',
    roles: [
      { role: 'Admin', roleType: 'openshift-default' },
    ],
    dateCreated: '30 Oct 2024',
  },
  {
    id: '2',
    name: 'John',
    roles: [
      { role: 'Contributor', roleType: 'openshift-default' },
    ],
    dateCreated: '30 Oct 2024',
  },
  {
    id: '3',
    name: 'Deena',
    roles: [
      { role: 'Deployment maintainer', roleType: 'regular' },
      { role: 'Workbench maintainer', roleType: 'regular' },
      { role: 'Deployment reader', roleType: 'regular' },
      { role: 'custom-pipeline-super-user', roleType: 'openshift-custom' },
      { role: 'Workbench reader', roleType: 'regular' },
    ],
    dateCreated: '30 Oct 2024',
  },
  {
    id: '4',
    name: 'Diana',
    roles: [
      { role: 'Deployment maintainer', roleType: 'regular' },
      { role: 'Workbench maintainer', roleType: 'regular' },
    ],
    dateCreated: '30 Oct 2024',
  },
  {
    id: '5',
    name: 'Jeff',
    roles: [
      { role: 'Deployment maintainer', roleType: 'regular' },
      { role: 'Workbench maintainer', roleType: 'regular' },
    ],
    dateCreated: '30 Oct 2024',
  },
  {
    id: '6',
    name: 'Gary',
    roles: [
      { role: 'k8sreal-name-is-here', roleType: 'openshift-custom' },
      { role: 'Deployments access', roleType: 'regular' },
    ],
    dateCreated: '30 Oct 2024',
  },
];

export let mockGroups: Group[] = [
  {
    id: '1',
    name: 'dedicated-admins',
    roles: [
      { role: 'Admin', roleType: 'openshift-default' },
    ],
    dateCreated: '30 Oct 2024',
  },
  {
    id: '2',
    name: 'system:serviceaccounts:dedicated-admin',
    roles: [
      { role: 'custom-pipeline-super-user', roleType: 'openshift-custom' },
    ],
    dateCreated: '30 Oct 2024',
  },
];

// Helper function to get role type from role name
const getRoleType = (roleName: string): 'openshift-default' | 'openshift-custom' | 'regular' => {
  // This should match the role types from mockRoles in EditRolesPage
  const openshiftDefaultRoles = ['Admin', 'Contributor'];
  const openshiftCustomRoles = ['custom-pipeline-super-user', 'k8sreal-name-is-here'];
  
  if (openshiftDefaultRoles.includes(roleName)) {
    return 'openshift-default';
  } else if (openshiftCustomRoles.includes(roleName)) {
    return 'openshift-custom';
  }
  return 'regular';
};

// Function to update user roles
export const updateUserRoles = (userName: string, roleNames: string[]) => {
  const user = mockUsers.find(u => u.name === userName);
  if (user) {
    user.roles = roleNames.map(roleName => ({
      role: roleName,
      roleType: getRoleType(roleName),
    }));
  } else {
    // If user doesn't exist, create a new one (for Role assignment page)
    const newUser: User = {
      id: String(mockUsers.length + 1),
      name: userName,
      roles: roleNames.map(roleName => ({
        role: roleName,
        roleType: getRoleType(roleName),
      })),
      dateCreated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    mockUsers.push(newUser);
  }
};

// Function to update group roles
export const updateGroupRoles = (groupName: string, roleNames: string[]) => {
  const group = mockGroups.find(g => g.name === groupName);
  if (group) {
    group.roles = roleNames.map(roleName => ({
      role: roleName,
      roleType: getRoleType(roleName),
    }));
  } else {
    // If group doesn't exist, create a new one (for Role assignment page)
    const newGroup: Group = {
      id: String(mockGroups.length + 1),
      name: groupName,
      roles: roleNames.map(roleName => ({
        role: roleName,
        roleType: getRoleType(roleName),
      })),
      dateCreated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    mockGroups.push(newGroup);
  }
};

