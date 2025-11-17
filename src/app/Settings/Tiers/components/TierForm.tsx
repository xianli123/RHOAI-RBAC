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
import { CreateTierForm } from '../types';
import { mockGroups, mockMaaSModels } from '../mockData';

interface TierFormProps {
  formData: CreateTierForm;
  onChange: (data: CreateTierForm) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const TierForm: React.FunctionComponent<TierFormProps> = ({ formData, onChange, onSubmit, onCancel }) => {
  const [isGroupsOpen, setIsGroupsOpen] = React.useState(false);
  const [isModelsOpen, setIsModelsOpen] = React.useState(false);
  const [isPeriodSelectOpen, setIsPeriodSelectOpen] = React.useState<{ [key: string]: boolean }>({});

  const [tokenLimitEnabled, setTokenLimitEnabled] = React.useState(!!formData.limits.tokenLimit);
  const [rateLimitEnabled, setRateLimitEnabled] = React.useState(!!formData.limits.rateLimit);
  
  // Default expiration time state (always shown, not optional)
  const [expirationValue, setExpirationValue] = React.useState(() => {
    const days = formData.limits.apiKeyExpirationDays;
    if (days !== undefined && days > 0) {
      // If less than 1 day, show in hours
      if (days < 1) {
        return Math.round(days * 24).toString();
      }
      // Otherwise show in days
      return days.toString();
    }
    return '4';
  });
  const [expirationUnit, setExpirationUnit] = React.useState<'hours' | 'days'>(() => {
    const days = formData.limits.apiKeyExpirationDays;
    if (days !== undefined && days > 0) {
      // If less than 1 day, display as hours
      return days < 1 ? 'hours' : 'days';
    }
    return 'hours';
  });

  const handleInputChange = (field: keyof CreateTierForm, value: any) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  const handleLimitChange = (
    limitType: 'tokenLimit' | 'rateLimit',
    field: 'amount' | 'period',
    value: any
  ) => {
    onChange({
      ...formData,
      limits: {
        ...formData.limits,
        [limitType]: {
          ...(formData.limits[limitType] || { amount: 0, period: 'hour' }),
          [field]: value,
        },
      },
    });
  };

  const handleExpirationChange = (value: string, unit: 'hours' | 'days') => {
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 0) {
      // Convert to days for storage (support fractional days for hour-based values)
      const days = unit === 'hours' ? numValue / 24 : numValue;
      onChange({
        ...formData,
        limits: {
          ...formData.limits,
          apiKeyExpirationDays: days,
        },
      });
    }
  };

  const handleTokenLimitToggle = (checked: boolean) => {
    setTokenLimitEnabled(checked);
    if (!checked) {
      const { tokenLimit, ...otherLimits } = formData.limits;
      onChange({
        ...formData,
        limits: otherLimits,
      });
    } else {
      onChange({
        ...formData,
        limits: {
          ...formData.limits,
          tokenLimit: { amount: 10000, period: 'hour' },
        },
      });
    }
  };

  const handleRateLimitToggle = (checked: boolean) => {
    setRateLimitEnabled(checked);
    if (!checked) {
      const { rateLimit, ...otherLimits } = formData.limits;
      onChange({
        ...formData,
        limits: otherLimits,
      });
    } else {
      onChange({
        ...formData,
        limits: {
          ...formData.limits,
          rateLimit: { amount: 100, period: 'minute' },
        },
      });
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
              Higher numbers indicate higher priority. Users in multiple tiers will use the highest level available to them.
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

      <FormGroup label="Default expiration" fieldId="default-expiration-time">
        <Flex>
          <FlexItem>
            <TextInput
              type="number"
              id="default-expiration-time"
              name="default-expiration-time"
              value={expirationValue}
              onChange={(_event, value) => {
                setExpirationValue(value);
                handleExpirationChange(value, expirationUnit);
              }}
              style={{ width: '150px' }}
            />
          </FlexItem>
          <FlexItem>
            <Select
              id="expiration-unit"
              isOpen={isPeriodSelectOpen['expiration'] || false}
              selected={expirationUnit}
              onSelect={(_event, selection) => {
                const unit = selection as 'hours' | 'days';
                setExpirationUnit(unit);
                handleExpirationChange(expirationValue, unit);
                setIsPeriodSelectOpen({ ...isPeriodSelectOpen, expiration: false });
              }}
              onOpenChange={(isOpen) => setIsPeriodSelectOpen({ ...isPeriodSelectOpen, expiration: isOpen })}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsPeriodSelectOpen({ ...isPeriodSelectOpen, expiration: !isPeriodSelectOpen['expiration'] })}
                  isExpanded={isPeriodSelectOpen['expiration'] || false}
                  id="expiration-unit-toggle"
                >
                  {expirationUnit}
                </MenuToggle>
              )}
            >
              <SelectList>
                <SelectOption value="hours">hours</SelectOption>
                <SelectOption value="days">days</SelectOption>
              </SelectList>
            </Select>
          </FlexItem>
        </Flex>
        <FormHelperText>
          <HelperText>
            <HelperTextItem>API keys created by users in this tier will expire after this time period by default</HelperTextItem>
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
          <Flex alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <TextInput
                type="number"
                value={formData.limits.tokenLimit?.amount || 0}
                min={1}
                onChange={(event, value) => {
                  const numValue = Number(value);
                  if (!isNaN(numValue) && numValue >= 1) {
                    handleLimitChange('tokenLimit', 'amount', numValue);
                  }
                }}
                id="token-limit-amount"
                aria-label="Token limit amount"
                style={{ width: '150px' }}
              />
            </FlexItem>
            <FlexItem style={{ paddingLeft: '2px' }}>
              <span>tokens</span>
            </FlexItem>
            <FlexItem style={{ paddingLeft: '2px' }}>
              <Select
                id="token-limit-period"
                isOpen={isPeriodSelectOpen['token'] || false}
                selected={formData.limits.tokenLimit?.period || 'hour'}
                onSelect={(_event, selection) => {
                  handleLimitChange('tokenLimit', 'period', selection as string);
                  setIsPeriodSelectOpen({ ...isPeriodSelectOpen, token: false });
                }}
                onOpenChange={(isOpen) => setIsPeriodSelectOpen({ ...isPeriodSelectOpen, token: isOpen })}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsPeriodSelectOpen({ ...isPeriodSelectOpen, token: !isPeriodSelectOpen['token'] })}
                    isExpanded={isPeriodSelectOpen['token'] || false}
                    id="token-period-toggle"
                  >
                    per {formData.limits.tokenLimit?.period || 'hour'}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  <SelectOption value="minute">per minute</SelectOption>
                  <SelectOption value="hour">per hour</SelectOption>
                  <SelectOption value="day">per day</SelectOption>
                </SelectList>
              </Select>
            </FlexItem>
          </Flex>
          <FormHelperText>
            <HelperText>
              <HelperTextItem>Tokens beyond this limit will be blocked.</HelperTextItem>
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
          <Flex alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <TextInput
                type="number"
                value={formData.limits.rateLimit?.amount || 0}
                min={1}
                onChange={(event, value) => {
                  const numValue = Number(value);
                  if (!isNaN(numValue) && numValue >= 1) {
                    handleLimitChange('rateLimit', 'amount', numValue);
                  }
                }}
                id="rate-limit-amount"
                aria-label="Rate limit amount"
                style={{ width: '150px' }}
              />
            </FlexItem>
            <FlexItem style={{ paddingLeft: '2px' }}>
              <span>requests</span>
            </FlexItem>
            <FlexItem style={{ paddingLeft: '2px' }}>
              <Select
                id="rate-limit-period"
                isOpen={isPeriodSelectOpen['rate'] || false}
                selected={formData.limits.rateLimit?.period || 'minute'}
                onSelect={(_event, selection) => {
                  handleLimitChange('rateLimit', 'period', selection as string);
                  setIsPeriodSelectOpen({ ...isPeriodSelectOpen, rate: false });
                }}
                onOpenChange={(isOpen) => setIsPeriodSelectOpen({ ...isPeriodSelectOpen, rate: isOpen })}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsPeriodSelectOpen({ ...isPeriodSelectOpen, rate: !isPeriodSelectOpen['rate'] })}
                    isExpanded={isPeriodSelectOpen['rate'] || false}
                    id="rate-period-toggle"
                  >
                    per {formData.limits.rateLimit?.period || 'minute'}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  <SelectOption value="minute">per minute</SelectOption>
                  <SelectOption value="hour">per hour</SelectOption>
                  <SelectOption value="day">per day</SelectOption>
                </SelectList>
              </Select>
            </FlexItem>
          </Flex>
          <FormHelperText>
            <HelperText>
              <HelperTextItem>Requests beyond this limit will be blocked.</HelperTextItem>
            </HelperText>
          </FormHelperText>
        </div>
      )}

      <ActionGroup>
        <Button variant="primary" onClick={onSubmit} isDisabled={!isFormValid()} id="create-tier-submit">
          Create tier
        </Button>
        <Button variant="link" onClick={onCancel} id="create-tier-cancel">
          Cancel
        </Button>
      </ActionGroup>
    </Form>
  );
};

export { TierForm };

