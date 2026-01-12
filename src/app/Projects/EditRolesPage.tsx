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
];

const EditRolesPage: React.FunctionComponent = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const subjectType = searchParams.get('subjectType') || 'User';
  const subjectName = searchParams.get('subjectName') || '';
  
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
    const hasOpenShiftCustom = subjectHasOpenShiftCustomRole();
    
    // Filter out OpenShift custom roles if subject doesn't have any
    const filteredRoles = hasOpenShiftCustom 
      ? mockRoles 
      : mockRoles.filter(role => role.roleType !== 'openshift-custom');
    
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
  const [selectedOption, setSelectedOption] = React.useState<'option1' | 'option2'>('option1');
  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState(false);
  const [selectedRoleForModal, setSelectedRoleForModal] = React.useState<Role | null>(null);
  const [rulesSortBy, setRulesSortBy] = React.useState<ISortBy>({
    index: 0,
    direction: 'asc',
  });
  const [rulesPageSize, setRulesPageSize] = React.useState(10);

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
      return 'To be assigned';
    } else if (!role.currentlyAssigned && role.originallyAssigned) {
      return 'To be removed';
    }
    return '---';
  };

  const getStatusPriority = (status: string): number => {
    if (status === 'Currently assigned') return 1;
    if (status === 'To be assigned') return 2;
    if (status === 'To be removed') return 1; // Treated as "Currently assigned" for sorting
    return 4; // '---'
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
        const priorityA = getStatusPriority(statusA);
        const priorityB = getStatusPriority(statusB);

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

  const getOption2StatusSortParams = () => ({
    sortBy: option2StatusSortBy,
    onSort: (_event: any, index: number, direction: 'asc' | 'desc') => {
      setOption2StatusSortBy({ index, direction });
      setOption2ActiveSort('status');
    },
    columnIndex: 3,
  });

  const renderRoleBadge = (role: Role) => {
    if (role.roleType === 'openshift-default') {
      return <Label color="blue" variant="outline" isCompact>OpenShift default</Label>;
    } else if (role.roleType === 'openshift-custom') {
      return <Label color="purple" variant="outline" isCompact>OpenShift custom</Label>;
    }
    return null;
  };

  const renderStatusBadge = (role: Role) => {
    const status = getRoleStatus(role);
    
    // If role was originally assigned but is now deselected, show both labels
    if (role.originallyAssigned && !role.currentlyAssigned) {
      return (
        <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
          <Label color="green" variant="outline" isCompact>Currently assigned</Label>
          <Label color="orange" variant="outline" isCompact>To be removed</Label>
        </Flex>
      );
    }
    
    // Otherwise show single status label
    if (status === 'Currently assigned') {
      return <Label color="green" variant="outline" isCompact>{status}</Label>;
    } else if (status === 'To be assigned') {
      return <Label color="blue" variant="outline" isCompact>{status}</Label>;
    } else if (status === 'To be removed') {
      return <Label color="orange" variant="outline" isCompact>{status}</Label>;
    }
    return <span style={{ color: 'var(--pf-v5-global--Color--200)' }}>---</span>;
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
        padding: 'var(--pf-v5-global--spacer--lg) var(--pf-v5-global--spacer--xl)',
        borderBottom: '1px solid var(--pf-v5-global--BorderColor--200)'
      }}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsLg' }}>
          <FlexItem>
            <span style={{ fontWeight: 600, fontSize: 'var(--pf-v5-global--FontSize--md)' }}>Design Option:</span>
          </FlexItem>
          <FlexItem>
            <Radio
              isChecked={selectedOption === 'option1'}
              name="design-option"
              onChange={() => setSelectedOption('option1')}
              label="Sorted by the status"
              id="option1-radio"
            />
          </FlexItem>
          <FlexItem>
            <Radio
              isChecked={selectedOption === 'option2'}
              name="design-option"
              onChange={() => setSelectedOption('option2')}
              label="Sorted by role name and status"
              id="option2-radio"
            />
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
            <BreadcrumbItem isActive>Edit role assignment</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>

      <PageSection>
        <Title headingLevel="h1" size="2xl">
          Edit role assignment
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
              <div className="pf-v6-c-form__group">
                <div className="pf-v6-c-form__group-label">
                  <label className="pf-v6-c-form__label" htmlFor="subject-type">
                    <span className="pf-v6-c-form__label-text">Subject type</span>
                  </label>
                </div>
                <div className="pf-v6-c-form__group-control">{subjectType}</div>
              </div>
              <div className="pf-v6-c-form__group" style={{ marginTop: 'var(--pf-v5-global--spacer--md)' }}>
                <div className="pf-v6-c-form__group-label">
                  <label className="pf-v6-c-form__label" htmlFor="subject-name">
                    <span className="pf-v6-c-form__label-text">
                      {subjectType === 'User' ? 'User name' : 'Group name'}
                    </span>
                    <span style={{ color: 'var(--pf-v5-global--danger-color--100)' }}> *</span>
                  </label>
                </div>
                <div className="pf-v6-c-form__group-control">{subjectName || `Select ${subjectType.toLowerCase()}`}</div>
              </div>
            </Form>
          </StackItem>

          <StackItem style={{ marginTop: '40px' }}>
            <Title headingLevel="h2" size="lg">Role assignment</Title>
            <Content style={{ marginTop: '16px', marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
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
                    sort={selectedOption === 'option2' ? getRoleNameSortParams() : undefined}
                  >
                    Role name
                  </Th>
                  <Th>Description</Th>
                  <Th sort={selectedOption === 'option1' ? getStatusSortParams() : (selectedOption === 'option2' ? getOption2StatusSortParams() : undefined)}>
                    Status
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedRoles.length === 0 ? (
                  <Tr>
                    <Td colSpan={4} style={{ textAlign: 'center', padding: 'var(--pf-v5-global--spacer--xl)' }}>
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
                            <div>
                              {selectedOption === 'option2' ? (
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
                                <div>{role.name}</div>
                              )}
                              {renderRoleBadge(role) && (
                                <div style={{ marginTop: 'var(--pf-v5-global--spacer--xs)' }}>
                                  {renderRoleBadge(role)}
                                </div>
                              )}
                            </div>
                          </Td>
                          <Td>{role.description}</Td>
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
              title="Information"
            >
              Make sure to inform newly added user about the updated project access.
            </Alert>
          </div>
          <div className="pf-v6-l-stack__item">
            <div className="pf-v6-l-stack pf-m-gutter">
              <div className="pf-v6-l-stack__item">
                <div className="pf-v6-c-action-list">
                  <div className="pf-v6-c-action-list__item">
                    <Button
                      variant="primary"
                      onClick={() => {
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
                      }}
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
    </>
  );
};

export { EditRolesPage };
