import * as React from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { updateUserRoles, updateGroupRoles, mockUsers, mockGroups } from './sharedPermissionsData';
import {
  PageSection,
  Title,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  Flex,
  FlexItem,
  Label,
  Stack,
  StackItem,
  Alert,
  AlertVariant,
  SearchInput,
  FormGroup,
  Form,
  Content,
  Popover,
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
  MenuToggleElement,
  Radio,
  Modal,
  ModalHeader,
  ModalBody,
  TextInput,
  Tooltip,
  TreeView,
  TreeViewDataItem,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ISortBy,
} from '@patternfly/react-table';
import {
  AngleDownIcon,
  AngleRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InfoCircleIcon,
  OutlinedQuestionCircleIcon,
} from '@patternfly/react-icons';

interface Role {
  id: string;
  name: string;
  description: string;
  roleType: 'openshift-default' | 'openshift-custom' | 'regular';
  originallyAssigned: boolean;
  currentlyAssigned: boolean;
  rules?: RoleRule[];
}

interface RoleRule {
  actions: string[];
  apiGroups: string[];
  resources: string[];
  resourceNames?: string[];
}

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'custom-pipeline-super-user',
    description: 'Custom OpenShift role with pipeline super user permissions.',
    roleType: 'openshift-custom',
    originallyAssigned: true,
    currentlyAssigned: true,
    rules: [
      {
        actions: ['create', 'delete', 'get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['tekton.dev'],
        resources: ['Pipelines'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '2',
    name: 'Deployment maintainer',
    description: 'User can view and manage all model deployments.',
    roleType: 'regular',
    originallyAssigned: true,
    currentlyAssigned: true,
    rules: [
      {
        actions: ['create', 'delete', 'deletecollection', 'get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['api.groups.name'],
        resources: ['ModelDeployments'],
        resourceNames: undefined,
      },
      {
        actions: ['get', 'list', 'patch'],
        apiGroups: ['api.groups.name.aa'],
        resources: ['Project'],
        resourceNames: ['project name'],
      },
    ],
  },
  {
    id: '3',
    name: 'Deployment reader',
    description: 'User can view and open model deployments without modifying their configuration.',
    roleType: 'regular',
    originallyAssigned: true,
    currentlyAssigned: true,
    rules: [
      {
        actions: ['get', 'list', 'watch'],
        apiGroups: ['api.groups.name'],
        resources: ['ModelDeployments'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '4',
    name: 'Workbench maintainer',
    description: 'User can view and manage all workbenches. Applies to all workbenches.',
    roleType: 'regular',
    originallyAssigned: true,
    currentlyAssigned: true,
    rules: [
      {
        actions: ['create', 'delete', 'deletecollection', 'get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['api.groups.name'],
        resources: ['Workbenches'],
        resourceNames: undefined,
      },
      {
        actions: ['get', 'list', 'patch'],
        apiGroups: ['api.groups.name.aa'],
        resources: ['Project'],
        resourceNames: ['project name'],
      },
    ],
  },
  {
    id: '5',
    name: 'Workbench reader',
    description: 'User can view and open workbenches without modifying their configuration.',
    roleType: 'regular',
    originallyAssigned: true,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['get', 'list', 'watch'],
        apiGroups: ['api.groups.name'],
        resources: ['Workbenches'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '6',
    name: 'Workbench updater',
    description: 'User can view workbenches and modify their configuration, but cannot create or delete them.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: true,
    rules: [
      {
        actions: ['get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['api.groups.name'],
        resources: ['Workbenches'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '7',
    name: 'Admin',
    description: 'User can edit the project and manage user access. User can view and manage any project resource.',
    roleType: 'openshift-default',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['create', 'delete', 'deletecollection', 'get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['*'],
        resources: ['*'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '8',
    name: 'Contributor',
    description: 'User can view and manage any project resource. Users with this role can manage all resources in the namespace, including workbenches, model deployments, and cluster storage, except for permissions controlling.',
    roleType: 'openshift-default',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['create', 'delete', 'get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['api.groups.name'],
        resources: ['Workbenches', 'ModelDeployments', 'Pipelines'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '9',
    name: 'Deployment updater',
    description: 'User can view model deployments and update existing deployments.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['api.groups.name'],
        resources: ['ModelDeployments'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '10',
    name: 'Pipeline maintainer',
    description: 'User can view and manage all pipelines.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['create', 'delete', 'deletecollection', 'get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['tekton.dev'],
        resources: ['Pipelines'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '11',
    name: 'Pipeline updater',
    description: 'User can view pipelines and modify their configuration, but cannot create or delete them.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['tekton.dev'],
        resources: ['Pipelines'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '12',
    name: 'Pipeline reader',
    description: 'User can view and open pipelines without modifying their configuration.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['get', 'list', 'watch'],
        apiGroups: ['tekton.dev'],
        resources: ['Pipelines'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '13',
    name: 'k8sreal-name-is-here',
    description: 'Custom OpenShift role with Kubernetes specific permissions.',
    roleType: 'openshift-custom',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['create', 'delete', 'get', 'list', 'patch', 'update', 'watch'],
        apiGroups: [''],
        resources: ['pods', 'services'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '14',
    name: 'k8s-custom-role',
    description: 'Custom OpenShift role with advanced Kubernetes permissions.',
    roleType: 'openshift-custom',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['create', 'delete', 'get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['apps'],
        resources: ['deployments', 'replicasets'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '15',
    name: 'Deployments access',
    description: 'User can access and interact with deployments.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['get', 'list', 'watch'],
        apiGroups: ['api.groups.name'],
        resources: ['Deployments'],
        resourceNames: undefined,
      },
    ],
  },
];

const EditRolesPage: React.FunctionComponent = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const subjectType = searchParams.get('subjectType') || 'User';
  const subjectName = searchParams.get('subjectName') || '';
  const designOptionFromUrl = searchParams.get('designOption');
  
  // Get current shared data dynamically (will be updated when roles are saved)
  const getMockUsersData = () => mockUsers.map(u => ({ name: u.name, roles: u.roles }));
  const getMockGroupsData = () => mockGroups.map(g => ({ name: g.name, roles: g.roles }));
  
  // Get subject's current roles from Permissions tab data (reads from shared data)
  const getSubjectRoles = (): string[] => {
    if (subjectType === 'User') {
      const user = mockUsers.find(u => u.name === subjectName);
      return user?.roles.map(r => r.role) || [];
    } else {
      const group = mockGroups.find(g => g.name === subjectName);
      return group?.roles.map(r => r.role) || [];
    }
  };
  
  // Check if subject has any OpenShift custom roles
  const subjectHasOpenShiftCustomRole = (): boolean => {
    if (subjectType === 'User') {
      const user = mockUsers.find(u => u.name === subjectName);
      return user?.roles.some(r => r.roleType === 'openshift-custom') || false;
    } else {
      const group = mockGroups.find(g => g.name === subjectName);
      return group?.roles.some(r => r.roleType === 'openshift-custom') || false;
    }
  };
  
  // Initialize roles with correct originallyAssigned status based on Permissions tab data
  const initializeRoles = (): Role[] => {
    const subjectRoles = getSubjectRoles();
    
    // Get the specific OpenShift custom roles that the subject has
    const subjectOpenShiftCustomRoles = subjectRoles.filter(roleName => {
      const role = mockRoles.find(r => r.name === roleName);
      return role?.roleType === 'openshift-custom';
    });
    
    // Filter roles: exclude OpenShift custom roles that the subject doesn't have
    const filteredRoles = mockRoles.filter(role => {
      // If it's not an OpenShift custom role, always include it
      if (role.roleType !== 'openshift-custom') {
        return true;
      }
      // If it's an OpenShift custom role, only include it if the subject has it
      return subjectOpenShiftCustomRoles.includes(role.name);
    });
    
    // Ensure we always return roles, even if filteredRoles is empty
    if (filteredRoles.length === 0) {
      return mockRoles.map(role => ({
        ...role,
        originallyAssigned: false,
        currentlyAssigned: false,
      }));
    }
    
    return filteredRoles.map(role => {
      const isAssigned = subjectRoles.includes(role.name);
      return {
        ...role,
        originallyAssigned: isAssigned,
        currentlyAssigned: isAssigned,
      };
    });
  };
  
  const [roles, setRoles] = React.useState<Role[]>(() => {
    const initialized = initializeRoles();
    // Fallback to show all roles if initialization returns empty
    return initialized.length > 0 ? initialized : mockRoles.map(role => ({
      ...role,
      originallyAssigned: false,
      currentlyAssigned: false,
    }));
  });
  
  // Re-initialize roles when subject changes or when navigating to this page
  // This ensures we always read the latest shared data
  React.useEffect(() => {
    const initialized = initializeRoles();
    // Fallback to show all roles if initialization returns empty
    if (initialized.length > 0) {
      setRoles(initialized);
    } else {
      setRoles(mockRoles.map(role => ({
        ...role,
        originallyAssigned: false,
        currentlyAssigned: false,
      })));
    }
  }, [subjectName, subjectType, searchParams]); // Include searchParams to detect navigation
  
  // Update selectedOption when URL parameter changes
  React.useEffect(() => {
    if (designOptionFromUrl === 'option2') {
      setSelectedOption('option2');
    }
  }, [designOptionFromUrl]);
  
  const [expandedRoles, setExpandedRoles] = React.useState<Set<string>>(new Set());
  const [statusSortBy, setStatusSortBy] = React.useState<ISortBy>({
    index: 2,
    direction: 'asc',
  });
  const [roleNameSortBy, setRoleNameSortBy] = React.useState<ISortBy>({
    index: 1,
    direction: 'asc',
  });
  const [option2StatusSortBy, setOption2StatusSortBy] = React.useState<ISortBy>({
    index: 3,
    direction: 'asc',
  });
  const [option2ActiveSort, setOption2ActiveSort] = React.useState<'roleName' | 'status'>('roleName');
  const [searchValue, setSearchValue] = React.useState('');
  const [selectedOption, setSelectedOption] = React.useState<'option1' | 'option2' | 'option3'>(() => {
    // If URL parameter indicates option2, use that; otherwise default to option3
    return designOptionFromUrl === 'option2' ? 'option2' : 'option3';
  });
  const [isDesignOptionDropdownOpen, setIsDesignOptionDropdownOpen] = React.useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState(false);
  const [selectedRoleForModal, setSelectedRoleForModal] = React.useState<Role | null>(null);
  const [rulesSortBy, setRulesSortBy] = React.useState<ISortBy>({
    index: 0,
    direction: 'asc',
  });
  const [rulesPageSize, setRulesPageSize] = React.useState(10);
  const [openPopovers, setOpenPopovers] = React.useState<Set<string>>(new Set());
  const [isSaveConfirmModalOpen, setIsSaveConfirmModalOpen] = React.useState(false);
  const [allTreeItemsExpanded, setAllTreeItemsExpanded] = React.useState(true);

  const getLabelPopoverContent = (labelType: 'ai' | 'openshift-default' | 'openshift-custom', roleName?: string) => {
    switch (labelType) {
      case 'ai':
        return {
          title: 'AI Role',
          body: 'This role is an AI-generated role that provides intelligent access control based on usage patterns and requirements. AI roles are automatically created and optimized to match your project\'s specific needs.',
        };
      case 'openshift-default':
        return {
          title: 'OpenShift Default Role',
          body: 'OpenShift default roles are predefined roles provided by the OpenShift platform. These roles have standard permissions that cannot be modified. They are maintained by the platform and provide consistent access control across all projects.',
          roleName: roleName,
        };
      case 'openshift-custom':
        return {
          title: 'OpenShift Custom Role',
          body: 'OpenShift custom roles are user-defined roles created within the OpenShift platform. These roles can be customized to meet specific project requirements and provide fine-grained access control tailored to your organization\'s needs.',
          roleName: roleName,
        };
      default:
        return { title: '', body: '' };
    }
  };

  const renderAILabel = (popoverId: string) => {
    const isOpen = openPopovers.has(popoverId);
    const content = getLabelPopoverContent('ai');
    const label = (
      <Label
        color="grey"
        variant="outline"
        isCompact
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          borderRadius: '16px',
          cursor: 'pointer',
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!isOpen) {
            setOpenPopovers((prev) => {
              const newSet = new Set(prev);
              newSet.add(popoverId);
              return newSet;
            });
          }
        }}
      >
        <svg
          className="pf-v6-svg"
          viewBox="0 0 32 32"
          fill="currentColor"
          aria-hidden="true"
          role="img"
          width="1em"
          height="1em"
          style={{ width: '12px', height: '12px' }}
        >
          <path
            xmlns="http://www.w3.org/2000/svg"
            className="st1"
            d="M26.037,16.962c-5.905-.468-10.531-5.094-11-11-.042-.52-.517-.961-1.038-.961s-.997.442-1.038.962c-.468,5.905-5.094,10.531-11,11-.52.042-.961.517-.961,1.038s.442.997.962,1.038c5.905.468,10.531,5.094,11,11,.042.52.517.961,1.038.961s.997-.442,1.038-.962c.468-5.905,5.094-10.531,10.999-10.999,0,0,0,0,0,0,.52-.042.961-.517.961-1.038s-.442-.997-.962-1.038ZM14,25.764c-1.413-3.545-4.219-6.352-7.764-7.764,3.545-1.413,6.352-4.219,7.764-7.764,1.413,3.545,4.219,6.352,7.764,7.764-3.545,1.413-6.352,4.219-7.764,7.764ZM30.096,6.025c-1.55-.346-2.775-1.571-3.123-3.125-.104-.458-.504-.778-.974-.778s-.87.32-.975.781c-.346,1.55-1.571,2.775-3.125,3.123-.458.104-.778.504-.778.974s.32.87.781.975c1.55.346,2.775,1.571,3.123,3.125.104.458.504.778.974.778s.87-.32.975-.781c.346-1.55,1.571-2.775,3.122-3.122,0,0,.002,0,.003,0,.458-.104.778-.504.778-.974s-.32-.87-.781-.975ZM26,8.917c-.481-.778-1.139-1.436-1.917-1.917.778-.481,1.436-1.139,1.917-1.917.481.778,1.139,1.436,1.917,1.917-.778.481-1.436,1.139-1.917,1.917Z"
          />
        </svg>
        AI role
      </Label>
    );
    
    if (selectedOption === 'option2' || selectedOption === 'option3') {
      return (
        <Popover
          headerContent={
            <div style={{ fontWeight: 600 }}>{content.title}</div>
          }
          bodyContent="This is a placeholder. Not real data."
          showClose
          isVisible={isOpen}
          shouldOpen={() => {
            setOpenPopovers((prev) => {
              const newSet = new Set(prev);
              if (!newSet.has(popoverId)) {
                newSet.add(popoverId);
              }
              return newSet;
            });
            return true;
          }}
          shouldClose={() => {
            setOpenPopovers((prev) => {
              const newSet = new Set(prev);
              newSet.delete(popoverId);
              return newSet;
            });
            return true;
          }}
        >
          {label}
        </Popover>
      );
    }
    
    return label;
  };

  const toggleRoleExpansion = (roleId: string) => {
    setExpandedRoles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(roleId)) {
        newSet.delete(roleId);
      } else {
        newSet.add(roleId);
      }
      return newSet;
    });
  };

  const handleRoleToggle = (roleId: string) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === roleId ? { ...role, currentlyAssigned: !role.currentlyAssigned } : role
      )
    );
  };

  const getRoleStatus = (role: Role): string => {
    if (role.currentlyAssigned && role.originallyAssigned) {
      return 'Currently assigned';
    } else if (role.currentlyAssigned && !role.originallyAssigned) {
      return 'Assigning';
    } else if (!role.currentlyAssigned && role.originallyAssigned) {
      return 'Unassigning';
    }
    return '-';
  };

  const getStatusPriority = (status: string): number => {
    if (status === 'Currently assigned') return 1;
    if (status === 'Assigning') return 2;
    if (status === 'Unassigning') return 3;
    return 4; // '-'
  };

  const getFilteredRoles = (): Role[] => {
    if (!searchValue) return roles;
    return roles.filter((role) =>
      role.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const getSortedRolesOption1 = (): Role[] => {
    const filtered = getFilteredRoles();
    return filtered.sort((a, b) => {
      const statusA = getRoleStatus(a);
      const statusB = getRoleStatus(b);
      const priorityA = getStatusPriority(statusA);
      const priorityB = getStatusPriority(statusB);

      if (priorityA !== priorityB) {
        return statusSortBy.direction === 'asc'
          ? priorityA - priorityB
          : priorityB - priorityA;
      }
      return a.name.localeCompare(b.name);
    });
  };

  const getSortedRolesOption2 = (): Role[] => {
    const filtered = getFilteredRoles();
    return filtered.sort((a, b) => {
      if (option2ActiveSort === 'status') {
        const statusA = getRoleStatus(a);
        const statusB = getRoleStatus(b);
        
        // Special handling: "Unassigning" roles maintain their alphabetical order
        // Treat them as priority 1 (same as "Currently assigned") but keep their relative order
        const isUnassignedA = statusA === 'Unassigning';
        const isUnassignedB = statusB === 'Unassigning';
        
        // If both are "Unassigning", maintain alphabetical order
        if (isUnassignedA && isUnassignedB) {
          return a.name.localeCompare(b.name);
        }
        
        // If one is "Unassigning", treat it as priority 1 (same as "Currently assigned")
        const priorityA = isUnassignedA ? 1 : getStatusPriority(statusA);
        const priorityB = isUnassignedB ? 1 : getStatusPriority(statusB);

        if (priorityA !== priorityB) {
          return option2StatusSortBy.direction === 'asc'
            ? priorityA - priorityB
            : priorityB - priorityA;
        }
        // If status priority is the same, sort by role name as secondary
        return a.name.localeCompare(b.name);
      } else {
        // Sort by role name
        const comparison = a.name.localeCompare(b.name);
        return roleNameSortBy.direction === 'asc' ? comparison : -comparison;
      }
    });
  };

  const getSortedRoles = (): Role[] => {
    return selectedOption === 'option1' ? getSortedRolesOption1() : getSortedRolesOption2();
  };

  const getStatusSortParams = () => ({
    sortBy: statusSortBy,
    onSort: (_event: any, index: number, direction: 'asc' | 'desc') => {
      setStatusSortBy({ index, direction });
    },
    columnIndex: 2,
  });

  const getRoleNameSortParams = () => ({
    sortBy: roleNameSortBy,
    onSort: (_event: any, index: number, direction: 'asc' | 'desc') => {
      setRoleNameSortBy({ index, direction });
      setOption2ActiveSort('roleName');
    },
    columnIndex: 1,
  });

  const getOption2StatusSortParams = () => {
    // Status column index: 3 for Option 2, 4 for Option 3 (because Option 3 has Role type column)
    const statusColumnIndex = selectedOption === 'option3' ? 4 : 3;
    return {
      sortBy: option2StatusSortBy,
      onSort: (_event: any, index: number, direction: 'asc' | 'desc') => {
        setOption2StatusSortBy({ index, direction });
        setOption2ActiveSort('status');
      },
      columnIndex: statusColumnIndex,
    };
  };

  const renderRoleBadge = (role: Role) => {
    // Option 1: Original behavior (keep existing labels)
    if (selectedOption === 'option1') {
    if (role.roleType === 'openshift-default') {
      return <Label color="blue" variant="outline" isCompact>OpenShift default</Label>;
    } else if (role.roleType === 'openshift-custom') {
      return <Label color="purple" variant="outline" isCompact>OpenShift custom</Label>;
    }
      return null;
    }

    // Option 2 and Option 3: With all labels (add AI label for regular roles and OpenShift default roles)
    if (selectedOption === 'option2' || selectedOption === 'option3') {
      if (role.roleType === 'openshift-default') {
        // For OpenShift default roles, show AI label before OpenShift default label
        const aiPopoverId = `ai-edit-${role.id}`;
        const openshiftPopoverId = `openshift-default-edit-${role.id}`;
        const openshiftContent = getLabelPopoverContent('openshift-default', role.name);
        const openshiftLabel = (
          <Label 
            color="grey" 
            variant="outline" 
            isCompact
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={(e) => {
              e.stopPropagation();
              const isCurrentlyOpen = openPopovers.has(openshiftPopoverId);
              if (!isCurrentlyOpen) {
                setOpenPopovers((prev) => {
                  const newSet = new Set(prev);
                  newSet.add(openshiftPopoverId);
                  return newSet;
                });
              }
            }}
          >
            <svg
              className="pf-v6-svg"
              viewBox="0 0 100 100"
              fill="currentColor"
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              style={{ width: '12px', height: '12px' }}
            >
              <path fill="#1F1F1F" d="M29,45.3L13,51.1c0.2,2.6,0.6,5.1,1.3,7.6l15.3-5.6C29,50.6,28.8,47.9,29,45.3"/>
              <path fill="#1F1F1F" d="M100,27.5c-1.1-2.3-2.4-4.5-3.9-6.7L80,26.7c1.9,1.9,3.4,4.1,4.7,6.4L100,27.5z"/>
              <path fill="#1F1F1F" d="M64.7,23c3.3,1.6,6.2,3.7,8.7,6.2l16.1-5.8C85,17.1,78.9,11.8,71.5,8.4c-22.9-10.7-50.3-0.7-61,22.2 C7,38,5.7,45.9,6.3,53.5l16.1-5.8c0.3-3.5,1.1-7,2.7-10.3C32,22.5,49.8,16,64.7,23"/>
              <path fill="#1F1F1F" d="M15.3,58.4L0,63.9c1.4,5.6,3.8,10.8,7.2,15.5l16-5.8C19.1,69.4,16.3,64.1,15.3,58.4"/>
              <path fill="#1F1F1F" d="M81.8,52.3c-0.3,3.5-1.1,7-2.7,10.3C72.1,77.5,54.4,84,39.5,77c-3.3-1.6-6.3-3.7-8.7-6.2l-16,5.8 c4.4,6.2,10.5,11.5,17.9,14.9c22.9,10.7,50.3,0.7,61-22.2c3.5-7.4,4.7-15.3,4.1-22.9L81.8,52.3z"/>
              <path fill="#1F1F1F" d="M85.7,32.7l-15.3,5.6c2.8,5.1,4.2,10.9,3.7,16.8l16-5.8C89.8,43.5,88.3,37.9,85.7,32.7"/>
              <path fill="#1F1F1F" d="M29,48.5c0-1.1,0-2.1,0.1-3.2L13,51.1c0.1,1,0.2,2.1,0.4,3.1L29,48.5z"/>
              <path fill="#1F1F1F" d="M97.7,23.3c-0.5-0.8-1-1.6-1.6-2.4L80,26.7c0.7,0.7,1.4,1.5,2,2.3L97.7,23.3z"/>
              <path fill="#1F1F1F" d="M14.7,76.7c1.2,1.7,2.6,3.4,4.1,5l17.4-6.4c-2-1.3-3.9-2.8-5.5-4.4L14.7,76.7z M97.8,46.5l-16,5.8 c-0.2,2.3-0.6,4.6-1.4,6.9l17.4-6.4C98,50.7,98,48.6,97.8,46.5"/>
            </svg>
          <span style={{ marginLeft: '4px' }}>OpenShift default role</span>
        </Label>
        );
        
        const openshiftLabelWithPopover = (
          <Popover
            headerContent={
              <div style={{ fontWeight: 600 }}>{openshiftContent.title}</div>
            }
            bodyContent="This is a placeholder. Not real data."
            showClose
            isVisible={openPopovers.has(openshiftPopoverId)}
            shouldOpen={() => {
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                if (!newSet.has(openshiftPopoverId)) {
                  newSet.add(openshiftPopoverId);
                }
                return newSet;
              });
              return true;
            }}
            shouldClose={() => {
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(openshiftPopoverId);
                return newSet;
              });
              return true;
            }}
          >
            {openshiftLabel}
          </Popover>
        );
        
        return (
          <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
            {renderAILabel(aiPopoverId)}
            <div style={{ width: '4px' }} />
            {openshiftLabelWithPopover}
          </Flex>
        );
      } else if (role.roleType === 'openshift-custom') {
        // OpenShift custom roles don't get AI label
        const openshiftPopoverId = `openshift-custom-edit-${role.id}`;
        const openshiftContent = getLabelPopoverContent('openshift-custom', role.name);
        const openshiftLabel = (
          <Label 
            color="grey" 
            variant="outline" 
            isCompact
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={(e) => {
              e.stopPropagation();
              const isCurrentlyOpen = openPopovers.has(openshiftPopoverId);
              if (!isCurrentlyOpen) {
                setOpenPopovers((prev) => {
                  const newSet = new Set(prev);
                  newSet.add(openshiftPopoverId);
                  return newSet;
                });
              }
            }}
          >
            <svg
              className="pf-v6-svg"
              viewBox="0 0 100 100"
              fill="currentColor"
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              style={{ width: '12px', height: '12px' }}
            >
              <path fill="#1F1F1F" d="M29,45.3L13,51.1c0.2,2.6,0.6,5.1,1.3,7.6l15.3-5.6C29,50.6,28.8,47.9,29,45.3"/>
              <path fill="#1F1F1F" d="M100,27.5c-1.1-2.3-2.4-4.5-3.9-6.7L80,26.7c1.9,1.9,3.4,4.1,4.7,6.4L100,27.5z"/>
              <path fill="#1F1F1F" d="M64.7,23c3.3,1.6,6.2,3.7,8.7,6.2l16.1-5.8C85,17.1,78.9,11.8,71.5,8.4c-22.9-10.7-50.3-0.7-61,22.2 C7,38,5.7,45.9,6.3,53.5l16.1-5.8c0.3-3.5,1.1-7,2.7-10.3C32,22.5,49.8,16,64.7,23"/>
              <path fill="#1F1F1F" d="M15.3,58.4L0,63.9c1.4,5.6,3.8,10.8,7.2,15.5l16-5.8C19.1,69.4,16.3,64.1,15.3,58.4"/>
              <path fill="#1F1F1F" d="M81.8,52.3c-0.3,3.5-1.1,7-2.7,10.3C72.1,77.5,54.4,84,39.5,77c-3.3-1.6-6.3-3.7-8.7-6.2l-16,5.8 c4.4,6.2,10.5,11.5,17.9,14.9c22.9,10.7,50.3,0.7,61-22.2c3.5-7.4,4.7-15.3,4.1-22.9L81.8,52.3z"/>
              <path fill="#1F1F1F" d="M85.7,32.7l-15.3,5.6c2.8,5.1,4.2,10.9,3.7,16.8l16-5.8C89.8,43.5,88.3,37.9,85.7,32.7"/>
              <path fill="#1F1F1F" d="M29,48.5c0-1.1,0-2.1,0.1-3.2L13,51.1c0.1,1,0.2,2.1,0.4,3.1L29,48.5z"/>
              <path fill="#1F1F1F" d="M97.7,23.3c-0.5-0.8-1-1.6-1.6-2.4L80,26.7c0.7,0.7,1.4,1.5,2,2.3L97.7,23.3z"/>
              <path fill="#1F1F1F" d="M14.7,76.7c1.2,1.7,2.6,3.4,4.1,5l17.4-6.4c-2-1.3-3.9-2.8-5.5-4.4L14.7,76.7z M97.8,46.5l-16,5.8 c-0.2,2.3-0.6,4.6-1.4,6.9l17.4-6.4C98,50.7,98,48.6,97.8,46.5"/>
            </svg>
          <span style={{ marginLeft: '4px' }}>OpenShift custom role</span>
        </Label>
        );
        
        const openshiftLabelWithPopover = (
          <Popover
            headerContent={
              <div style={{ fontWeight: 600 }}>{openshiftContent.title}</div>
            }
            bodyContent="This is a placeholder. Not real data."
            showClose
            isVisible={openPopovers.has(openshiftPopoverId)}
            shouldOpen={() => {
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                if (!newSet.has(openshiftPopoverId)) {
                  newSet.add(openshiftPopoverId);
                }
                return newSet;
              });
              return true;
            }}
            shouldClose={() => {
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(openshiftPopoverId);
                return newSet;
              });
              return true;
            }}
          >
            {openshiftLabel}
          </Popover>
        );
        
        return openshiftLabelWithPopover;
      } else {
        // Regular role - add AI label
        const aiPopoverId = `ai-edit-${role.id}`;
        return renderAILabel(aiPopoverId);
      }
    }

    return null;
  };

  const renderRoleTypeLabels = (role: Role) => {
    // Only for Option 3: Render just the labels
    if (selectedOption === 'option3') {
      if (role.roleType === 'openshift-default') {
        // For OpenShift default roles, show AI label and OpenShift default label
        const aiPopoverId = `ai-roletype-${role.id}`;
        const openshiftPopoverId = `openshift-default-roletype-${role.id}`;
        const openshiftContent = getLabelPopoverContent('openshift-default', role.name);
        const openshiftLabel = (
          <Label 
            color="grey" 
            variant="outline" 
            isCompact
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={(e) => {
              e.stopPropagation();
              const isCurrentlyOpen = openPopovers.has(openshiftPopoverId);
              if (!isCurrentlyOpen) {
                setOpenPopovers((prev) => {
                  const newSet = new Set(prev);
                  newSet.add(openshiftPopoverId);
                  return newSet;
                });
              }
            }}
          >
            <svg
              className="pf-v6-svg"
              viewBox="0 0 100 100"
              fill="currentColor"
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              style={{ width: '12px', height: '12px' }}
            >
              <path fill="#1F1F1F" d="M29,45.3L13,51.1c0.2,2.6,0.6,5.1,1.3,7.6l15.3-5.6C29,50.6,28.8,47.9,29,45.3"/>
              <path fill="#1F1F1F" d="M100,27.5c-1.1-2.3-2.4-4.5-3.9-6.7L80,26.7c1.9,1.9,3.4,4.1,4.7,6.4L100,27.5z"/>
              <path fill="#1F1F1F" d="M64.7,23c3.3,1.6,6.2,3.7,8.7,6.2l16.1-5.8C85,17.1,78.9,11.8,71.5,8.4c-22.9-10.7-50.3-0.7-61,22.2 C7,38,5.7,45.9,6.3,53.5l16.1-5.8c0.3-3.5,1.1-7,2.7-10.3C32,22.5,49.8,16,64.7,23"/>
              <path fill="#1F1F1F" d="M15.3,58.4L0,63.9c1.4,5.6,3.8,10.8,7.2,15.5l16-5.8C19.1,69.4,16.3,64.1,15.3,58.4"/>
              <path fill="#1F1F1F" d="M81.8,52.3c-0.3,3.5-1.1,7-2.7,10.3C72.1,77.5,54.4,84,39.5,77c-3.3-1.6-6.3-3.7-8.7-6.2l-16,5.8 c4.4,6.2,10.5,11.5,17.9,14.9c22.9,10.7,50.3,0.7,61-22.2c3.5-7.4,4.7-15.3,4.1-22.9L81.8,52.3z"/>
              <path fill="#1F1F1F" d="M85.7,32.7l-15.3,5.6c2.8,5.1,4.2,10.9,3.7,16.8l16-5.8C89.8,43.5,88.3,37.9,85.7,32.7"/>
              <path fill="#1F1F1F" d="M29,48.5c0-1.1,0-2.1,0.1-3.2L13,51.1c0.1,1,0.2,2.1,0.4,3.1L29,48.5z"/>
              <path fill="#1F1F1F" d="M97.7,23.3c-0.5-0.8-1-1.6-1.6-2.4L80,26.7c0.7,0.7,1.4,1.5,2,2.3L97.7,23.3z"/>
              <path fill="#1F1F1F" d="M14.7,76.7c1.2,1.7,2.6,3.4,4.1,5l17.4-6.4c-2-1.3-3.9-2.8-5.5-4.4L14.7,76.7z M97.8,46.5l-16,5.8 c-0.2,2.3-0.6,4.6-1.4,6.9l17.4-6.4C98,50.7,98,48.6,97.8,46.5"/>
            </svg>
          <span style={{ marginLeft: '4px' }}>OpenShift default role</span>
        </Label>
        );
        
        const openshiftLabelWithPopover = (
          <Popover
            headerContent={
              <div style={{ fontWeight: 600 }}>{openshiftContent.title}</div>
            }
            bodyContent="This is a placeholder. Not real data."
            showClose
            isVisible={openPopovers.has(openshiftPopoverId)}
            shouldOpen={() => {
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                if (!newSet.has(openshiftPopoverId)) {
                  newSet.add(openshiftPopoverId);
                }
                return newSet;
              });
              return true;
            }}
            shouldClose={() => {
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(openshiftPopoverId);
                return newSet;
              });
              return true;
            }}
          >
            {openshiftLabel}
          </Popover>
        );
        
        return (
          <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
            {renderAILabel(aiPopoverId)}
            <div style={{ width: '4px' }} />
            {openshiftLabelWithPopover}
          </Flex>
        );
      } else if (role.roleType === 'openshift-custom') {
        // OpenShift custom roles don't get AI label
        const openshiftPopoverId = `openshift-custom-roletype-${role.id}`;
        const openshiftContent = getLabelPopoverContent('openshift-custom', role.name);
        const openshiftLabel = (
          <Label 
            color="grey" 
            variant="outline" 
            isCompact
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={(e) => {
              e.stopPropagation();
              const isCurrentlyOpen = openPopovers.has(openshiftPopoverId);
              if (!isCurrentlyOpen) {
                setOpenPopovers((prev) => {
                  const newSet = new Set(prev);
                  newSet.add(openshiftPopoverId);
                  return newSet;
                });
              }
            }}
          >
            <svg
              className="pf-v6-svg"
              viewBox="0 0 100 100"
              fill="currentColor"
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              style={{ width: '12px', height: '12px' }}
            >
              <path fill="#1F1F1F" d="M29,45.3L13,51.1c0.2,2.6,0.6,5.1,1.3,7.6l15.3-5.6C29,50.6,28.8,47.9,29,45.3"/>
              <path fill="#1F1F1F" d="M100,27.5c-1.1-2.3-2.4-4.5-3.9-6.7L80,26.7c1.9,1.9,3.4,4.1,4.7,6.4L100,27.5z"/>
              <path fill="#1F1F1F" d="M64.7,23c3.3,1.6,6.2,3.7,8.7,6.2l16.1-5.8C85,17.1,78.9,11.8,71.5,8.4c-22.9-10.7-50.3-0.7-61,22.2 C7,38,5.7,45.9,6.3,53.5l16.1-5.8c0.3-3.5,1.1-7,2.7-10.3C32,22.5,49.8,16,64.7,23"/>
              <path fill="#1F1F1F" d="M15.3,58.4L0,63.9c1.4,5.6,3.8,10.8,7.2,15.5l16-5.8C19.1,69.4,16.3,64.1,15.3,58.4"/>
              <path fill="#1F1F1F" d="M81.8,52.3c-0.3,3.5-1.1,7-2.7,10.3C72.1,77.5,54.4,84,39.5,77c-3.3-1.6-6.3-3.7-8.7-6.2l-16,5.8 c4.4,6.2,10.5,11.5,17.9,14.9c22.9,10.7,50.3,0.7,61-22.2c3.5-7.4,4.7-15.3,4.1-22.9L81.8,52.3z"/>
              <path fill="#1F1F1F" d="M85.7,32.7l-15.3,5.6c2.8,5.1,4.2,10.9,3.7,16.8l16-5.8C89.8,43.5,88.3,37.9,85.7,32.7"/>
              <path fill="#1F1F1F" d="M29,48.5c0-1.1,0-2.1,0.1-3.2L13,51.1c0.1,1,0.2,2.1,0.4,3.1L29,48.5z"/>
              <path fill="#1F1F1F" d="M97.7,23.3c-0.5-0.8-1-1.6-1.6-2.4L80,26.7c0.7,0.7,1.4,1.5,2,2.3L97.7,23.3z"/>
              <path fill="#1F1F1F" d="M14.7,76.7c1.2,1.7,2.6,3.4,4.1,5l17.4-6.4c-2-1.3-3.9-2.8-5.5-4.4L14.7,76.7z M97.8,46.5l-16,5.8 c-0.2,2.3-0.6,4.6-1.4,6.9l17.4-6.4C98,50.7,98,48.6,97.8,46.5"/>
            </svg>
          <span style={{ marginLeft: '4px' }}>OpenShift custom role</span>
        </Label>
        );
        
        const openshiftLabelWithPopover = (
          <Popover
            headerContent={
              <div style={{ fontWeight: 600 }}>{openshiftContent.title}</div>
            }
            bodyContent="This is a placeholder. Not real data."
            showClose
            isVisible={openPopovers.has(openshiftPopoverId)}
            shouldOpen={() => {
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                if (!newSet.has(openshiftPopoverId)) {
                  newSet.add(openshiftPopoverId);
                }
                return newSet;
              });
              return true;
            }}
            shouldClose={() => {
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(openshiftPopoverId);
                return newSet;
              });
              return true;
            }}
          >
            {openshiftLabel}
          </Popover>
        );
        
        return openshiftLabelWithPopover;
      } else {
        // Regular role - add AI label
        const aiPopoverId = `ai-roletype-${role.id}`;
        return renderAILabel(aiPopoverId);
      }
    }
    
    return null;
  };

  const renderStatusBadge = (role: Role) => {
    const status = getRoleStatus(role);
    const isOpenShiftCustom = role.roleType === 'openshift-custom';
    
    // If role was originally assigned but is now deselected
    if (role.originallyAssigned && !role.currentlyAssigned) {
      const helpTextElement = isOpenShiftCustom ? (() => {
        const helpTextPopoverId = `help-text-popover-${role.id}`;
        const helpTextSpan = (
          <span
            style={{ 
              textDecoration: 'underline dashed',
              color: 'var(--pf-t--global--text--color--status--danger--default)',
              textUnderlineOffset: 'var(--pf-t--global--spacer--xs)',
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(helpTextPopoverId)) {
                  newSet.delete(helpTextPopoverId);
                } else {
                  newSet.add(helpTextPopoverId);
                }
                return newSet;
              });
            }}
          >
            Role cannot be re-assigned in OpenShift AI
          </span>
        );

      return (
          <Popover
            position="bottom"
            bodyContent={
              <div>
                <div style={{ marginBottom: '8px' }}>Role cannot be re-assigned in OpenShift AI</div>
                <div>OpenShift custom roles cannot be assigned in OpenShift AI. You'll need to use OpenShift to assign it again.</div>
              </div>
            }
            showClose
            isVisible={openPopovers.has(helpTextPopoverId)}
            onHide={() => {
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(helpTextPopoverId);
                return newSet;
              });
            }}
          >
            {helpTextSpan}
          </Popover>
        );
      })() : null;
      
      // For Option 3, only show "Unassigning" label
      if (selectedOption === 'option3') {
        // For OpenShift custom roles, make the label clickable with popover
        if (isOpenShiftCustom) {
          const unassigningPopoverId = `unassigning-popover-${role.id}`;
          return (
            <Popover
              position="bottom"
              bodyContent="OpenShift custom roles cannot be assigned in OpenShift AI. You'll need to use OpenShift to assign it again."
              showClose
              isVisible={openPopovers.has(unassigningPopoverId)}
              onHide={() => {
                setOpenPopovers((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(unassigningPopoverId);
                  return newSet;
                });
              }}
            >
              <Label 
                color="red" 
                variant="filled" 
                isCompact 
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenPopovers((prev) => {
                    const newSet = new Set(prev);
                    if (newSet.has(unassigningPopoverId)) {
                      newSet.delete(unassigningPopoverId);
                    } else {
                      newSet.add(unassigningPopoverId);
                    }
                    return newSet;
                  });
                }}
              >
                Unassigning
              </Label>
            </Popover>
          );
        }
        return (
          <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
            <Label color="red" variant="outline" isCompact>Unassigning</Label>
            {helpTextElement}
          </Flex>
        );
      }
      // For other options, show both labels
      // For OpenShift custom roles, make the Unassigning label clickable with popover
      if (isOpenShiftCustom) {
        const unassigningPopoverId = `unassigning-popover-${role.id}`;
        return (
          <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
            <Label color="green" variant="outline" isCompact>Currently assigned</Label>
            <Popover
              position="bottom"
              bodyContent="OpenShift custom roles cannot be assigned in OpenShift AI. You'll need to use OpenShift to assign it again."
              showClose
              isVisible={openPopovers.has(unassigningPopoverId)}
              onHide={() => {
                setOpenPopovers((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(unassigningPopoverId);
                  return newSet;
                });
              }}
            >
              <Label 
                color="red" 
                variant="filled" 
                isCompact 
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenPopovers((prev) => {
                    const newSet = new Set(prev);
                    if (newSet.has(unassigningPopoverId)) {
                      newSet.delete(unassigningPopoverId);
                    } else {
                      newSet.add(unassigningPopoverId);
                    }
                    return newSet;
                  });
                }}
              >
                Unassigning
              </Label>
            </Popover>
            {helpTextElement}
          </Flex>
        );
      }
      return (
        <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
          <Label color="green" variant="outline" isCompact>Currently assigned</Label>
          <Label color="red" variant="outline" isCompact>Unassigning</Label>
          {helpTextElement}
        </Flex>
      );
    }
    
    // Otherwise show single status label
    if (status === 'Currently assigned') {
      return <Label color="green" variant="outline" isCompact>{status}</Label>;
    } else if (status === 'Assigning') {
      return <Label color="orange" variant="outline" isCompact>{status}</Label>;
    } else if (status === 'Unassigning') {
      return <Label color="red" variant="outline" isCompact>{status}</Label>;
    }
    return <span style={{ color: 'var(--pf-v5-global--Color--200)' }}>-</span>;
  };

  const handleRoleNameClick = (role: Role) => {
    setSelectedRoleForModal(role);
    setRulesPageSize(10);
    setIsRoleModalOpen(true);
  };

  const getSortedRules = (rules: RoleRule[]): RoleRule[] => {
    const sorted = [...rules];
    const columnIndex = rulesSortBy.index;
    const direction = rulesSortBy.direction;

    sorted.sort((a, b) => {
      let comparison = 0;
      
      if (columnIndex === 0) {
        // Sort by Actions
        const aActions = a.actions.join(', ');
        const bActions = b.actions.join(', ');
        comparison = aActions.localeCompare(bActions);
      } else if (columnIndex === 1) {
        // Sort by API Groups
        const aApiGroups = a.apiGroups.join(', ');
        const bApiGroups = b.apiGroups.join(', ');
        comparison = aApiGroups.localeCompare(bApiGroups);
      } else if (columnIndex === 2) {
        // Sort by Resources
        const aResources = a.resources.join(', ');
        const bResources = b.resources.join(', ');
        comparison = aResources.localeCompare(bResources);
      } else if (columnIndex === 3) {
        // Sort by Resource names
        const aResourceNames = (a.resourceNames || []).join(', ') || '-';
        const bResourceNames = (b.resourceNames || []).join(', ') || '-';
        comparison = aResourceNames.localeCompare(bResourceNames);
      }

      return direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  };

  const getRulesSortParams = (columnIndex: number) => ({
    sortBy: rulesSortBy,
    onSort: (_event: any, index: number, direction: 'asc' | 'desc') => {
      setRulesSortBy({ index, direction });
    },
    columnIndex,
  });

  const sortedRoles = getSortedRoles();
  const hasChanges = roles.some((role) => {
    // Check if the role's currentlyAssigned state differs from its originallyAssigned state
    return role.currentlyAssigned !== role.originallyAssigned;
  });

  // Check if there are any changes (assigning or unassigning)
  const hasAnyChanges = (): boolean => {
    return roles.some(role => 
      (role.originallyAssigned && !role.currentlyAssigned) || // Being unassigned
      (!role.originallyAssigned && role.currentlyAssigned)     // Being assigned
    );
  };

  // Handle save action
  const handleSave = () => {
    // Always show confirmation modal if there are any changes
    if (hasAnyChanges()) {
      setIsSaveConfirmModalOpen(true);
    } else {
      performSave();
    }
  };

  // Perform the actual save operation
  const performSave = () => {
    // Get all currently assigned roles
    const assignedRoles = roles
      .filter(role => role.currentlyAssigned)
      .map(role => role.name);
    
    // Update shared data
    if (subjectType === 'User') {
      updateUserRoles(subjectName, assignedRoles);
    } else {
      updateGroupRoles(subjectName, assignedRoles);
    }
    
    // Navigate back to permissions tab
    navigate(`/projects/${projectId}?tab=permissions`);
  };

  return (
    <>
      <style>{`
        .pf-m-expanded .pf-v6-c-table__toggle-icon svg {
          transform: rotate(90deg);
        }
        .pf-v6-c-button.pf-m-link.pf-m-inline {
          text-decoration: none !important;
        }
        .pf-v6-c-button.pf-m-link.pf-m-inline:hover {
          text-decoration: none !important;
        }
      `}</style>
      <div style={{ 
        backgroundColor: '#f0e6ff', 
        padding: '16px',
        borderBottom: '1px solid var(--pf-v5-global--BorderColor--200)'
      }}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsLg' }}>
          <FlexItem>
            <span style={{ fontWeight: 600, fontSize: 'var(--pf-v5-global--FontSize--md)' }}>Design Option:</span>
          </FlexItem>
          <FlexItem>
            <Select
              isOpen={isDesignOptionDropdownOpen}
              onOpenChange={(isOpen) => setIsDesignOptionDropdownOpen(isOpen)}
              selected={selectedOption}
              onSelect={(_event, value) => {
                setSelectedOption(value as 'option1' | 'option2' | 'option3');
                setIsDesignOptionDropdownOpen(false);
              }}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsDesignOptionDropdownOpen(!isDesignOptionDropdownOpen)}
                  isExpanded={isDesignOptionDropdownOpen}
                  style={{ minWidth: '450px' }}
                >
                  {selectedOption === 'option1' ? 'Option 1' : selectedOption === 'option2' ? 'Option 2' : '[UXD recommended] Option 3 - Show role labels in a separate column'}
                </MenuToggle>
              )}
            >
              <SelectList>
                <SelectOption value="option1">Option 1</SelectOption>
                <SelectOption value="option2">Option 2</SelectOption>
                <SelectOption value="option3">[UXD recommended] Option 3 - Show role labels in a separate column</SelectOption>
              </SelectList>
            </Select>
          </FlexItem>
        </Flex>
      </div>
      <div className="pf-v6-c-page__main-breadcrumb">
        <div style={{ padding: 'var(--pf-v5-global--spacer--lg) var(--pf-v5-global--spacer--lg)' }}>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/projects">Projects</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to={`/projects/${projectId}`}>{projectId}</Link>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>Manage roles</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>

      <PageSection>
        <Title headingLevel="h1" size="2xl">
          Manage roles
        </Title>
        <Content style={{ marginTop: 'var(--pf-v5-global--spacer--sm)' }}>
          Description goes here.
        </Content>
      </PageSection>

      <PageSection isFilled>
        <div style={{ maxWidth: '840px' }}>
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h2" size="lg">Subject</Title>
            <Form style={{ marginTop: '16px' }}>
              {selectedOption !== 'option2' && selectedOption !== 'option3' && (
              <div className="pf-v6-c-form__group">
                <div className="pf-v6-c-form__group-label">
                  <label className="pf-v6-c-form__label" htmlFor="subject-type">
                      <span className="pf-v6-c-form__label-text">Subject kind</span>
                  </label>
                </div>
                <div className="pf-v6-c-form__group-control">{subjectType}</div>
              </div>
              )}
              <div className="pf-v6-c-form__group" style={{ marginTop: (selectedOption !== 'option2' && selectedOption !== 'option3') ? 'var(--pf-v5-global--spacer--md)' : '0px' }}>
                <div className="pf-v6-c-form__group-label">
                  <label className="pf-v6-c-form__label" htmlFor="subject-name">
                    <span className="pf-v6-c-form__label-text">
                      {subjectType === 'User' ? 'User name' : 'Group name'}
                    </span>
                    <span style={{ color: 'var(--pf-v5-global--danger-color--100)' }}> *</span>
                  </label>
                </div>
                <div className="pf-v6-c-form__group-control">
                  {(selectedOption === 'option2' || selectedOption === 'option3') ? (
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 'var(--pf-v5-global--spacer--sm) var(--pf-v5-global--spacer--md)',
                      backgroundColor: 'var(--pf-v5-global--BackgroundColor--200)',
                      border: '1px solid var(--pf-v5-global--BorderColor--300)',
                      borderRadius: 'var(--pf-v5-global--BorderRadius--sm)',
                      color: 'var(--pf-v5-global--Color--100)'
                    }}>
                      {subjectType === 'User' ? (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '16px',
                          height: '16px',
                          borderRadius: '8px',
                          background: 'var(--ai-user--BackgroundColor, #f5e6d3)',
                          color: 'var(--ai-user--IconColor, #000)',
                          flexShrink: 0
                        }}>
                          <svg className="pf-v6-svg" viewBox="0 0 36 36" fill="currentColor" aria-hidden="true" role="img" width="16px" height="16px" style={{ width: '16px', height: '16px' }}>
                            <path d="M21.32,17.8C27.8,14.41,25.42,4.39,18,4.38s-9.8,10-3.32,13.42A13.63,13.63,0,0,0,4.38,31a.61.61,0,0,0,.62.62H31a.61.61,0,0,0,.62-.62A13.63,13.63,0,0,0,21.32,17.8Zm-9.2-6.3c.25-7.76,11.51-7.76,11.76,0C23.63,19.26,12.37,19.26,12.12,11.5ZM5.64,30.38C7,14.79,29.05,14.8,30.36,30.38Z"></path>
                          </svg>
                        </div>
                      ) : (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '16px',
                          height: '16px',
                          borderRadius: '8px',
                          background: 'var(--ai-group--BackgroundColor, #f5e6d3)',
                          color: 'var(--ai-group--IconColor, #000)',
                          flexShrink: 0
                        }}>
                          <svg className="pf-v6-svg" viewBox="0 0 36 36" fill="currentColor" aria-hidden="true" role="img" width="16px" height="16px" style={{ width: '16px', height: '16px' }}>
                            <path d="m 27.87,23.29 a 3.86,3.86 0 1 0 -4.74,0 A 7.11,7.11 0 0 0 18.38,30 0.61,0.61 0 0 0 19,30.62 H 32 A 0.63,0.63 0 0 0 32.63,30 7.13,7.13 0 0 0 27.87,23.29 Z m -5,-3 a 2.62,2.62 0 0 1 5.24,0 2.62,2.62 0 0 1 -5.23,-0.04 z m -3.22,9.13 c 0.84,-6.94 10.84,-6.93 11.68,0 z M 16,19.38 a 0.62,0.62 0 0 0 0,1.24 h 4 a 0.62,0.62 0 0 0 0,-1.24 z m -2.63,-4 a 6,6 0 0 1 9.48,0.18 0.61,0.61 0 0 0 0.66,-0.07 c 1.07,-1 -2.27,-3 -3.13,-3.21 a 3.86,3.86 0 1 0 -4.76,0 c -0.86,0.25 -4.2,2.18 -3.13,3.21 a 0.62,0.62 0 0 0 0.88,-0.11 z m 2,-6.13 a 2.62,2.62 0 0 1 5.24,0 2.62,2.62 0 0 1 -5.23,0 z m -2.5,14.04 a 3.86,3.86 0 1 0 -4.74,0 A 7.11,7.11 0 0 0 3.38,30 0.61,0.61 0 0 0 4,30.62 H 17 A 0.63,0.63 0 0 0 17.63,30 7.13,7.13 0 0 0 12.87,23.29 Z m -5,-3 a 2.62,2.62 0 0 1 5.24,0 2.62,2.62 0 0 1 -5.23,-0.04 z m -3.21,9.09 c 0.84,-6.94 10.84,-6.93 11.68,0 z"></path>
                          </svg>
                        </div>
                      )}
                      <span>{subjectName || `Select ${subjectType.toLowerCase()}`}</span>
                    </div>
                  ) : (
                    <div>{subjectName || `Select ${subjectType.toLowerCase()}`}</div>
                  )}
                </div>
              </div>
            </Form>
          </StackItem>

          <StackItem style={{ marginTop: '40px' }}>
            <Title headingLevel="h2" size="lg">Role assignment</Title>
            <Content style={{ marginTop: '16px', marginBottom: '8px' }}>
              Check the role to grant the relevant permissions.
            </Content>

            <div style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
              <SearchInput
                placeholder="Find by name"
                value={searchValue}
                onChange={(_event, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
                aria-label="Find by name"
              />
            </div>

            <Table variant="compact" aria-label="Roles table">
              <Thead>
                <Tr>
                  <Th />
                  <Th 
                    sort={(selectedOption === 'option2' || selectedOption === 'option3') ? getRoleNameSortParams() : undefined}
                  >
                    {(selectedOption === 'option2' || selectedOption === 'option3') ? 'Role' : 'Role name'}
                  </Th>
                  <Th>Description</Th>
                  {selectedOption === 'option3' && (
                    <Th 
                      info={{
                        popover: (
                          <Content>
                            <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)', marginBottom: '8px', display: 'block' }}>
                              Roles with different labels come from different sources. The meanings of each label are defined as follows:
                            </Content>
                            <Content component="ul" className="pf-v6-c-content--ul" style={{ margin: '0px' }}>
                              <Content component="li" className="pf-v6-c-content--li">
                                <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
                                  <strong>AI:</strong> Description
                                </Content>
                              </Content>
                              <Content component="li" className="pf-v6-c-content--li">
                                <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
                                  <strong>OpenShift default:</strong> Description
                                </Content>
                              </Content>
                              <Content component="li" className="pf-v6-c-content--li">
                                <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
                                  <strong>OpenShift custom:</strong> Description
                                </Content>
                              </Content>
                            </Content>
                          </Content>
                        ),
                        ariaLabel: 'Role type labels help',
                        popoverProps: { headerContent: 'Role Labels' }
                      }}
                    >
                      Role type
                    </Th>
                  )}
                  <Th 
                    sort={selectedOption === 'option1' ? getStatusSortParams() : ((selectedOption === 'option2' || selectedOption === 'option3') ? getOption2StatusSortParams() : undefined)} 
                    modifier="nowrap"
                        info={{
                          popover: (
                            <Content>
                              <Content component="p" style={{ marginBottom: '8px' }}>
                                Assignment status indicates the current or pending state of the role assignment:
                              </Content>
                              <Content component="ul" className="pf-v6-c-content--ul" style={{ margin: '0px', paddingLeft: '20px' }}>
                                <Content component="li" className="pf-v6-c-content--li">
                                  <strong>Currently assigned:</strong> The user or group has this role.
                                </Content>
                                <Content component="li" className="pf-v6-c-content--li">
                                  <strong>Assigning:</strong> The role will be added when you save changes.
                                </Content>
                                <Content component="li" className="pf-v6-c-content--li">
                                  <strong>Unassigning:</strong> The role will be removed when you save changes.
                                </Content>
                                <Content component="li" className="pf-v6-c-content--li">
                                  <strong>No status (-):</strong> The role is not assigned.
                                </Content>
                              </Content>
                            </Content>
                          ),
                          ariaLabel: 'Assignment status help',
                          popoverProps: { headerContent: 'Assignment Status' }
                        }}
                  >
                    Assignment status
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedRoles.length === 0 ? (
                  <Tr>
                    <Td colSpan={selectedOption === 'option3' ? 5 : 4} style={{ textAlign: 'center', padding: 'var(--pf-v5-global--spacer--xl)' }}>
                      No roles available
                    </Td>
                  </Tr>
                ) : (
                  sortedRoles.map((role, rowIndex) => {
                  const isExpanded = expandedRoles.has(role.id);
                  const status = getRoleStatus(role);
                  const hasRules = role.rules && role.rules.length > 0;
                  
                  return (
                    <React.Fragment key={role.id}>
                        <Tr className={isExpanded ? 'pf-m-expanded' : undefined}>
                          {selectedOption === 'option1' ? (
                        <Td
                          treeRow={{
                            onCollapse: () => toggleRoleExpansion(role.id),
                            rowIndex: rowIndex,
                            props: {
                              'aria-level': 1,
                              'aria-setsize': sortedRoles.length,
                              'aria-posinset': rowIndex + 1,
                                  'aria-expanded': isExpanded,
                            },
                          }}
                        >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-v5-global--spacer--sm)' }}>
                            <Checkbox
                              id={`role-${role.id}`}
                              isChecked={role.currentlyAssigned}
                              onChange={() => handleRoleToggle(role.id)}
                              aria-label={`Select role ${role.name}`}
                                  onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </Td>
                          ) : (
                            <Td>
                              <Checkbox
                                id={`role-${role.id}`}
                                isChecked={role.currentlyAssigned}
                                onChange={() => handleRoleToggle(role.id)}
                                aria-label={`Select role ${role.name}`}
                              />
                            </Td>
                          )}
                          <Td>
                            {selectedOption === 'option2' ? (
                              <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                                <Button
                                  variant="link"
                                  onClick={() => handleRoleNameClick(role)}
                                  isInline
                                  style={{ padding: 0, fontSize: 'inherit', textDecoration: 'none' }}
                                  className="pf-v6-c-button__text"
                                >
                                  {role.name}
                                </Button>
                                {(() => {
                                  const badge = renderRoleBadge(role);
                                  return badge ? (
                                    <>
                                      <div style={{ width: '4px' }} />
                                      {badge}
                                    </>
                                  ) : null;
                                })()}
                              </Flex>
                            ) : selectedOption === 'option3' ? (
                              <Button
                                variant="link"
                                onClick={() => handleRoleNameClick(role)}
                                isInline
                                style={{ padding: 0, fontSize: 'inherit', textDecoration: 'none' }}
                                className="pf-v6-c-button__text"
                              >
                                {role.name}
                              </Button>
                            ) : (
                          <div>
                            <div>{role.name}</div>
                                {(() => {
                                  const badge = renderRoleBadge(role);
                                  return badge ? (
                              <div style={{ marginTop: 'var(--pf-v5-global--spacer--xs)' }}>
                                      {badge}
                              </div>
                                  ) : null;
                                })()}
                          </div>
                            )}
                        </Td>
                        <Td>{role.description}</Td>
                          {selectedOption === 'option3' && (
                            <Td>
                              {renderRoleTypeLabels(role)}
                            </Td>
                          )}
                        <Td>{renderStatusBadge(role)}</Td>
                      </Tr>
                        {isExpanded && selectedOption === 'option1' && (
                        <Tr isExpanded={isExpanded}>
                          <Td colSpan={4}>
                            <div style={{ padding: 'var(--pf-v5-global--spacer--md)', marginLeft: 'var(--pf-v5-global--spacer--xl)' }}>
                                <div style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)', fontWeight: 600 }}>
                                  Rules
                                </div>
                                {hasRules && role.rules && role.rules.length > 0 ? (
                              <Table variant="compact" aria-label="Role rules">
                                <Thead>
                                  <Tr>
                                    <Th>Actions</Th>
                                        <Th>
                                          API groups
                                          <ChevronUpIcon style={{ marginLeft: 'var(--pf-v5-global--spacer--xs)', color: 'var(--pf-v5-global--Color--200)' }} />
                                          <ChevronDownIcon style={{ marginLeft: 'var(--pf-v5-global--spacer--xs)', color: 'var(--pf-v5-global--Color--200)' }} />
                                        </Th>
                                        <Th>Resource type</Th>
                                        <Th>
                                          Resource names
                                          <OutlinedQuestionCircleIcon style={{ marginLeft: 'var(--pf-v5-global--spacer--xs)', color: 'var(--pf-v5-global--Color--200)' }} />
                                        </Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {role.rules.map((rule, index) => (
                                    <Tr key={index}>
                                      <Td>{rule.actions.join(', ')}</Td>
                                      <Td>{rule.apiGroups.join(', ')}</Td>
                                      <Td>{rule.resources.join(', ')}</Td>
                                      <Td>{rule.resourceNames?.join(', ') || '-'}</Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              </Table>
                                ) : (
                                  <div style={{ color: 'var(--pf-v5-global--Color--200)', padding: 'var(--pf-v5-global--spacer--sm)' }}>
                                    No rules available
                                  </div>
                                )}
                            </div>
                          </Td>
                        </Tr>
                      )}
                    </React.Fragment>
                  );
                  })
                )}
              </Tbody>
            </Table>
          </StackItem>
        </Stack>
        </div>
      </PageSection>

      <PageSection className="pf-m-sticky-bottom">
        <div className="pf-v6-l-stack pf-m-gutter">
          <div className="pf-v6-l-stack__item">
            <Alert 
              variant={AlertVariant.info} 
              isInline 
              title={`Make sure to inform the specified ${subjectType.toLowerCase()} about the updated role assignments.`}
              style={{ width: '840px' }}
            >
            </Alert>
          </div>
          <div className="pf-v6-l-stack__item">
            <div className="pf-v6-l-stack pf-m-gutter">
              <div className="pf-v6-l-stack__item">
                <div className="pf-v6-c-action-list">
                  <div className="pf-v6-c-action-list__item">
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      isDisabled={!hasChanges}
                      data-testid="submit-button"
                      id="save-button"
                    >
                      Save
                    </Button>
                  </div>
                  <div className="pf-v6-c-action-list__item">
                    <Button
                      variant="link"
                      onClick={() => navigate(`/projects/${projectId}?tab=permissions`)}
                      id="cancel-button"
                      data-testid="cancel-button"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* Role Rules Modal for Option 2 */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        variant="large"
        aria-labelledby="role-rules-modal-title"
      >
        <ModalHeader
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span id="role-rules-modal-title">{selectedRoleForModal?.name}</span>
              {selectedRoleForModal?.roleType === 'openshift-default' && (
                <Label color="blue" variant="outline">OpenShift default</Label>
              )}
              {selectedRoleForModal?.roleType === 'openshift-custom' && (
                <Label color="purple" variant="outline">OpenShift custom</Label>
              )}
            </div>
          }
        />
        <ModalBody>
          <Content style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
            The table below presents the rules of this role.
          </Content>
          {selectedRoleForModal && selectedRoleForModal.rules && selectedRoleForModal.rules.length > 0 ? (
            <>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table variant="compact" aria-label="Role rules table">
                  <Thead>
                    <Tr>
                      <Th sort={getRulesSortParams(0)}>
                        Actions
                      </Th>
                      <Th sort={getRulesSortParams(1)}>
                        API Groups
                      </Th>
                      <Th sort={getRulesSortParams(2)}>
                        Resources
                      </Th>
                      <Th sort={getRulesSortParams(3)}>
                        Resource names
                        <OutlinedQuestionCircleIcon style={{ marginLeft: 'var(--pf-v5-global--spacer--xs)', color: 'var(--pf-v5-global--Color--200)' }} />
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {getSortedRules(selectedRoleForModal.rules)
                      .slice(0, rulesPageSize)
                      .map((rule, index) => (
                        <Tr key={index}>
                          <Td>{rule.actions.join(', ')}</Td>
                          <Td>{rule.apiGroups.join(', ')}</Td>
                          <Td>{rule.resources.join(', ')}</Td>
                          <Td>{rule.resourceNames?.join(', ') || '-'}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
              {selectedRoleForModal.rules.length > rulesPageSize && (
                <div style={{ marginTop: 'var(--pf-v5-global--spacer--md)' }}>
                  <Button
                    variant="link"
                    isInline
                    onClick={() => setRulesPageSize(prev => prev + 10)}
                  >
                    View more
                  </Button>
                  <span style={{ marginLeft: 'var(--pf-v5-global--spacer--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                    Showing {Math.min(rulesPageSize, selectedRoleForModal.rules.length)}/{selectedRoleForModal.rules.length}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div style={{ color: 'var(--pf-v5-global--Color--200)', padding: 'var(--pf-v5-global--spacer--md)' }}>
              No rules available
            </div>
          )}
        </ModalBody>
      </Modal>

      {/* Save Confirmation Modal */}
      <Modal
        isOpen={isSaveConfirmModalOpen}
        onClose={() => {
          setIsSaveConfirmModalOpen(false);
          setAllTreeItemsExpanded(true);
        }}
        variant="small"
        aria-labelledby="save-confirm-modal-title"
      >
        <ModalHeader
          title="Confirm role assignment changes?"
          titleIconVariant="warning"
        />
        <ModalBody>
          <Stack hasGutter>
            <StackItem>
              <Content>
                The roles of <span style={{ fontWeight: 600 }}>{subjectName}</span> will be changed as listed below.
              </Content>
            </StackItem>
            <StackItem>
              <Button
                variant="link"
                isInline
                style={{ padding: 0, fontSize: 'inherit' }}
                onClick={() => setAllTreeItemsExpanded(!allTreeItemsExpanded)}
              >
                {allTreeItemsExpanded ? 'Collapse all' : 'Expand all'}
              </Button>
            </StackItem>
            <StackItem>
              {(() => {
                const assigningRoles = roles.filter(role => !role.originallyAssigned && role.currentlyAssigned);
                const unassigningRoles = roles.filter(role => role.originallyAssigned && !role.currentlyAssigned);
                const unassigningAIRoles = unassigningRoles.filter(role => role.roleType !== 'openshift-custom');
                const unassigningOpenShiftCustomRoles = unassigningRoles.filter(role => role.roleType === 'openshift-custom');
                
                const treeData: TreeViewDataItem[] = [];
                
                // Add "Assigning roles" section if there are any
                if (assigningRoles.length > 0) {
                  treeData.push({
                    name: (
                      <span>
                        <span style={{ fontWeight: 600 }}>Assigning roles</span>
                        <Label isCompact style={{ marginLeft: '8px' }}>{assigningRoles.length}</Label>
                      </span>
                    ),
                    id: 'assigning-roles',
                    children: assigningRoles.map((role, index) => ({
                      name: role.name,
                      id: `assigning-${role.id}-${index}`,
                    })),
                    defaultExpanded: true,
                  });
                }
                
                // Add "Unassigning roles" section if there are any
                if (unassigningRoles.length > 0) {
                  const unassigningChildren: TreeViewDataItem[] = [];
                  
                  // Add AI roles subcategory
                  if (unassigningAIRoles.length > 0) {
                    unassigningChildren.push({
                      name: (
                        <span>
                          <span style={{ fontWeight: 600 }}>AI roles</span>
                          <Label isCompact style={{ marginLeft: '8px' }}>{unassigningAIRoles.length}</Label>
                        </span>
                      ),
                      id: 'unassigning-ai-roles',
                      children: unassigningAIRoles.map((role, index) => ({
                        name: role.name,
                        id: `unassigning-ai-${role.id}-${index}`,
                      })),
                      defaultExpanded: true,
                    });
                  }
                  
                  // Add OpenShift custom roles subcategory
                  if (unassigningOpenShiftCustomRoles.length > 0) {
                    unassigningChildren.push({
                      name: (
                        <span>
                          <span style={{ fontWeight: 600 }}>OpenShift custom roles</span>
                          <Label isCompact style={{ marginLeft: '8px' }}>{unassigningOpenShiftCustomRoles.length}</Label>
                        </span>
                      ),
                      id: 'unassigning-openshift-custom-roles',
                      children: unassigningOpenShiftCustomRoles.map((role, index) => ({
                        name: role.name,
                        id: `unassigning-openshift-custom-${role.id}-${index}`,
                      })),
                      defaultExpanded: true,
                    });
                  }
                  
                  treeData.push({
                    name: (
                      <span>
                        <span style={{ fontWeight: 600 }}>Unassigning roles</span>
                        <Label isCompact style={{ marginLeft: '8px' }}>{unassigningRoles.length}</Label>
                      </span>
                    ),
                    id: 'unassigning-roles',
                    children: unassigningChildren,
                    defaultExpanded: true,
                  });
                }
                
                return <TreeView hasAnimations hasGuides aria-label="Role assignment changes" data={treeData} allExpanded={allTreeItemsExpanded} />;
              })()}
            </StackItem>
            
            {/* Conditional Alert for OpenShift Custom Roles */}
            {(() => {
              const unassigningOpenShiftCustomRoles = roles.filter(role => 
                role.roleType === 'openshift-custom' && 
                role.originallyAssigned && 
                !role.currentlyAssigned
              );
              
              if (unassigningOpenShiftCustomRoles.length > 0) {
                return (
                  <StackItem>
                    <Alert
                      variant="danger"
                      isInline
                      title="The OpenShift custom roles were assigned from OpenShift. You need to contact your admin to reassign them outside the OpenShift AI once you unassign them."
                    />
                  </StackItem>
                );
              }
              return null;
            })()}
          </Stack>
        </ModalBody>
        <div style={{ padding: '24px' }}>
          <div className="pf-v6-c-action-list">
            <div className="pf-v6-c-action-list__item">
              <Button
                variant="primary"
                onClick={() => {
                  setIsSaveConfirmModalOpen(false);
                  performSave();
                }}
              >
                Confirm
              </Button>
            </div>
            <div className="pf-v6-c-action-list__item">
              <Button
                variant="link"
                onClick={() => {
                  setIsSaveConfirmModalOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export { EditRolesPage };
