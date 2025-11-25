import * as React from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Button,
  FormHelperText,
  HelperText,
  HelperTextItem,
  ActionGroup,
  Checkbox,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  Flex,
  FlexItem,
  Badge,
} from '@patternfly/react-core';
import { PlusCircleIcon, MinusCircleIcon } from '@patternfly/react-icons';
import { CreateTierForm } from '../types';
import { mockGroups, mockMaaSModels } from '../mockData';

interface TierFormProps {
  formData: CreateTierForm;
  onChange: (data: CreateTierForm) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

const TierForm: React.FunctionComponent<TierFormProps> = ({ formData, onChange, onSubmit, onCancel, isEditMode = false }) => {
  const [isGroupsOpen, setIsGroupsOpen] = React.useState(false);
  const [isModelsOpen, setIsModelsOpen] = React.useState(false);
  const [isPeriodSelectOpen, setIsPeriodSelectOpen] = React.useState<{ [key: string]: boolean }>({});

  const [tokenLimitEnabled, setTokenLimitEnabled] = React.useState(!!(formData.limits.tokenLimits && formData.limits.tokenLimits.length > 0));
  const [rateLimitEnabled, setRateLimitEnabled] = React.useState(!!(formData.limits.rateLimits && formData.limits.rateLimits.length > 0));

  const handleInputChange = (field: keyof CreateTierForm, value: any) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  const handleLimitChange = (
    limitType: 'tokenLimits' | 'rateLimits',
    index: number,
    field: 'amount' | 'quantity' | 'unit',
    value: any
  ) => {
    const limits = formData.limits[limitType] || [];
    const updatedLimits = limits.map((limit, i) => 
      i === index ? { ...limit, [field]: value } : limit
    );
    
    onChange({
      ...formData,
      limits: {
        ...formData.limits,
        [limitType]: updatedLimits,
      },
    });
  };

  const addLimit = (limitType: 'tokenLimits' | 'rateLimits') => {
    const limits = formData.limits[limitType] || [];
    const newLimit = {
      id: `${limitType}-${Date.now()}`,
      amount: limitType === 'tokenLimits' ? 10000 : 100,
      quantity: 1,
      unit: (limitType === 'tokenLimits' ? 'hour' : 'minute') as 'minute' | 'hour' | 'day',
    };
    
    onChange({
      ...formData,
      limits: {
        ...formData.limits,
        [limitType]: [...limits, newLimit],
      },
    });
  };

  const removeLimit = (limitType: 'tokenLimits' | 'rateLimits', index: number) => {
    const limits = formData.limits[limitType] || [];
    const updatedLimits = limits.filter((_, i) => i !== index);
    
    onChange({
      ...formData,
      limits: {
        ...formData.limits,
        [limitType]: updatedLimits.length > 0 ? updatedLimits : undefined,
      },
    });
  };

  const handleTokenLimitToggle = (checked: boolean) => {
    setTokenLimitEnabled(checked);
    if (!checked) {
      const { tokenLimits, ...otherLimits } = formData.limits;
      onChange({
        ...formData,
        limits: otherLimits,
      });
    } else {
      addLimit('tokenLimits');
    }
  };

  const handleRateLimitToggle = (checked: boolean) => {
    setRateLimitEnabled(checked);
    if (!checked) {
      const { rateLimits, ...otherLimits } = formData.limits;
      onChange({
        ...formData,
        limits: otherLimits,
      });
    } else {
      addLimit('rateLimits');
    }
  };


  const handleGroupSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    if (!value) return;
    const groupId = value as string;
    if (formData.groups.includes(groupId)) {
      handleInputChange('groups', formData.groups.filter((id) => id !== groupId));
    } else {
      handleInputChange('groups', [...formData.groups, groupId]);
    }
  };

  const handleModelSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    if (!value) return;
    const modelId = value as string;
    if (formData.models.includes(modelId)) {
      handleInputChange('models', formData.models.filter((id) => id !== modelId));
    } else {
      handleInputChange('models', [...formData.models, modelId]);
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.level > 0 &&
      formData.groups.length > 0 &&
      formData.models.length > 0
    );
  };

  return (
    <Form id="create-tier-form" isWidthLimited>
      <FormGroup label="Name" isRequired fieldId="tier-name">
        <TextInput
          isRequired
          type="text"
          id="tier-name"
          name="tier-name"
          value={formData.name}
          onChange={(_event, value) => handleInputChange('name', value)}
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem>A descriptive name for this tier (e.g., "Premium Tier")</HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>

      <FormGroup label="Description" fieldId="tier-description">
        <TextArea
          id="tier-description"
          name="tier-description"
          value={formData.description}
          onChange={(_event, value) => handleInputChange('description', value)}
          rows={3}
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem>Optional description of this tier's purpose and target users</HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>

      <FormGroup label="Level" isRequired fieldId="tier-level">
        <TextInput
          isRequired
          type="number"
          id="tier-level"
          name="tier-level"
          value={formData.level}
          onChange={(_event, value) => {
            const numValue = Number(value);
            if (!isNaN(numValue) && numValue >= 1) {
              handleInputChange('level', numValue);
            }
          }}
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem>
              Higher numbers indicate higher priority. Users with access to multiple tiers will automatically use the highest level tieravailable to them.
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>

      <FormGroup label="Groups" isRequired fieldId="tier-groups">
        <Select
          role="menu"
          id="tier-groups"
          isOpen={isGroupsOpen}
          selected={formData.groups}
          onSelect={handleGroupSelect}
          onOpenChange={(nextOpen: boolean) => setIsGroupsOpen(nextOpen)}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setIsGroupsOpen(!isGroupsOpen)}
              isExpanded={isGroupsOpen}
              id="tier-groups-toggle"
            >
              Select groups
              {formData.groups.length > 0 && <Badge isRead>{formData.groups.length}</Badge>}
            </MenuToggle>
          )}
        >
          <SelectList>
            {mockGroups.map((group) => (
              <SelectOption
                key={group.id}
                value={group.id}
                hasCheckbox
                isSelected={formData.groups.includes(group.id)}
              >
                {group.name}
              </SelectOption>
            ))}
          </SelectList>
        </Select>
        <FormHelperText>
          <HelperText>
            <HelperTextItem>This tier will apply to all users in these groups</HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>

      <FormGroup label="Models" isRequired fieldId="tier-models">
        <Select
          role="menu"
          id="tier-models"
          isOpen={isModelsOpen}
          selected={formData.models}
          onSelect={handleModelSelect}
          onOpenChange={(nextOpen: boolean) => setIsModelsOpen(nextOpen)}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setIsModelsOpen(!isModelsOpen)}
              isExpanded={isModelsOpen}
              id="tier-models-toggle"
            >
              Select models
              {formData.models.length > 0 && <Badge isRead>{formData.models.length}</Badge>}
            </MenuToggle>
          )}
        >
          <SelectList>
            {mockMaaSModels.length === 0 ? (
              <SelectOption isDisabled>No AI Asset models available</SelectOption>
            ) : (
              mockMaaSModels.map((model) => (
                <SelectOption
                  key={model.id}
                  value={model.id}
                  hasCheckbox
                  isSelected={formData.models.includes(model.id)}
                >
                  {model.name}
                </SelectOption>
              ))
            )}
          </SelectList>
        </Select>
        <FormHelperText>
          <HelperText>
            <HelperTextItem>
              Only models published as AI Assets can be assigned to tiers
              {mockMaaSModels.length === 0 && (
                <span style={{ color: 'var(--pf-t--global--color--status--warning--default)' }}>
                  <br />
                  No AI Asset models available. Publish a model deployment as an AI Asset first.
                </span>
              )}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>

      <Checkbox
        id="enable-token-limit"
        label="Enforce token rate limit"
        isChecked={tokenLimitEnabled}
        onChange={(_event, checked) => handleTokenLimitToggle(checked)}
      />
      {tokenLimitEnabled && (
        <div style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
          {(formData.limits.tokenLimits || []).map((limit, index) => (
            <div key={limit.id} style={{ marginBottom: '1rem' }}>
              <Flex alignItems={{ default: 'alignItemsCenter' }}>
                <FlexItem>
                  <TextInput
                    type="number"
                    value={limit.amount}
                    min={1}
                    onChange={(event, value) => {
                      const numValue = Number(value);
                      if (!isNaN(numValue) && numValue >= 1) {
                        handleLimitChange('tokenLimits', index, 'amount', numValue);
                      }
                    }}
                    id={`token-limit-amount-${index}`}
                    aria-label="Token limit amount"
                    style={{ width: '150px' }}
                  />
                </FlexItem>
                <FlexItem style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                  <span>tokens per</span>
                </FlexItem>
                <FlexItem>
                  <TextInput
                    type="number"
                    value={limit.quantity}
                    min={1}
                    onChange={(event, value) => {
                      const numValue = Number(value);
                      if (!isNaN(numValue) && numValue >= 1) {
                        handleLimitChange('tokenLimits', index, 'quantity', numValue);
                      }
                    }}
                    id={`token-limit-quantity-${index}`}
                    aria-label="Token limit time quantity"
                    style={{ width: '100px' }}
                  />
                </FlexItem>
                <FlexItem style={{ paddingLeft: '8px' }}>
                  <Select
                    id={`token-limit-unit-${index}`}
                    isOpen={isPeriodSelectOpen[`token-${index}`] || false}
                    selected={limit.unit}
                    onSelect={(_event, selection) => {
                      handleLimitChange('tokenLimits', index, 'unit', selection as string);
                      setIsPeriodSelectOpen({ ...isPeriodSelectOpen, [`token-${index}`]: false });
                    }}
                    onOpenChange={(isOpen) => setIsPeriodSelectOpen({ ...isPeriodSelectOpen, [`token-${index}`]: isOpen })}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsPeriodSelectOpen({ ...isPeriodSelectOpen, [`token-${index}`]: !isPeriodSelectOpen[`token-${index}`] })}
                        isExpanded={isPeriodSelectOpen[`token-${index}`] || false}
                        id={`token-unit-toggle-${index}`}
                        style={{ minWidth: '120px' }}
                      >
                        {limit.unit}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="minute">minute</SelectOption>
                      <SelectOption value="hour">hour</SelectOption>
                      <SelectOption value="day">day</SelectOption>
                    </SelectList>
                  </Select>
                </FlexItem>
                <FlexItem>
                  <Button
                    variant="plain"
                    aria-label="Remove token limit"
                    onClick={() => removeLimit('tokenLimits', index)}
                    icon={<MinusCircleIcon />}
                    id={`remove-token-limit-${index}`}
                  />
                </FlexItem>
              </Flex>
            </div>
          ))}
          <Button
            variant="link"
            icon={<PlusCircleIcon />}
            onClick={() => addLimit('tokenLimits')}
            id="add-token-limit"
            style={{ paddingLeft: 0 }}
          >
            Add token rate limit
          </Button>
          <FormHelperText>
            <HelperText>
              <HelperTextItem>Tokens beyond these limits will be blocked.</HelperTextItem>
            </HelperText>
          </FormHelperText>
        </div>
      )}

      <Checkbox
        id="enable-rate-limit"
        label="Enforce request rate limit"
        isChecked={rateLimitEnabled}
        onChange={(_event, checked) => handleRateLimitToggle(checked)}
      />
      {rateLimitEnabled && (
        <div style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
          {(formData.limits.rateLimits || []).map((limit, index) => (
            <div key={limit.id} style={{ marginBottom: '1rem' }}>
              <Flex alignItems={{ default: 'alignItemsCenter' }}>
                <FlexItem>
                  <TextInput
                    type="number"
                    value={limit.amount}
                    min={1}
                    onChange={(event, value) => {
                      const numValue = Number(value);
                      if (!isNaN(numValue) && numValue >= 1) {
                        handleLimitChange('rateLimits', index, 'amount', numValue);
                      }
                    }}
                    id={`rate-limit-amount-${index}`}
                    aria-label="Rate limit amount"
                    style={{ width: '150px' }}
                  />
                </FlexItem>
                <FlexItem style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                  <span>requests per</span>
                </FlexItem>
                <FlexItem>
                  <TextInput
                    type="number"
                    value={limit.quantity}
                    min={1}
                    onChange={(event, value) => {
                      const numValue = Number(value);
                      if (!isNaN(numValue) && numValue >= 1) {
                        handleLimitChange('rateLimits', index, 'quantity', numValue);
                      }
                    }}
                    id={`rate-limit-quantity-${index}`}
                    aria-label="Rate limit time quantity"
                    style={{ width: '100px' }}
                  />
                </FlexItem>
                <FlexItem style={{ paddingLeft: '8px' }}>
                  <Select
                    id={`rate-limit-unit-${index}`}
                    isOpen={isPeriodSelectOpen[`rate-${index}`] || false}
                    selected={limit.unit}
                    onSelect={(_event, selection) => {
                      handleLimitChange('rateLimits', index, 'unit', selection as string);
                      setIsPeriodSelectOpen({ ...isPeriodSelectOpen, [`rate-${index}`]: false });
                    }}
                    onOpenChange={(isOpen) => setIsPeriodSelectOpen({ ...isPeriodSelectOpen, [`rate-${index}`]: isOpen })}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsPeriodSelectOpen({ ...isPeriodSelectOpen, [`rate-${index}`]: !isPeriodSelectOpen[`rate-${index}`] })}
                        isExpanded={isPeriodSelectOpen[`rate-${index}`] || false}
                        id={`rate-unit-toggle-${index}`}
                        style={{ minWidth: '120px' }}
                      >
                        {limit.unit}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="minute">minute</SelectOption>
                      <SelectOption value="hour">hour</SelectOption>
                      <SelectOption value="day">day</SelectOption>
                    </SelectList>
                  </Select>
                </FlexItem>
                <FlexItem>
                  <Button
                    variant="plain"
                    aria-label="Remove rate limit"
                    onClick={() => removeLimit('rateLimits', index)}
                    icon={<MinusCircleIcon />}
                    id={`remove-rate-limit-${index}`}
                  />
                </FlexItem>
              </Flex>
            </div>
          ))}
          <Button
            variant="link"
            icon={<PlusCircleIcon />}
            onClick={() => addLimit('rateLimits')}
            id="add-rate-limit"
            style={{ paddingLeft: 0 }}
          >
            Add request rate limit
          </Button>
          <FormHelperText>
            <HelperText>
              <HelperTextItem>Requests beyond these limits will be blocked.</HelperTextItem>
            </HelperText>
          </FormHelperText>
        </div>
      )}

      <ActionGroup>
        <Button variant="primary" onClick={onSubmit} isDisabled={!isFormValid()} id="create-tier-submit">
          {isEditMode ? 'Save' : 'Create tier'}
        </Button>
        <Button variant="link" onClick={onCancel} id="create-tier-cancel">
          Cancel
        </Button>
      </ActionGroup>
    </Form>
  );
};

export { TierForm };

