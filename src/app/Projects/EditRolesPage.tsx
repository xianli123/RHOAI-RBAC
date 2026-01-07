import * as React from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
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
  ChevronUpIcon,
  ChevronDownIcon,
  InfoCircleIcon,
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
    description: 'Description goes here.',
    roleType: 'openshift-custom',
    originallyAssigned: true,
    currentlyAssigned: true,
  },
  {
    id: '2',
    name: 'Deployment maintainer',
    description: 'Description goes here.',
    roleType: 'regular',
    originallyAssigned: true,
    currentlyAssigned: true,
  },
  {
    id: '3',
    name: 'Deployment reader',
    description: 'Description goes here.',
    roleType: 'regular',
    originallyAssigned: true,
    currentlyAssigned: true,
  },
  {
    id: '4',
    name: 'Workbench maintainer',
    description: 'Description goes here.',
    roleType: 'regular',
    originallyAssigned: true,
    currentlyAssigned: true,
  },
  {
    id: '5',
    name: 'Workbench reader',
    description: 'Description goes here.',
    roleType: 'regular',
    originallyAssigned: true,
    currentlyAssigned: false,
  },
  {
    id: '6',
    name: 'Workbench updater',
    description: 'Description goes here.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: true,
  },
  {
    id: '7',
    name: 'Admin',
    description: 'Description goes here.',
    roleType: 'openshift-default',
    originallyAssigned: false,
    currentlyAssigned: false,
  },
  {
    id: '8',
    name: 'Contributor',
    description: 'Description goes here. Truncat...',
    roleType: 'openshift-default',
    originallyAssigned: false,
    currentlyAssigned: false,
  },
  {
    id: '9',
    name: 'Deployment updater',
    description: 'Description goes here.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
  },
  {
    id: '10',
    name: 'Pipeline maintainer',
    description: 'Description goes here.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
  },
  {
    id: '11',
    name: 'Pipeline updater',
    description: 'Description goes here.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
  },
  {
    id: '12',
    name: 'Pipeline reader',
    description: 'Description goes here.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
  },
];

const EditRolesPage: React.FunctionComponent = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const subjectType = searchParams.get('subjectType') || 'User';
  const subjectName = searchParams.get('subjectName') || '';
  
  const [roles, setRoles] = React.useState<Role[]>(mockRoles.map(role => ({ ...role })));
  const [expandedRoles, setExpandedRoles] = React.useState<Set<string>>(new Set());
  const [statusSortBy, setStatusSortBy] = React.useState<ISortBy>({
    index: 2,
    direction: 'asc',
  });
  const [searchValue, setSearchValue] = React.useState('');

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

  const renderStatusBadge = (status: string) => {
    if (status === 'Currently assigned') {
      return <Label color="green" variant="outline" isCompact>{status}</Label>;
    } else if (status === 'To be assigned') {
      return <Label color="blue" variant="outline" isCompact>{status}</Label>;
    } else if (status === 'To be removed') {
      return <Label color="orange" variant="outline" isCompact>{status}</Label>;
    }
    return <span style={{ color: 'var(--pf-v5-global--Color--200)' }}>---</span>;
  };

  const sortedRoles = getSortedRoles();
  const hasChanges = roles.some((role) => {
    const original = mockRoles.find((r) => r.id === role.id);
    return role.currentlyAssigned !== original?.currentlyAssigned;
  });

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
                  <Th>Role name</Th>
                  <Th>Description</Th>
                  <Th sort={getStatusSortParams()}>
                    Status
                    {statusSortBy.direction === 'asc' ? (
                      <ChevronUpIcon style={{ marginLeft: 'var(--pf-v5-global--spacer--xs)' }} />
                    ) : (
                      <ChevronDownIcon style={{ marginLeft: 'var(--pf-v5-global--spacer--xs)' }} />
                    )}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedRoles.map((role) => {
                  const isExpanded = expandedRoles.has(role.id);
                  const status = getRoleStatus(role);
                  
                  return (
                    <React.Fragment key={role.id}>
                      <Tr>
                        <Td>
                          <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                            <Checkbox
                              id={`role-${role.id}`}
                              isChecked={role.currentlyAssigned}
                              onChange={() => handleRoleToggle(role.id)}
                              aria-label={`Select role ${role.name}`}
                            />
                            <Button
                              variant="plain"
                              onClick={() => toggleRoleExpansion(role.id)}
                              aria-label="Expand role rules"
                              style={{ padding: 0 }}
                            >
                              {isExpanded ? <AngleDownIcon /> : <AngleRightIcon />}
                            </Button>
                          </Flex>
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
                        <Td>{renderStatusBadge(status)}</Td>
                      </Tr>
                      {isExpanded && role.rules && (
                        <Tr>
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
          </StackItem>
        </Stack>
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
                        // Handle save
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
    </>
  );
};

export { EditRolesPage };
