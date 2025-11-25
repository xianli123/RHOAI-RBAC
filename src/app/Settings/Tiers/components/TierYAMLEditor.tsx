import * as React from 'react';
import {
  Button,
  ActionGroup,
  Alert,
} from '@patternfly/react-core';
import { CodeEditor, Language } from '@patternfly/react-code-editor';
import { CreateTierForm } from '../types';

interface TierYAMLEditorProps {
  formData: CreateTierForm;
  onChange: (data: CreateTierForm) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const TierYAMLEditor: React.FunctionComponent<TierYAMLEditorProps> = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const [yamlContent, setYamlContent] = React.useState('');
  const [parseError, setParseError] = React.useState<string | null>(null);

  // Convert form data to YAML
  const formDataToYAML = (data: CreateTierForm): string => {
    const hasLimits = (data.limits.tokenLimits && data.limits.tokenLimits.length > 0) || 
                      (data.limits.rateLimits && data.limits.rateLimits.length > 0) ||
                      data.limits.apiKeyExpirationDays !== undefined;
    
    let limitsYaml = '';
    if (data.limits.tokenLimits && data.limits.tokenLimits.length > 0) {
      limitsYaml += `\n    tokenLimits:`;
      data.limits.tokenLimits.forEach(limit => {
        limitsYaml += `\n      - amount: ${limit.amount}\n        quantity: ${limit.quantity}\n        unit: ${limit.unit}`;
      });
    }
    if (data.limits.rateLimits && data.limits.rateLimits.length > 0) {
      limitsYaml += `\n    rateLimits:`;
      data.limits.rateLimits.forEach(limit => {
        limitsYaml += `\n      - amount: ${limit.amount}\n        quantity: ${limit.quantity}\n        unit: ${limit.unit}`;
      });
    }
    if (data.limits.apiKeyExpirationDays !== undefined) {
      limitsYaml += `\n    apiKeyExpirationDays: ${data.limits.apiKeyExpirationDays}`;
    }

    const yaml = `apiVersion: maas.openshift.io/v1alpha1
kind: Tier
metadata:
  name: ${data.name || 'new-tier'}
spec:
  level: ${data.level}
  ${data.description ? `description: "${data.description}"` : '# description: ""'}
  groups:${data.groups.length > 0 ? data.groups.map(g => `\n    - ${g}`).join('') : '\n    []'}
  models:${data.models.length > 0 ? data.models.map(m => `\n    - ${m}`).join('') : '\n    []'}
  limits:${hasLimits ? limitsYaml : ' {}'}
`;
    return yaml;
  };

  // Parse YAML to form data (simplified version)
  const yamlToFormData = (yaml: string): CreateTierForm | null => {
    try {
      // This is a simplified parser - in production, use a proper YAML library
      const lines = yaml.split('\n');
      const data: CreateTierForm = {
        name: '',
        description: '',
        level: 100,
        groups: [],
        models: [],
        limits: {},
      };

      let currentSection: string | null = null;
      let currentLimitArray: 'tokenLimits' | 'rateLimits' | null = null;
      let currentLimitObj: { amount?: number; quantity?: number; unit?: 'minute' | 'hour' | 'day' } = {};

      for (const line of lines) {
        const trimmed = line.trim();
        
        if (trimmed.startsWith('name:')) {
          data.name = trimmed.split('name:')[1].trim();
        } else if (trimmed.startsWith('description:')) {
          data.description = trimmed.split('description:')[1].trim().replace(/"/g, '');
        } else if (trimmed.startsWith('level:')) {
          data.level = parseInt(trimmed.split('level:')[1].trim(), 10);
        } else if (trimmed === 'groups:') {
          currentSection = 'groups';
          currentLimitArray = null;
        } else if (trimmed === 'models:') {
          currentSection = 'models';
          currentLimitArray = null;
        } else if (trimmed === 'limits:') {
          currentSection = 'limits';
        } else if (trimmed === 'tokenLimits:') {
          currentLimitArray = 'tokenLimits';
          data.limits.tokenLimits = [];
        } else if (trimmed === 'rateLimits:') {
          currentLimitArray = 'rateLimits';
          data.limits.rateLimits = [];
        } else if (trimmed.startsWith('- amount:') && currentLimitArray) {
          // Save previous object if it exists
          if (currentLimitObj.amount !== undefined) {
            const limitArray = data.limits[currentLimitArray];
            if (limitArray) {
              limitArray.push({
                id: `${currentLimitArray}-${Date.now()}-${limitArray.length}`,
                amount: currentLimitObj.amount,
                quantity: currentLimitObj.quantity || 1,
                unit: currentLimitObj.unit || 'hour',
              });
            }
          }
          // Start new object
          currentLimitObj = { amount: parseInt(trimmed.split('- amount:')[1].trim(), 10) };
        } else if (trimmed.startsWith('amount:') && currentLimitArray && !trimmed.startsWith('- amount:')) {
          currentLimitObj.amount = parseInt(trimmed.split('amount:')[1].trim(), 10);
        } else if (trimmed.startsWith('quantity:') && currentLimitArray) {
          currentLimitObj.quantity = parseInt(trimmed.split('quantity:')[1].trim(), 10);
        } else if (trimmed.startsWith('unit:') && currentLimitArray) {
          currentLimitObj.unit = trimmed.split('unit:')[1].trim() as 'minute' | 'hour' | 'day';
        } else if (trimmed.startsWith('- ') && currentSection === 'groups') {
          data.groups.push(trimmed.substring(2));
        } else if (trimmed.startsWith('- ') && currentSection === 'models') {
          data.models.push(trimmed.substring(2));
        } else if (trimmed.startsWith('apiKeyExpirationDays:')) {
          // Save any pending limit object
          if (currentLimitArray && currentLimitObj.amount !== undefined) {
            const limitArray = data.limits[currentLimitArray];
            if (limitArray) {
              limitArray.push({
                id: `${currentLimitArray}-${Date.now()}-${limitArray.length}`,
                amount: currentLimitObj.amount,
                quantity: currentLimitObj.quantity || 1,
                unit: currentLimitObj.unit || 'hour',
              });
            }
            currentLimitObj = {};
          }
          data.limits.apiKeyExpirationDays = parseInt(trimmed.split('apiKeyExpirationDays:')[1].trim(), 10);
        }
      }

      // Save any remaining limit object
      if (currentLimitArray && currentLimitObj.amount !== undefined) {
        const limitArray = data.limits[currentLimitArray];
        if (limitArray) {
          limitArray.push({
            id: `${currentLimitArray}-${Date.now()}-${limitArray.length}`,
            amount: currentLimitObj.amount,
            quantity: currentLimitObj.quantity || 1,
            unit: currentLimitObj.unit || 'hour',
          });
        }
      }

      return data;
    } catch (error) {
      return null;
    }
  };

  // Initialize YAML content from form data
  React.useEffect(() => {
    setYamlContent(formDataToYAML(formData));
  }, []);

  const handleYAMLChange = (value: string) => {
    setYamlContent(value);
    setParseError(null);

    // Try to parse and update form data
    const parsed = yamlToFormData(value);
    if (parsed) {
      onChange(parsed);
    } else {
      setParseError('Invalid YAML format. Please check your syntax.');
    }
  };

  const handleSubmit = () => {
    // Validate YAML before submitting
    const parsed = yamlToFormData(yamlContent);
    if (parsed) {
      onChange(parsed);
      onSubmit();
    } else {
      setParseError('Cannot create tier: Invalid YAML format.');
    }
  };

  const isFormValid = () => {
    const parsed = yamlToFormData(yamlContent);
    return (
      parsed &&
      parsed.name.trim() !== '' &&
      parsed.level > 0 &&
      parsed.groups.length > 0 &&
      parsed.models.length > 0
    );
  };

  return (
    <div>
      {parseError && (
        <Alert
          variant="danger"
          isInline
          title="YAML parsing error"
          style={{ marginBottom: '1rem' }}
        >
          {parseError}
        </Alert>
      )}
      
      <CodeEditor
        isDarkTheme={false}
        isLineNumbersVisible
        isReadOnly={false}
        isMinimapVisible={false}
        isLanguageLabelVisible
        code={yamlContent}
        onChange={handleYAMLChange}
        language={Language.yaml}
        height="500px"
        id="tier-yaml-editor"
      />

      <ActionGroup style={{ marginTop: '1rem' }}>
        <Button
          variant="primary"
          onClick={handleSubmit}
          isDisabled={!isFormValid()}
          id="create-tier-yaml-submit"
        >
          Create tier
        </Button>
        <Button variant="link" onClick={onCancel} id="create-tier-yaml-cancel">
          Cancel
        </Button>
      </ActionGroup>
    </div>
  );
};

export { TierYAMLEditor };

