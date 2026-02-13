import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageSection,
  Title,
  Content,
  Breadcrumb,
  BreadcrumbItem,
  PageBreadcrumb,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
  Checkbox,
  Split,
  SplitItem,
  Divider,
  ExpandableSection,
} from '@patternfly/react-core';
import { DownloadIcon, PlusIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

const CreateRole: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [roleName, setRoleName] = React.useState('my-custom-role');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
  const [isRuleExpanded, setIsRuleExpanded] = React.useState(true);
  const [apiGroups, setApiGroups] = React.useState('');
  const [resources, setResources] = React.useState('');
  
  // Navigation Access state
  const [fleetManagementAccess, setFleetManagementAccess] = React.useState('Full access');
  const [isFleetManagementOpen, setIsFleetManagementOpen] = React.useState(false);
  const [fleetVirtualizationAccess, setFleetVirtualizationAccess] = React.useState('Full access');
  const [isFleetVirtualizationOpen, setIsFleetVirtualizationOpen] = React.useState(false);
  const [corePlatformsAccess, setCorePlatformsAccess] = React.useState('Full access');
  const [isCorePlatformsOpen, setIsCorePlatformsOpen] = React.useState(false);
  
  // Verbs state
  const [verbs, setVerbs] = React.useState({
    get: true,
    list: false,
    watch: false,
    create: false,
    update: false,
    patch: false,
    delete: false,
    deletecollection: false,
    bind: false,
    escalate: false,
    impersonate: false,
    use: false,
    approve: false,
    all: false,
  });

  useDocumentTitle('Create Role');

  const categories = [
    'Project Management',
    'Deployment Management',
    'Pipeline Management',
    'Workbench Management',
  ];

  const handleVerbChange = (verb: string, checked: boolean) => {
    setVerbs(prev => ({ ...prev, [verb]: checked }));
  };

  const handleSelectAll = (category: 'read' | 'write' | 'delete' | 'advanced') => {
    if (category === 'read') {
      setVerbs(prev => ({ ...prev, get: true, list: true, watch: true }));
    } else if (category === 'write') {
      setVerbs(prev => ({ ...prev, create: true, update: true, patch: true }));
    } else if (category === 'delete') {
      setVerbs(prev => ({ ...prev, delete: true, deletecollection: true }));
    } else if (category === 'advanced') {
      setVerbs(prev => ({ ...prev, bind: true, escalate: true, impersonate: true, use: true, approve: true, all: true }));
    }
  };

  const generateYAML = () => {
    const selectedVerbs = Object.entries(verbs)
      .filter(([_, checked]) => checked)
      .map(([verb]) => verb === 'all' ? '*' : verb);

    return `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: ${roleName}
rules:
- apiGroups:
  - "${apiGroups || '*'}"
  resources:
  - "${resources || '*'}"
  verbs:
${selectedVerbs.length > 0 ? selectedVerbs.map(v => `  - "${v}"`).join('\n') : '  - "*"'}
`;
  };

  const [yamlContent, setYamlContent] = React.useState(generateYAML());

  React.useEffect(() => {
    setYamlContent(generateYAML());
  }, [roleName, apiGroups, resources, verbs]);

  const handleSubmit = () => {
    // Handle form submission
    navigate('/settings/user-management/roles');
  };

  const handleCancel = () => {
    navigate('/settings/user-management/roles');
  };

  const breadcrumb = (
    <PageBreadcrumb>
      <Breadcrumb>
        <BreadcrumbItem to="/settings/user-management/roles">Roles</BreadcrumbItem>
        <BreadcrumbItem isActive>Create custom role</BreadcrumbItem>
      </Breadcrumb>
    </PageBreadcrumb>
  );

  return (
    <>
      {breadcrumb}
      <PageSection>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>Create custom role</Title>
        <Content style={{ marginBottom: '16px', color: 'var(--pf-v5-global--Color--200)' }}>
          Create a custom role to control what users can see and do across your cluster resources. Define permissions, navigation access, and resource scopes to implement fine-grained access control.
        </Content>
        <Button variant="link" isInline style={{ paddingLeft: 0, marginBottom: '16px' }}>
          Select templates
        </Button>

        <Grid hasGutter>
          <GridItem span={6}>
            <Card>
              <CardBody>
                <Split hasGutter>
                  <SplitItem isFilled>
                    <Title headingLevel="h2" size="lg">Role Configuration</Title>
                  </SplitItem>
                  <SplitItem>
                    <Button variant="plain">Clear All</Button>
                  </SplitItem>
                </Split>

                <Form style={{ marginTop: 'var(--pf-v5-global--spacer--md)' }}>
                  <FormGroup
                    label="Role Name"
                    isRequired
                    fieldId="role-name"
                  >
                    <TextInput
                      id="role-name"
                      value={roleName}
                      onChange={(_event, value) => setRoleName(value)}
                    />
                    <Content component="small" style={{ color: 'var(--pf-v5-global--Color--200)' }}>
                      Use lowercase letters, numbers, and hyphens only
                    </Content>
                  </FormGroup>

                  <FormGroup
                    label="Labels"
                    fieldId="labels"
                  >
                    <Content component="p" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)', marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
                      Add key/value labels to organize and find this role (for example by organization or team).
                    </Content>
                    <Button variant="link" isInline icon={<PlusIcon />} style={{ paddingLeft: 0 }}>
                      Add label
                    </Button>
                  </FormGroup>

                  <FormGroup
                    label="Description"
                    fieldId="description"
                  >
                    <TextArea
                      id="description"
                      value={description}
                      onChange={(_event, value) => setDescription(value)}
                      placeholder="Explain what this role is for and who should use it"
                      rows={4}
                    />
                  </FormGroup>

                  <FormGroup
                    label="Category"
                    fieldId="category"
                  >
                    <Content component="p" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)', marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
                      Assign this role to a category to help organize and filter roles.
                    </Content>
                    <Split hasGutter>
                      <SplitItem isFilled>
                        <Select
                          isOpen={isCategoryOpen}
                          selected={category || 'Select a category'}
                          onSelect={(_event, value) => {
                            setCategory(value as string);
                            setIsCategoryOpen(false);
                          }}
                          onOpenChange={(isOpen) => setIsCategoryOpen(isOpen)}
                          toggle={(toggleRef) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                              isExpanded={isCategoryOpen}
                              isFullWidth
                            >
                              {category || 'Select a category'}
                            </MenuToggle>
                          )}
                        >
                          <SelectList>
                            {categories.map((cat) => (
                              <SelectOption key={cat} value={cat}>
                                {cat}
                              </SelectOption>
                            ))}
                          </SelectList>
                        </Select>
                      </SplitItem>
                    </Split>
                  </FormGroup>

                  <Divider style={{ margin: 'var(--pf-v5-global--spacer--lg) 0' }} />

                  <Split hasGutter style={{ marginTop: 'var(--pf-v5-global--spacer--lg)' }}>
                    <SplitItem isFilled>
                      <Title headingLevel="h3" size="md">Permission Rules</Title>
                    </SplitItem>
                    <SplitItem>
                      <Button variant="link" isInline icon={<PlusIcon />}>
                        Add Rule
                      </Button>
                    </SplitItem>
                  </Split>

                  <Card style={{ marginTop: 'var(--pf-v5-global--spacer--md)', overflow: 'visible' }}>
                    <CardBody style={{ overflow: 'visible' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--pf-v5-global--spacer--md)', overflow: 'visible' }}>
                        <div style={{ flex: '1 1 0%', minWidth: 0 }}>
                          <ExpandableSection
                            toggleText="Rule 1"
                            isExpanded={isRuleExpanded}
                            onToggle={(_event, isExpanded) => setIsRuleExpanded(isExpanded)}
                          >
                            <FormGroup
                              label="API Groups"
                              fieldId="api-groups-1"
                              style={{ marginTop: 'var(--pf-v5-global--spacer--md)' }}
                            >
                              <Content component="p" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                                Enter one or more API groups for this rule. Separate multiple values with commas.
                              </Content>
                              <TextInput
                                id="api-groups-1"
                                value={apiGroups}
                                onChange={(_event, value) => setApiGroups(value)}
                                placeholder="Enter API groups"
                              />
                              <Button variant="link" isInline style={{ paddingLeft: 0, marginTop: 'var(--pf-v5-global--spacer--sm)' }}>
                                Browse API catalog
                              </Button>
                            </FormGroup>

                            <Divider style={{ margin: '16px 0' }} />

                            <FormGroup
                              label="Resources"
                              fieldId="resources-1"
                            >
                              <Content component="p" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                                Enter one or more resource types for the selected API groups. Separate multiple values with commas.
                              </Content>
                              <TextInput
                                id="resources-1"
                                value={resources}
                                onChange={(_event, value) => setResources(value)}
                                placeholder="Enter resources"
                              />
                              <Button variant="link" isInline style={{ paddingLeft: 0, marginTop: 'var(--pf-v5-global--spacer--sm)' }}>
                                Browse resources catalog
                              </Button>
                            </FormGroup>

                            <Divider style={{ margin: '16px 0' }} />

                            <FormGroup
                              label="Verbs (Permissions)"
                              fieldId="verbs-1"
                            >
                              <Split hasGutter style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
                                <SplitItem isFilled>
                                  <Content component="p" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                                    Select the actions this rule allows on the chosen resources.
                                  </Content>
                                </SplitItem>
                                <SplitItem>
                                  <Button variant="link" isInline style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                                    Select all categories
                                  </Button>
                                </SplitItem>
                              </Split>

                              {/* Read Operations */}
                              <Card style={{ marginBottom: '16px' }}>
                                <CardBody>
                                  <Split hasGutter style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
                                    <SplitItem isFilled>
                                      <Content style={{ fontWeight: 600, margin: 0 }}>Read Operations</Content>
                                      <Content component="small" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                                        View and monitor resources
                                      </Content>
                                    </SplitItem>
                                    <SplitItem>
                                      <Button variant="link" isInline style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }} onClick={() => handleSelectAll('read')}>
                                        Select all
                                      </Button>
                                    </SplitItem>
                                  </Split>
                                  <Grid hasGutter>
                                    <GridItem span={4}>
                                      <Checkbox
                                        id="verb-1-get"
                                        label={
                                          <>
                                            <strong>Get</strong><br />
                                            <span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                                              Read individual resources
                                            </span>
                                          </>
                                        }
                                        isChecked={verbs.get}
                                        onChange={(_event, checked) => handleVerbChange('get', checked)}
                                      />
                                    </GridItem>
                                    <GridItem span={4}>
                                      <Checkbox
                                        id="verb-1-list"
                                        label={
                                          <>
                                            <strong>List</strong><br />
                                            <span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                                              List multiple resources
                                            </span>
                                          </>
                                        }
                                        isChecked={verbs.list}
                                        onChange={(_event, checked) => handleVerbChange('list', checked)}
                                      />
                                    </GridItem>
                                    <GridItem span={4}>
                                      <Checkbox
                                        id="verb-1-watch"
                                        label={
                                          <>
                                            <strong>Watch</strong><br />
                                            <span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                                              Watch for resource changes
                                            </span>
                                          </>
                                        }
                                        isChecked={verbs.watch}
                                        onChange={(_event, checked) => handleVerbChange('watch', checked)}
                                      />
                                    </GridItem>
                                  </Grid>
                                </CardBody>
                              </Card>

                              {/* Write Operations */}
                              <Card style={{ marginBottom: '16px' }}>
                                <CardBody>
                                  <Split hasGutter style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
                                    <SplitItem isFilled>
                                      <Content style={{ fontWeight: 600, margin: 0 }}>Write Operations</Content>
                                      <Content component="small" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                                        Create and modify resources
                                      </Content>
                                    </SplitItem>
                                    <SplitItem>
                                      <Button variant="link" isInline style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }} onClick={() => handleSelectAll('write')}>
                                        Select all
                                      </Button>
                                    </SplitItem>
                                  </Split>
                                  <Grid hasGutter>
                                    <GridItem span={4}>
                                      <Checkbox
                                        id="verb-1-create"
                                        label={
                                          <>
                                            <strong>Create</strong><br />
                                            <span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                                              Create new resources
                                            </span>
                                          </>
                                        }
                                        isChecked={verbs.create}
                                        onChange={(_event, checked) => handleVerbChange('create', checked)}
                                      />
                                    </GridItem>
                                    <GridItem span={4}>
                                      <Checkbox
                                        id="verb-1-update"
                                        label={
                                          <>
                                            <strong>Update</strong><br />
                                            <span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                                              Update existing resources
                                            </span>
                                          </>
                                        }
                                        isChecked={verbs.update}
                                        onChange={(_event, checked) => handleVerbChange('update', checked)}
                                      />
                                    </GridItem>
                                    <GridItem span={4}>
                                      <Checkbox
                                        id="verb-1-patch"
                                        label={
                                          <>
                                            <strong>Patch</strong><br />
                                            <span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                                              Partially update resources
                                            </span>
                                          </>
                                        }
                                        isChecked={verbs.patch}
                                        onChange={(_event, checked) => handleVerbChange('patch', checked)}
                                      />
                                    </GridItem>
                                  </Grid>
                                </CardBody>
                              </Card>

                              {/* Delete Operations */}
                              <Card style={{ marginBottom: '16px' }}>
                                <CardBody>
                                  <Split hasGutter style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
                                    <SplitItem isFilled>
                                      <Content style={{ fontWeight: 600, margin: 0 }}>Delete Operations</Content>
                                      <Content component="small" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                                        Remove resources
                                      </Content>
                                    </SplitItem>
                                    <SplitItem>
                                      <Button variant="link" isInline style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }} onClick={() => handleSelectAll('delete')}>
                                        Select all
                                      </Button>
                                    </SplitItem>
                                  </Split>
                                  <Grid hasGutter>
                                    <GridItem span={4}>
                                      <Checkbox
                                        id="verb-1-delete"
                                        label={
                                          <>
                                            <strong>Delete</strong><br />
                                            <span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                                              Delete individual resources
                                            </span>
                                          </>
                                        }
                                        isChecked={verbs.delete}
                                        onChange={(_event, checked) => handleVerbChange('delete', checked)}
                                      />
                                    </GridItem>
                                    <GridItem span={4}>
                                      <Checkbox
                                        id="verb-1-deletecollection"
                                        label={
                                          <>
                                            <strong>Delete Collection</strong><br />
                                            <span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                                              Delete multiple resources at once
                                            </span>
                                          </>
                                        }
                                        isChecked={verbs.deletecollection}
                                        onChange={(_event, checked) => handleVerbChange('deletecollection', checked)}
                                      />
                                    </GridItem>
                                  </Grid>
                                </CardBody>
                              </Card>

                              {/* Advanced Operations */}
                              <Card>
                                <CardBody>
                                  <Split hasGutter style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
                                    <SplitItem isFilled>
                                      <Content style={{ fontWeight: 600, margin: 0 }}>Advanced Operations</Content>
                                      <Content component="small" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                                        Special permissions (use with caution)
                                      </Content>
                                    </SplitItem>
                                    <SplitItem>
                                      <Button variant="link" isInline style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }} onClick={() => handleSelectAll('advanced')}>
                                        Select all
                                      </Button>
                                    </SplitItem>
                                  </Split>
                                  <Grid hasGutter>
                                    <GridItem span={4}>
                                      <Checkbox
                                        id="verb-1-bind"
                                        label={
                                          <>
                                            <strong>Bind</strong><br />
                                            <span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                                              Bind roles to users or groups
                                            </span>
                                          </>
                                        }
                                        isChecked={verbs.bind}
                                        onChange={(_event, checked) => handleVerbChange('bind', checked)}
                                      />
                                    </GridItem>
                                    <GridItem span={4}>
                                      <Checkbox
                                        id="verb-1-escalate"
                                        label={
                                          <>
                                            <strong>Escalate</strong><br />
                                            <span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                                              Grant permissions above current role
                                            </span>
                                          </>
                                        }
                                        isChecked={verbs.escalate}
                                        onChange={(_event, checked) => handleVerbChange('escalate', checked)}
                                      />
                                    </GridItem>
                                    <GridItem span={4}>
                                      <Checkbox
                                        id="verb-1-impersonate"
                                        label={
                                          <>
                                            <strong>Impersonate</strong><br />
                                            <span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                                              Impersonate another user
                                            </span>
                                          </>
                                        }
                                        isChecked={verbs.impersonate}
                                        onChange={(_event, checked) => handleVerbChange('impersonate', checked)}
                                      />
                                    </GridItem>
                                    <GridItem span={4}>
                                      <Checkbox
                                        id="verb-1-use"
                                        label={
                                          <>
                                            <strong>Use</strong><br />
                                            <span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                                              Use named resources (e.g., SecurityContextConstraints)
                                            </span>
                                          </>
                                        }
                                        isChecked={verbs.use}
                                        onChange={(_event, checked) => handleVerbChange('use', checked)}
                                      />
                                    </GridItem>
                                    <GridItem span={4}>
                                      <Checkbox
                                        id="verb-1-approve"
                                        label={
                                          <>
                                            <strong>Approve</strong><br />
                                            <span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                                              Approve certificate signing requests
                                            </span>
                                          </>
                                        }
                                        isChecked={verbs.approve}
                                        onChange={(_event, checked) => handleVerbChange('approve', checked)}
                                      />
                                    </GridItem>
                                    <GridItem span={4}>
                                      <Checkbox
                                        id="verb-1-all"
                                        label={
                                          <>
                                            <strong>All (*)</strong><br />
                                            <span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                                              All operations (admin level)
                                            </span>
                                          </>
                                        }
                                        isChecked={verbs.all}
                                        onChange={(_event, checked) => handleVerbChange('all', checked)}
                                      />
                                    </GridItem>
                                  </Grid>
                                </CardBody>
                              </Card>
                            </FormGroup>
                          </ExpandableSection>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Form>
              </CardBody>
            </Card>

            <div style={{ marginTop: 'var(--pf-v5-global--spacer--lg)' }}>
              <Button variant="primary" onClick={handleSubmit}>Create Role</Button>
            </div>
          </GridItem>

          <GridItem span={6}>
            <Card isFullHeight>
              <CardBody>
                <Split hasGutter style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
                  <SplitItem isFilled>
                    <Title headingLevel="h2" size="lg">Live YAML</Title>
                  </SplitItem>
                  <SplitItem>
                    <Button variant="plain" aria-label="Download YAML" icon={<DownloadIcon />} />
                  </SplitItem>
                </Split>
                <Content component="small" style={{ color: 'var(--pf-v5-global--Color--200)', marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
                  Auto-generated from the form. You can manually edit the YAML directly.
                </Content>
                <div style={{ position: 'relative' }}>
                  <TextArea
                    value={yamlContent}
                    onChange={(_event, value) => setYamlContent(value)}
                    aria-label="YAML editor"
                    style={{ fontFamily: 'monospace', fontSize: '14px', minHeight: '600px', resize: 'vertical' }}
                  />
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};

export { CreateRole };
