import React from 'react';
import {
  Button,
  Checkbox,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  MenuToggle,
  MenuToggleElement,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  SelectList,
  SelectOption,
  TextArea,
  TextInput
} from '@patternfly/react-core';
import { mockTiers } from '../../Settings/Tiers/mockData';

type AssetType = 'Model' | 'MCP Server' | '';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isFormValid: () => boolean;
  
  // Asset Type
  assetType: AssetType;
  setAssetType: (value: AssetType) => void;
  isAssetTypeOpen: boolean;
  setIsAssetTypeOpen: (value: boolean) => void;
  
  // Project fields
  project: string;
  setProject: (value: string) => void;
  isProjectOpen: boolean;
  setIsProjectOpen: (value: boolean) => void;
  
  // Model Deployment fields
  modelDeployment: string;
  setModelDeployment: (value: string) => void;
  isModelDeploymentOpen: boolean;
  setIsModelDeploymentOpen: (value: boolean) => void;
  
  // External Provider fields
  externalProvider: string;
  setExternalProvider: (value: string) => void;
  isExternalProviderOpen: boolean;
  setIsExternalProviderOpen: (value: boolean) => void;
  externalProviderAPIKey: string;
  setExternalProviderAPIKey: (value: string) => void;
  selectedExternalModels: Set<string>;
  setSelectedExternalModels: (value: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  
  // MCP Server fields
  mcpServer: string;
  setMcpServer: (value: string) => void;
  isMcpServerOpen: boolean;
  setIsMcpServerOpen: (value: boolean) => void;
  tools: string;
  setTools: (value: string) => void;
  isToolsOpen: boolean;
  setIsToolsOpen: (value: boolean) => void;
  
  // Tiers fields (replacing Access Control)
  selectedTiers: string[];
  setSelectedTiers: (value: string[]) => void;
  isTierSelectOpen: boolean;
  setIsTierSelectOpen: (value: boolean) => void;
  customTierNames: string;
  setCustomTierNames: (value: string) => void;
  
  // Description
  assetDescription: string;
  setAssetDescription: (value: string) => void;
}

export const AddAssetModal: React.FC<AddAssetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isFormValid,
  assetType,
  setAssetType,
  isAssetTypeOpen,
  setIsAssetTypeOpen,
  project,
  setProject,
  isProjectOpen,
  setIsProjectOpen,
  modelDeployment,
  setModelDeployment,
  isModelDeploymentOpen,
  setIsModelDeploymentOpen,
  externalProvider,
  setExternalProvider,
  isExternalProviderOpen,
  setIsExternalProviderOpen,
  externalProviderAPIKey,
  setExternalProviderAPIKey,
  selectedExternalModels,
  setSelectedExternalModels,
  mcpServer,
  setMcpServer,
  isMcpServerOpen,
  setIsMcpServerOpen,
  tools,
  setTools,
  isToolsOpen,
  setIsToolsOpen,
  selectedTiers,
  setSelectedTiers,
  isTierSelectOpen,
  setIsTierSelectOpen,
  customTierNames,
  setCustomTierNames,
  assetDescription,
  setAssetDescription
}) => {
  const handleAssetTypeChange = (value: AssetType) => {
    setAssetType(value);
    setIsAssetTypeOpen(false);
    // Reset conditional fields when asset type changes
    setProject('');
    setModelDeployment('');
    setMcpServer('');
    setTools('');
  };

  const handleExternalModelToggle = (modelId: string, checked: boolean) => {
    setSelectedExternalModels(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(modelId);
      } else {
        newSet.delete(modelId);
      }
      return newSet;
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="add-asset-modal-title"
      aria-describedby="add-asset-modal-body"
      ouiaId="AddAssetModal"
      className="pf-m-md"
      appendTo={document.body}
      id="add-asset-modal"
    >
      <ModalHeader 
        title="Add asset" 
        labelId="add-asset-modal-title"
      />
      <ModalBody id="add-asset-modal-body">
        <Form>
          <FormGroup 
            label="Asset type" 
            fieldId="asset-type-select"
            isRequired
          >
            <Select
              id="asset-type-select"
              isOpen={isAssetTypeOpen}
              selected={assetType}
              onSelect={(_event, value) => handleAssetTypeChange(value as AssetType)}
              onOpenChange={setIsAssetTypeOpen}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsAssetTypeOpen(!isAssetTypeOpen)}
                  isExpanded={isAssetTypeOpen}
                  style={{ width: '100%' }}
                  id="asset-type-toggle"
                >
                  {assetType || 'Select asset type'}
                </MenuToggle>
              )}
            >
              <SelectList>
                <SelectOption value="Model" id="asset-type-model">
                  Model
                </SelectOption>
                <SelectOption value="MCP Server" id="asset-type-mcp-server">
                  MCP Server
                </SelectOption>
              </SelectList>
            </Select>
          </FormGroup>

          {assetType === 'Model' && (
            <>
                  <FormGroup 
                    label="Project" 
                    fieldId="add-asset-project-select"
                    isRequired
                  >
                    <Select
                      id="add-asset-project-select"
                      isOpen={isProjectOpen}
                      selected={project}
                      onSelect={(_event, value) => {
                        setProject(value as string);
                        setIsProjectOpen(false);
                      }}
                      onOpenChange={setIsProjectOpen}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsProjectOpen(!isProjectOpen)}
                          isExpanded={isProjectOpen}
                          style={{ width: '100%' }}
                          id="add-asset-project-toggle"
                        >
                          {project || 'Select project'}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="Project 1" id="add-asset-project-1">
                          Project 1
                        </SelectOption>
                        <SelectOption value="Project 2" id="add-asset-project-2">
                          Project 2
                        </SelectOption>
                        <SelectOption value="Project 3" id="add-asset-project-3">
                          Project 3
                        </SelectOption>
                      </SelectList>
                    </Select>
                  </FormGroup>

                  <FormGroup 
                    label="Model deployment" 
                    fieldId="add-asset-model-deployment-select"
                    isRequired
                  >
                    <Select
                      id="add-asset-model-deployment-select"
                      isOpen={isModelDeploymentOpen}
                      selected={modelDeployment}
                      onSelect={(_event, value) => {
                        setModelDeployment(value as string);
                        setIsModelDeploymentOpen(false);
                      }}
                      onOpenChange={setIsModelDeploymentOpen}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsModelDeploymentOpen(!isModelDeploymentOpen)}
                          isExpanded={isModelDeploymentOpen}
                          style={{ width: '100%' }}
                          id="add-asset-model-deployment-toggle"
                        >
                          {modelDeployment || 'Select model deployment'}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="Model Deployment 1" id="add-asset-deployment-1">
                          Model Deployment 1
                        </SelectOption>
                        <SelectOption value="Model Deployment 2" id="add-asset-deployment-2">
                          Model Deployment 2
                        </SelectOption>
                        <SelectOption value="Model Deployment 3" id="add-asset-deployment-3">
                          Model Deployment 3
                        </SelectOption>
                      </SelectList>
                    </Select>
                    <FormHelperText>
                      <HelperText>
                        <HelperTextItem>
                          Adding this as an AI asset will make it available to other users outside of the namespace/project.
                        </HelperTextItem>
                      </HelperText>
                  </FormHelperText>
                </FormGroup>

              {/* External provider descoped from 3.2/3.3 but likely to arrive in 3.4 */}
          {/* {modelLocation === 'External' && (
            <>
              <FormGroup 
                label="External provider" 
                fieldId="external-provider-select"
                isRequired
              >
                <Select
                  id="external-provider-select"
                  isOpen={isExternalProviderOpen}
                  selected={externalProvider}
                  onSelect={(_event, value) => {
                    setExternalProvider(value as string);
                    setIsExternalProviderOpen(false);
                  }}
                  onOpenChange={setIsExternalProviderOpen}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsExternalProviderOpen(!isExternalProviderOpen)}
                      isExpanded={isExternalProviderOpen}
                      style={{ width: '100%' }}
                      id="external-provider-toggle"
                    >
                      {externalProvider || 'Select external provider'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption value="OpenAI" id="provider-openai">
                      OpenAI
                    </SelectOption>
                    <SelectOption value="Anthropic" id="provider-anthropic">
                      Anthropic
                    </SelectOption>
                  </SelectList>
                </Select>
              </FormGroup>

              <FormGroup 
                label="API key" 
                fieldId="external-provider-api-key"
                isRequired
              >
                <TextInput
                  id="external-provider-api-key"
                  type="password"
                  value={externalProviderAPIKey}
                  onChange={(_event, value) => setExternalProviderAPIKey(value)}
                  placeholder="Enter your API key"
                />
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem>
                      Your API key from {externalProvider || 'the external provider'} to authenticate requests.
                    </HelperTextItem>
                  </HelperText>
                </FormHelperText>
              </FormGroup>

              {externalProviderAPIKey && (
                <FormGroup 
                  label="Available models" 
                  fieldId="external-models-select"
                  isRequired
                >
                  <div style={{ 
                    border: '1px solid var(--pf-v5-global--BorderColor--100)', 
                    borderRadius: '4px', 
                    padding: '1rem',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#6a6e73' }}>
                      Select the models you want to add as AI assets:
                    </p>
                    {externalProvider === 'OpenAI' && (
                      <>
                        <Checkbox
                          id="external-model-gpt4"
                          label="GPT-4"
                          description="Most capable model, best for complex tasks"
                          isChecked={selectedExternalModels.has('gpt-4')}
                          onChange={(_event, checked) => handleExternalModelToggle('gpt-4', checked)}
                          style={{ marginBottom: '0.5rem' }}
                        />
                        <Checkbox
                          id="external-model-gpt4-turbo"
                          label="GPT-4 Turbo"
                          description="Fast and efficient variant of GPT-4"
                          isChecked={selectedExternalModels.has('gpt-4-turbo')}
                          onChange={(_event, checked) => handleExternalModelToggle('gpt-4-turbo', checked)}
                          style={{ marginBottom: '0.5rem' }}
                        />
                        <Checkbox
                          id="external-model-gpt35-turbo"
                          label="GPT-3.5 Turbo"
                          description="Fast and cost-effective for simpler tasks"
                          isChecked={selectedExternalModels.has('gpt-3.5-turbo')}
                          onChange={(_event, checked) => handleExternalModelToggle('gpt-3.5-turbo', checked)}
                        />
                      </>
                    )}
                    {externalProvider === 'Anthropic' && (
                      <>
                        <Checkbox
                          id="external-model-claude-3-opus"
                          label="Claude 3 Opus"
                          description="Most intelligent model for complex tasks"
                          isChecked={selectedExternalModels.has('claude-3-opus')}
                          onChange={(_event, checked) => handleExternalModelToggle('claude-3-opus', checked)}
                          style={{ marginBottom: '0.5rem' }}
                        />
                        <Checkbox
                          id="external-model-claude-3-sonnet"
                          label="Claude 3 Sonnet"
                          description="Balanced performance and intelligence"
                          isChecked={selectedExternalModels.has('claude-3-sonnet')}
                          onChange={(_event, checked) => handleExternalModelToggle('claude-3-sonnet', checked)}
                          style={{ marginBottom: '0.5rem' }}
                        />
                        <Checkbox
                          id="external-model-claude-3-haiku"
                          label="Claude 3 Haiku"
                          description="Fast and cost-effective for quick tasks"
                          isChecked={selectedExternalModels.has('claude-3-haiku')}
                          onChange={(_event, checked) => handleExternalModelToggle('claude-3-haiku', checked)}
                        />
                      </>
                    )}
                  </div>
                  <FormHelperText>
                    <HelperText>
                      <HelperTextItem>
                        Selected models will be added as AI assets and available for use.
                      </HelperTextItem>
                    </HelperText>
                  </FormHelperText>
                </FormGroup>
              )}
            </>
          )} */}
        </>
          )}

          {assetType === 'MCP Server' && (
            <>
              <FormGroup 
                label="MCP Server" 
                fieldId="add-asset-mcp-server-select"
                isRequired
              >
                <Select
                  id="add-asset-mcp-server-select"
                  isOpen={isMcpServerOpen}
                  selected={mcpServer}
                  onSelect={(_event, value) => {
                    setMcpServer(value as string);
                    setIsMcpServerOpen(false);
                  }}
                  onOpenChange={setIsMcpServerOpen}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsMcpServerOpen(!isMcpServerOpen)}
                      isExpanded={isMcpServerOpen}
                      style={{ width: '100%' }}
                      id="add-asset-mcp-server-toggle"
                    >
                      {mcpServer || 'Select MCP server'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption value="MCP Server 1" id="add-asset-mcp-server-1">
                      MCP Server 1
                    </SelectOption>
                    <SelectOption value="MCP Server 2" id="add-asset-mcp-server-2">
                      MCP Server 2
                    </SelectOption>
                    <SelectOption value="MCP Server 3" id="add-asset-mcp-server-3">
                      MCP Server 3
                    </SelectOption>
                  </SelectList>
                </Select>
              </FormGroup>

              <FormGroup 
                label="Tools" 
                fieldId="add-asset-tools-select"
                isRequired
              >
                <Select
                  id="add-asset-tools-select"
                  isOpen={isToolsOpen}
                  selected={tools}
                  onSelect={(_event, value) => {
                    setTools(value as string);
                    setIsToolsOpen(false);
                  }}
                  onOpenChange={setIsToolsOpen}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsToolsOpen(!isToolsOpen)}
                      isExpanded={isToolsOpen}
                      style={{ width: '100%' }}
                      id="add-asset-tools-toggle"
                    >
                      {tools || 'Select tools'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption value="Tool 1" id="add-asset-tool-1">
                      Tool 1
                    </SelectOption>
                    <SelectOption value="Tool 2" id="add-asset-tool-2">
                      Tool 2
                    </SelectOption>
                    <SelectOption value="Tool 3" id="add-asset-tool-3">
                      Tool 3
                    </SelectOption>
                  </SelectList>
                </Select>
              </FormGroup>
            </>
          )}

          {((assetType === 'Model' && project !== '' && modelDeployment !== '') || (assetType === 'MCP Server' && mcpServer !== '')) && (
            <>
              <FormGroup 
                label="Availability" 
                fieldId="add-asset-tiers-heading"
              >
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem>
                      Select a tier to make this asset available to other users. Users who can access the selected tier(s) will be able to use this asset.
                    </HelperTextItem>
                  </HelperText>
                </FormHelperText>
              </FormGroup>

              <FormGroup 
                label="Tiers" 
                fieldId="add-asset-tier-select"
                isRequired
              >
                <Select
                  id="add-asset-tier-select"
                  isOpen={isTierSelectOpen}
                  selected={selectedTiers}
                  onSelect={(_event, value) => {
                    const tierValue = value as string;
                    if (tierValue === 'Other...') {
                      // Toggle Other option
                      if (selectedTiers.includes('Other...')) {
                        setSelectedTiers(selectedTiers.filter(t => t !== 'Other...'));
                        setCustomTierNames('');
                      } else {
                        setSelectedTiers([...selectedTiers, 'Other...']);
                      }
                    } else {
                      // Toggle tier selection
                      if (selectedTiers.includes(tierValue)) {
                        setSelectedTiers(selectedTiers.filter(t => t !== tierValue));
                      } else {
                        setSelectedTiers([...selectedTiers, tierValue]);
                      }
                    }
                  }}
                  onOpenChange={(isOpen) => setIsTierSelectOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => {
                    // Get display names for selected tiers
                    const selectedDisplayNames = selectedTiers
                      .filter(tierId => tierId !== 'Other...')
                      .map(tierId => {
                        const tier = mockTiers.find(t => t.id === tierId);
                        return tier ? tier.name : tierId;
                      });
                    
                    // Add "Other..." if it's selected
                    if (selectedTiers.includes('Other...')) {
                      selectedDisplayNames.push('Other...');
                    }
                    
                    const displayText = selectedDisplayNames.length > 0 
                      ? selectedDisplayNames.join(', ') 
                      : 'Select tiers';
                    
                    return (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsTierSelectOpen(!isTierSelectOpen)}
                        isExpanded={isTierSelectOpen}
                        id="add-asset-tier-select-toggle"
                        style={{ width: '100%' }}
                      >
                        {displayText}
                      </MenuToggle>
                    );
                  }}
                >
                  <SelectList>
                    {mockTiers
                      .filter(tier => tier.status === 'Active')
                      .map(tier => (
                        <SelectOption 
                          key={tier.id}
                          value={tier.id}
                          hasCheckbox
                          isSelected={selectedTiers.includes(tier.id)}
                          id={`add-asset-tier-${tier.id}`}
                        >
                          {tier.name}
                        </SelectOption>
                      ))}
                    <SelectOption 
                      value="Other..."
                      hasCheckbox
                      isSelected={selectedTiers.includes('Other...')}
                      id="add-asset-tier-other"
                    >
                      Other...
                    </SelectOption>
                  </SelectList>
                </Select>
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem>
                      The asset will be made available to users who can access these tiers
                    </HelperTextItem>
                  </HelperText>
                </FormHelperText>
              </FormGroup>

              {selectedTiers.includes('Other...') && (
                <FormGroup 
                  label="Custom tier names" 
                  fieldId="add-asset-custom-tier-names"
                  isRequired
                >
                  <TextInput
                    id="add-asset-custom-tier-names"
                    type="text"
                    value={customTierNames}
                    onChange={(_event, value) => setCustomTierNames(value)}
                    placeholder="Enter tier names (comma separated)"
                    aria-label="Custom tier names"
                  />
                  <FormHelperText>
                    <HelperText>
                      <HelperTextItem>
                        Enter the exact names of additional tiers (comma separated) that you would like the asset to be available to
                      </HelperTextItem>
                    </HelperText>
                  </FormHelperText>
                </FormGroup>
              )}
            </>
          )}

          <FormGroup 
            label="Description" 
            fieldId="add-asset-description-input"
            isRequired
          >
            <TextArea
              id="add-asset-description-input"
              value={assetDescription}
              onChange={(_event, value) => setAssetDescription(value)}
              placeholder="Provide details about the asset, relevant settings, quality of service details, contact information, etc."
              rows={4}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          key="add"
          variant="primary"
          onClick={onSubmit}
          isDisabled={!isFormValid()}
          id="add-asset-submit-button"
        >
          Add AI asset
        </Button>
        <Button
          key="cancel"
          variant="link"
          onClick={onClose}
          id="add-asset-cancel-button"
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

