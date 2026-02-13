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
  CardHeader,
  CardTitle,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
  TextArea,
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
  Checkbox,
  Flex,
  FlexItem,
  Split,
  SplitItem,
  Divider,
  ExpandableSection,
  ClipboardCopy,
  ClipboardCopyButton,
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
        <Split hasGutter style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
          <SplitItem isFilled>
            <Title headingLevel="h1" size="2xl">Create custom role</Title>
          </SplitItem>
          <SplitItem>
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
          </SplitItem>
        </Split>
        <Content style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
          Create a custom role to control what users can see and do across your cluster resources. Define permissions, navigation access, and resource scopes to implement fine-grained access control.
        </Content>
        <Button variant="link" isInline style={{ paddingLeft: 0, marginBottom: 'var(--pf-v5-global--spacer--lg)' }}>
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
                    <FormHelperText>
                      <HelperText>
                        <HelperTextItem>Use lowercase letters, numbers, and hyphens only</HelperTextItem>
                      </HelperText>
                    </FormHelperText>
                  </FormGroup>

                  <FormGroup
                    label="Labels"
                    fieldId="labels"
                  >
                    <FormHelperText>
                      <HelperText>
                        <HelperTextItem>Add key/value labels to organize and find this role (for example by organization or team).</HelperTextItem>
                      </HelperText>
                    </FormHelperText>
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
                    <FormHelperText>
                      <HelperText>
                        <HelperTextItem>Assign this role to a category to help organize and filter roles.</HelperTextItem>
                      </HelperText>
                    </FormHelperText>
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

                  <Card style={{ marginTop: 'var(--pf-v5-global--spacer--md)' }}>
                    <CardBody>
                      <ExpandableSection
                        toggleText="Rule 1"
                        isExpanded={isRuleExpanded}
                        onToggle={(_event, isExpanded) => setIsRuleExpanded(isExpanded)}
                      >
                        <FormGroup
                          label="API Groups"
                          fieldId="api-groups-1"
                        >
                          <FormHelperText>
                            <HelperText>
                              <HelperTextItem>Enter one or more API groups for this rule. Separate multiple values with commas.</HelperTextItem>
                            </HelperText>
                          </FormHelperText>
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

                        <Divider style={{ margin: 'var(--pf-v5-global--spacer--lg) 0' }} />

                        <FormGroup
                          label="Resources"
                          fieldId="resources-1"
                        >
                          <FormHelperText>
                            <HelperText>
                              <HelperTextItem>Enter one or more resource types for the selected API groups. Separate multiple values with commas.</HelperTextItem>
                            </HelperText>
                          </FormHelperText>
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

                        <Divider style={{ margin: 'var(--pf-v5-global--spacer--lg) 0' }} />

                        <FormGroup
                          label="Verbs (Permissions)"
                          fieldId="verbs-1"
                        >
                          <FormHelperText>
                            <HelperText>
                              <HelperTextItem>Select the actions this rule allows on the chosen resources.</HelperTextItem>
                            </HelperText>
                          </FormHelperText>
                          <Split hasGutter style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
                            <SplitItem isFilled />
                            <SplitItem>
                              <Button variant="link" isInline style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                                Select all categories
                              </Button>
                            </SplitItem>
                          </Split>

                          {/* Read Operations */}
                          <div style={{ marginBottom: 'var(--pf-v5-global--spacer--md)', padding: 'var(--pf-v5-global--spacer--md)', border: '1px solid var(--pf-v5-global--BorderColor--100)', borderRadius: 'var(--pf-v5-global--BorderRadius--sm)', backgroundColor: 'var(--pf-v5-global--BackgroundColor--100)' }}>
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
                          </div>

                          {/* Write Operations */}
                          <div style={{ marginBottom: 'var(--pf-v5-global--spacer--md)', padding: 'var(--pf-v5-global--spacer--md)', border: '1px solid var(--pf-v5-global--BorderColor--100)', borderRadius: 'var(--pf-v5-global--BorderRadius--sm)', backgroundColor: 'var(--pf-v5-global--BackgroundColor--100)' }}>
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
                          </div>

                          {/* Delete Operations */}
                          <div style={{ marginBottom: 'var(--pf-v5-global--spacer--md)', padding: 'var(--pf-v5-global--spacer--md)', border: '1px solid var(--pf-v5-global--BorderColor--100)', borderRadius: 'var(--pf-v5-global--BorderRadius--sm)', backgroundColor: 'var(--pf-v5-global--BackgroundColor--100)' }}>
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
                          </div>
                        </FormGroup>
                        </ExpandableSection>
                      </CardBody>
                    </Card>

                    <div style={{ marginTop: 'var(--pf-v5-global--spacer--lg)' }}>
                      <Button variant="primary" onClick={handleSubmit}>Create Role</Button>
                      {' '}
                      <Button variant="link" onClick={handleCancel}>Cancel</Button>
                    </div>
                  </Form>
              </CardBody>
            </Card>
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
                <TextArea
                  value={yamlContent}
                  onChange={(_event, value) => setYamlContent(value)}
                  aria-label="YAML editor"
                  style={{ fontFamily: 'monospace', fontSize: '14px', minHeight: '600px', resize: 'vertical' }}
                />
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};

export { CreateRole };
