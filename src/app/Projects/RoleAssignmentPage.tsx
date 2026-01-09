import * as React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { updateUserRoles, updateGroupRoles } from './sharedPermissionsData';
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
  TextInput,
  MenuToggle,
  MenuToggleElement,
  Dropdown,
  DropdownList,
  DropdownItem,
  SearchInput,
  Content,
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
  ChevronDownIcon,
} from '@patternfly/react-icons';

interface Role {
  id: string;
  name: string;
  description: string;
  roleType: 'openshift-default' | 'openshift-custom' | 'regular';
  currentlyAssigned: boolean;
  rules?: RoleRule[];
}

interface RoleRule {
  actions: string[];
  apiGroups: string[];
  resources: string[];
  resourceNames?: string[];
}

const mockAvailableRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full administrative access to the project',
    roleType: 'openshift-default',
    currentlyAssigned: false,
    rules: [
      {
        actions: ['get', 'list', 'watch', 'create', 'update', 'delete'],
        apiGroups: ['apps', 'batch'],
        resources: ['pods', 'deployments'],
      },
    ],
  },
  {
    id: '2',
    name: 'Contributor',
    description: 'Can create and modify resources in the project',
    roleType: 'openshift-default',
    currentlyAssigned: false,
    rules: [
      {
        actions: ['get', 'list', 'watch', 'create', 'update'],
        apiGroups: ['apps'],
        resources: ['pods'],
      },
    ],
  },
  {
    id: '3',
    name: 'custom-pipeline-super-user',
    description: 'Custom role for pipeline management',
    roleType: 'openshift-custom',
    currentlyAssigned: false,
    rules: [
      {
        actions: ['get', 'list', 'watch', 'create'],
        apiGroups: ['tekton.dev'],
        resources: ['pipelines'],
      },
    ],
  },
  {
    id: '4',
    name: 'Deployment maintainer',
    description: 'Can manage deployments in the project',
    roleType: 'regular',
    currentlyAssigned: false,
  },
];

const mockUsers = ['Maude', 'John', 'Deena', 'Alice', 'Bob'];
const mockGroups = ['dedicated-admins', 'system:serviceaccounts:dedicated-admin', 'developers'];

const RoleAssignmentPage: React.FunctionComponent = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const [subjectType, setSubjectType] = React.useState<'User' | 'Group'>('User');
  const [selectedSubject, setSelectedSubject] = React.useState<string>('');
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = React.useState(false);
  const [subjectSearchValue, setSubjectSearchValue] = React.useState('');
  const [roles, setRoles] = React.useState<Role[]>(mockAvailableRoles.map(role => ({ ...role })));
  const [expandedRoles, setExpandedRoles] = React.useState<Set<string>>(new Set());
  const [statusSortBy, setStatusSortBy] = React.useState<ISortBy>({
    index: 2,
    direction: 'asc',
  });
  const [searchValue, setSearchValue] = React.useState('');

  React.useEffect(() => {
    // Reset state when subject type changes
    setSelectedSubject('');
    setSubjectSearchValue('');
    setSearchValue('');
    setRoles(mockAvailableRoles.map(role => ({ ...role })));
  }, [subjectType]);

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
    if (role.currentlyAssigned) {
      return 'To be assigned';
    }
    return '---';
  };

  const getStatusPriority = (status: string): number => {
    if (status === 'To be assigned') return 1;
    return 2; // '---'
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

  const getStatusSortParams = () => ({
    sortBy: statusSortBy,
    onSort: (_event: any, index: number, direction: 'asc' | 'desc') => {
      setStatusSortBy({ index, direction });
    },
    columnIndex: 2,
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
    if (status === 'To be assigned') {
      return <Label color="blue" variant="outline" isCompact>{status}</Label>;
    }
    return <span style={{ color: 'var(--pf-v5-global--Color--200)' }}>---</span>;
  };

  const availableSubjects = subjectType === 'User' ? mockUsers : mockGroups;
  const filteredSubjects = availableSubjects.filter((subject) =>
    subject.toLowerCase().includes(subjectSearchValue.toLowerCase())
  );

  const sortedRoles = getSortedRoles();
  const hasSelectedRoles = roles.some((role) => role.currentlyAssigned);

  return (
    <>
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
              <Form>
                <FormGroup label="Subject type" fieldId="subject-type">
                <Flex spaceItems={{ default: 'spaceItemsLg' }}>
                  <Radio
                    id="subject-type-user"
                    name="subject-type"
                    label="User"
                    isChecked={subjectType === 'User'}
                    onChange={() => setSubjectType('User')}
                  />
                  <Radio
                    id="subject-type-group"
                    name="subject-type"
                    label="Group"
                    isChecked={subjectType === 'Group'}
                    onChange={() => setSubjectType('Group')}
                  />
                </Flex>
              </FormGroup>

              <FormGroup label={`Select ${subjectType.toLowerCase()}`} fieldId="subject-name">
                <Dropdown
                  isOpen={isSubjectDropdownOpen}
                  onOpenChange={(isOpen) => setIsSubjectDropdownOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                      isExpanded={isSubjectDropdownOpen}
                      style={{ minWidth: '300px' }}
                    >
                      {selectedSubject || `Select ${subjectType.toLowerCase()}`}
                    </MenuToggle>
                  )}
                >
                  <div style={{ padding: 'var(--pf-v5-global--spacer--sm)' }}>
                    <SearchInput
                      placeholder={`Search ${subjectType.toLowerCase()}s`}
                      value={subjectSearchValue}
                      onChange={(_event, value) => setSubjectSearchValue(value)}
                      onClear={() => setSubjectSearchValue('')}
                    />
                  </div>
                  <DropdownList>
                    {filteredSubjects.map((subject) => (
                      <DropdownItem
                        key={subject}
                        onClick={() => {
                          setSelectedSubject(subject);
                          setIsSubjectDropdownOpen(false);
                          setSubjectSearchValue('');
                        }}
                      >
                        {subject}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </Dropdown>
                <div style={{ marginTop: 'var(--pf-v5-global--spacer--xs)', fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                  Only {subjectType.toLowerCase()}s with existing permissions are listed. To add someone new, enter their {subjectType === 'User' ? 'username' : 'group name'}.
                </div>
              </FormGroup>
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

            {!selectedSubject ? (
              <Alert variant={AlertVariant.info} isInline title="Select a subject">
                Please select a {subjectType.toLowerCase()} to assign roles.
              </Alert>
            ) : (
              <Table variant="compact" aria-label="Roles table">
                  <Thead>
                    <Tr>
                      <Th />
                      <Th>Role name</Th>
                      <Th>Description</Th>
                      <Th sort={getStatusSortParams()}>
                        Status
                        {statusSortBy.direction === 'desc' && (
                          <ChevronDownIcon style={{ marginLeft: 'var(--pf-v5-global--spacer--xs)' }} />
                        )}
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sortedRoles.map((role, rowIndex) => {
                      const isExpanded = expandedRoles.has(role.id);
                      
                      return (
                        <React.Fragment key={role.id}>
                          <Tr>
                            <Td
                              treeRow={{
                                onCollapse: () => toggleRoleExpansion(role.id),
                                rowIndex: rowIndex,
                                props: {
                                  'aria-level': 1,
                                  'aria-setsize': sortedRoles.length,
                                  'aria-posinset': rowIndex + 1,
                                },
                              }}
                            >
                              <div style={{ marginLeft: '0px' }}>
                                <Checkbox
                                  id={`role-${role.id}`}
                                  isChecked={role.currentlyAssigned}
                                  onChange={() => handleRoleToggle(role.id)}
                                  aria-label={`Select role ${role.name}`}
                                />
                              </div>
                            </Td>
                            <Td>
                              <div>
                                <div>{role.name}</div>
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
                          {isExpanded && role.rules && (
                            <Tr isExpanded={isExpanded}>
                              <Td colSpan={4}>
                                <div style={{ padding: 'var(--pf-v5-global--spacer--md)', marginLeft: 'var(--pf-v5-global--spacer--xl)' }}>
                                  <Table variant="compact" aria-label="Role rules">
                                    <Thead>
                                      <Tr>
                                        <Th>Actions</Th>
                                        <Th>API groups</Th>
                                        <Th>Resources</Th>
                                        <Th>Resource names</Th>
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
                                </div>
                              </Td>
                            </Tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </Tbody>
                </Table>
            )}
          </StackItem>
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
                        if (subjectType === 'User') {
                          updateUserRoles(selectedSubject, assignedRoles);
                        } else {
                          updateGroupRoles(selectedSubject, assignedRoles);
                        }
                        
                        // Navigate back to permissions tab
                        navigate(`/projects/${projectId}?tab=permissions`);
                      }}
                      isDisabled={!hasSelectedRoles || !selectedSubject}
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
    </>
  );
};

export { RoleAssignmentPage };

