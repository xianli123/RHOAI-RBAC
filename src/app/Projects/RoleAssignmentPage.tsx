import * as React from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { updateUserRoles, updateGroupRoles, mockUsers, mockGroups } from './sharedPermissionsData';
import { TypeaheadSelect, TypeaheadSelectOption } from '@patternfly/react-templates';
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
  Radio,
  Form,
  FormGroup,
  Content,
  HelperText,
  HelperTextItem,
  SearchInput,
  Modal,
  ModalHeader,
  ModalBody,
} from '@patternfly/react-core';
import {
  OutlinedQuestionCircleIcon,
} from '@patternfly/react-icons';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ISortBy,
} from '@patternfly/react-table';

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

// All available roles (same as EditRolesPage)
const mockAvailableRoles: Role[] = [
  {
    id: '1',
    name: 'custom-pipeline-super-user',
    description: 'Custom OpenShift role with pipeline super user permissions.',
    roleType: 'openshift-custom',
    originallyAssigned: false,
    currentlyAssigned: false,
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
    originallyAssigned: false,
    currentlyAssigned: false,
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
    originallyAssigned: false,
    currentlyAssigned: false,
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
    originallyAssigned: false,
    currentlyAssigned: false,
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
    originallyAssigned: false,
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
    currentlyAssigned: false,
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

const RoleAssignmentPage: React.FunctionComponent = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Check if this is Option 2 flow (read-only subject)
  const isOption2 = searchParams.get('option') === '2';
  const option2SubjectType = searchParams.get('subjectType') as 'User' | 'Group' | null;
  const option2SubjectName = searchParams.get('subjectName');
  
  const [subjectType, setSubjectType] = React.useState<'User' | 'Group'>(
    isOption2 && option2SubjectType ? option2SubjectType : 'User'
  );
  const [selectedSubject, setSelectedSubject] = React.useState<string | undefined>(
    isOption2 && option2SubjectName ? decodeURIComponent(option2SubjectName) : undefined
  );
  const [roles, setRoles] = React.useState<Role[]>(mockAvailableRoles.map(role => ({ 
    ...role, 
    originallyAssigned: false, 
    currentlyAssigned: false 
  })));
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
  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState(false);
  const [selectedRoleForModal, setSelectedRoleForModal] = React.useState<Role | null>(null);
  const [rulesSortBy, setRulesSortBy] = React.useState<ISortBy>({
    index: 0,
    direction: 'asc',
  });
  const [rulesPageSize, setRulesPageSize] = React.useState(10);

  // Get available subjects based on type
  const getAvailableSubjects = (): string[] => {
    if (subjectType === 'User') {
      return mockUsers.map(u => u.name);
    } else {
      return mockGroups.map(g => g.name);
    }
  };

  // Create typeahead options
  const typeaheadOptions = React.useMemo<TypeaheadSelectOption[]>(() => {
    const subjects = getAvailableSubjects();
    return subjects.map((subject) => ({
      content: subject,
      value: subject,
      selected: subject === selectedSubject,
    }));
  }, [subjectType, selectedSubject]);

  // Reset when subject kind changes (only if not Option 2)
  React.useEffect(() => {
    if (!isOption2) {
      setSelectedSubject(undefined);
      setSearchValue('');
      setRoles(mockAvailableRoles.map(role => ({ 
        ...role, 
        originallyAssigned: false, 
        currentlyAssigned: false 
      })));
    }
  }, [subjectType, isOption2]);

  // Initialize roles when subject is selected
  React.useEffect(() => {
    if (selectedSubject) {
      // Get subject's current roles from shared data
      let subjectRoles: string[] = [];
      let isExistingSubject = false;
      if (subjectType === 'User') {
        const user = mockUsers.find(u => u.name === selectedSubject);
        isExistingSubject = !!user;
        subjectRoles = user?.roles.map(r => r.role) || [];
      } else {
        const group = mockGroups.find(g => g.name === selectedSubject);
        isExistingSubject = !!group;
        subjectRoles = group?.roles.map(r => r.role) || [];
      }
      
      // Check if subject has any OpenShift custom roles
      const hasOpenShiftCustomRole = subjectRoles.some(roleName => {
        const role = mockAvailableRoles.find(r => r.name === roleName);
        return role?.roleType === 'openshift-custom';
      });
      
      // Filter out OpenShift custom roles if subject is new or doesn't have any OpenShift custom roles
      const filteredRoles = (!isExistingSubject || !hasOpenShiftCustomRole)
        ? mockAvailableRoles.filter(role => role.roleType !== 'openshift-custom')
        : mockAvailableRoles;
      
      setRoles(filteredRoles.map(role => {
        const isAssigned = subjectRoles.includes(role.name);
        return {
          ...role,
          originallyAssigned: isAssigned,
          currentlyAssigned: isAssigned,
        };
      }));
    } else {
      setRoles(mockAvailableRoles.map(role => ({ 
        ...role, 
        originallyAssigned: false, 
        currentlyAssigned: false 
      })));
    }
  }, [selectedSubject, subjectType]);

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
    if (status === 'To be removed') return 3;
    return 4; // '---'
  };

  const getFilteredRoles = (): Role[] => {
    if (!searchValue) return roles;
    return roles.filter((role) =>
      role.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const getSortedRoles = (): Role[] => {
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
        .pf-v6-c-button.pf-m-link.pf-m-inline {
          text-decoration: none !important;
        }
        .pf-v6-c-button.pf-m-link.pf-m-inline:hover {
          text-decoration: none !important;
        }
      `}</style>
      <div className="pf-v6-c-page__main-breadcrumb">
        <div style={{ padding: 'var(--pf-v5-global--spacer--lg) var(--pf-v5-global--spacer--lg)' }}>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/projects">Projects</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to={`/projects/${projectId}`}>{projectId}</Link>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>Assign roles</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>

      <PageSection>
        <Title headingLevel="h1" size="2xl">
          Assign roles
        </Title>
      </PageSection>

      <PageSection isFilled>
        <div style={{ maxWidth: '840px' }}>
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h2" size="lg">Subject</Title>
              <Form style={{ marginTop: '16px' }}>
                <FormGroup label="Subject kind" fieldId="subject-type">
                <Flex spaceItems={{ default: 'spaceItemsLg' }}>
                  <Radio
                    id="subject-type-user"
                    name="subject-type"
                    label="User"
                    isChecked={subjectType === 'User'}
                    onChange={() => !isOption2 && setSubjectType('User')}
                    isDisabled={isOption2}
                  />
                  <Radio
                    id="subject-type-group"
                    name="subject-type"
                    label="Group"
                    isChecked={subjectType === 'Group'}
                    onChange={() => !isOption2 && setSubjectType('Group')}
                    isDisabled={isOption2}
                  />
                </Flex>
              </FormGroup>

                <FormGroup 
                  label={subjectType === 'User' ? 'User name' : 'Group name'} 
                  fieldId="subject-name"
                >
                  {isOption2 ? (
                    <div style={{ 
                      padding: 'var(--pf-v5-global--spacer--sm) var(--pf-v5-global--spacer--md)',
                      backgroundColor: 'var(--pf-v5-global--BackgroundColor--200)',
                      border: '1px solid var(--pf-v5-global--BorderColor--300)',
                      borderRadius: 'var(--pf-v5-global--BorderRadius--sm)',
                      color: 'var(--pf-v5-global--Color--100)'
                    }}>
                      {selectedSubject || `Select ${subjectType.toLowerCase()}`}
                    </div>
                  ) : (
                    <>
                      <TypeaheadSelect
                        initialOptions={typeaheadOptions}
                        placeholder={`Select ${subjectType.toLowerCase()}`}
                        noOptionsFoundMessage={(filter) => `No ${subjectType.toLowerCase()} was found for "${filter}"`}
                        createOptionMessage={(newValue) => `Grant access to "${newValue}"`}
                        onClearSelection={() => setSelectedSubject(undefined)}
                        onSelect={(_ev, selection) => {
                          const selectedValue = String(selection);
                          setSelectedSubject(selectedValue);
                          // If it's a new subject (not in the list), it will be created when saved
                        }}
                        isCreatable={true}
                      />
                      <HelperText>
                        <HelperTextItem>
                          {subjectType === 'User' 
                            ? 'Only users with existing roles are listed. To add someone new, enter their username.'
                            : 'Only groups with existing roles are listed. To add someone new, enter their group name.'}
                        </HelperTextItem>
                      </HelperText>
                      {!selectedSubject && (
                        <Alert 
                          variant={AlertVariant.info} 
                          isInline 
                          isPlain
                          title="Please select a user or group before assigning roles."
                          style={{ marginTop: '8px' }}
                        />
                      )}
                    </>
                  )}
              </FormGroup>
            </Form>
          </StackItem>

            {selectedSubject && (
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
                      <Th sort={getRoleNameSortParams()}>
                        Role name
                      </Th>
                      <Th>Description</Th>
                      <Th sort={getOption2StatusSortParams()}>
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
                      sortedRoles.map((role) => (
                        <Tr key={role.id}>
                          <Td>
                                <Checkbox
                                  id={`role-${role.id}`}
                                  isChecked={role.currentlyAssigned}
                                  onChange={() => handleRoleToggle(role.id)}
                                  aria-label={`Select role ${role.name}`}
                                />
                            </Td>
                            <Td>
                              <div>
                              <Button
                                variant="link"
                                onClick={() => handleRoleNameClick(role)}
                                isInline
                                style={{ padding: 0, fontSize: 'inherit', textDecoration: 'none' }}
                                className="pf-v6-c-button__text"
                              >
                                {role.name}
                              </Button>
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
                      ))
                    )}
                  </Tbody>
                </Table>
              </StackItem>
            )}
        </Stack>
        </div>
      </PageSection>

      <PageSection className="pf-m-sticky-bottom">
        <div className="pf-v6-l-stack pf-m-gutter">
          <div className="pf-v6-l-stack__item">
            <Alert variant={AlertVariant.info} isInline title="Information">
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
                        if (subjectType === 'User' && selectedSubject) {
                          updateUserRoles(selectedSubject, assignedRoles);
                        } else if (subjectType === 'Group' && selectedSubject) {
                          updateGroupRoles(selectedSubject, assignedRoles);
                        }
                        
                        // Navigate back to permissions tab
                        navigate(`/projects/${projectId}?tab=permissions`);
                      }}
                      isDisabled={!hasChanges || !selectedSubject}
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

      {/* Role Rules Modal */}
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

export { RoleAssignmentPage };
