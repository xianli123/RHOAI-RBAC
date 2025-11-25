import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalVariant,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Button,
  DatePicker,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Alert,
  Card,
  CardBody,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Badge,
  ClipboardCopy,
  ClipboardCopyVariant,
  Content,
  ContentVariants,
  EmptyState,
  EmptyStateBody,
  Title,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@patternfly/react-icons';
import { getCurrentUserHighestTier } from '@app/utils/tierUtils';

interface CreateAPIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateAPIKeyModal: React.FunctionComponent<CreateAPIKeyModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showKeyDisplay, setShowKeyDisplay] = React.useState(false);
  const [generatedKey, setGeneratedKey] = React.useState('');
  const [keyId, setKeyId] = React.useState('');
  
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    expirationDate: '',
  });

  // Get user's highest tier
  const userTier = getCurrentUserHighestTier();

  // Initialize expiration date from tier
  React.useEffect(() => {
    if (userTier?.limits.apiKeyExpirationDays && !formData.expirationDate) {
      const days = userTier.limits.apiKeyExpirationDays;
      if (days > 0) {
        const expDate = new Date();
        expDate.setDate(expDate.getDate() + days);
        setFormData(prev => ({
          ...prev,
          expirationDate: expDate.toISOString().split('T')[0],
        }));
      }
    }
  }, [userTier]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateAPIKey = (): string => {
    const prefix = 'sk-';
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix;
    for (let i = 0; i < 48; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const downloadKey = (key: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([key], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate new API key
    const newKey = generateAPIKey();
    const newKeyId = `key-${Date.now()}`;
    
    setGeneratedKey(newKey);
    setKeyId(newKeyId);
    setShowKeyDisplay(true);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      name: '',
      description: '',
      expirationDate: '',
    });
    setShowKeyDisplay(false);
    setGeneratedKey('');
    setKeyId('');
    onClose();
  };

  const handleViewDetails = () => {
    navigate(`/gen-ai-studio/api-keys/${keyId}`);
    handleClose();
  };

  const isFormValid = () => {
    return formData.name.trim() !== '';
  };

  // If key has been generated, show one-time display
  if (showKeyDisplay) {
    return (
      <Modal
        variant={ModalVariant.medium}
        title="API key created"
        isOpen={isOpen}
        onClose={handleClose}
        id="api-key-created-modal"
      >
        <ModalHeader title="API key created" />
        <ModalBody>
          <Alert
            variant="warning"
            isInline
            title="Save your API key"
            style={{ marginBottom: '1rem' }}
          >
            <ExclamationTriangleIcon style={{ marginRight: '0.5rem' }} />
            This is the only time you will see this key. Copy it now and store it securely.
          </Alert>

          <Card>
            <CardBody>
              <Content component={ContentVariants.h3} style={{ marginBottom: '0.5rem' }}>
                <CheckCircleIcon color="green" style={{ marginRight: '0.5rem' }} />
                Your API key
              </Content>
              <ClipboardCopy
                isReadOnly
                hoverTip="Copy"
                clickTip="Copied"
                variant={ClipboardCopyVariant.expansion}
                id="generated-api-key"
              >
                {generatedKey}
              </ClipboardCopy>
              <div style={{ marginTop: '1rem' }}>
                <Button
                  variant="secondary"
                  onClick={() => downloadKey(generatedKey, `${formData.name.replace(/\s+/g, '-').toLowerCase()}-api-key.txt`)}
                  id="download-key-button"
                  style={{ marginRight: '0.5rem' }}
                >
                  Download as .txt
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card style={{ marginTop: '1rem' }}>
            <CardBody>
              <DescriptionList isHorizontal columnModifier={{ default: '1Col' }}>
                <DescriptionListGroup>
                  <DescriptionListTerm>Name</DescriptionListTerm>
                  <DescriptionListDescription>{formData.name}</DescriptionListDescription>
                </DescriptionListGroup>
                {formData.description && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Description</DescriptionListTerm>
                    <DescriptionListDescription>{formData.description}</DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                {userTier && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Tier</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Badge isRead>Level {userTier.level}</Badge> {userTier.name}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                {formData.expirationDate && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Expiration</DescriptionListTerm>
                    <DescriptionListDescription>
                      {new Date(formData.expirationDate).toLocaleDateString()}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
              </DescriptionList>
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={handleViewDetails} id="view-key-details-button">
            View key details
          </Button>
          <Button variant="link" onClick={handleClose} id="key-created-close-button">
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  // Show create form
  return (
    <Modal
      variant={ModalVariant.medium}
      title="Create API key"
      isOpen={isOpen}
      onClose={handleClose}
      id="create-api-key-modal"
    >
      <ModalHeader title="Create API key" />
      <ModalBody>
        {userTier && (
          <Alert
            variant="info"
            isInline
            title="Your tier"
            style={{ marginBottom: '1rem' }}
            id="tier-info-alert"
          >
            <div style={{ marginBottom: '0.5rem' }}>
              You are assigned to: <strong>{userTier.name}</strong>{' '}
              <Badge isRead>Level {userTier.level}</Badge>
            </div>
            <div style={{ fontSize: '0.875rem' }}>
              <strong>Inherited limits:</strong>
              <ul style={{ marginTop: '0.25rem', marginBottom: '0.25rem' }}>
                {userTier.limits.tokenLimits && userTier.limits.tokenLimits.length > 0 && 
                  userTier.limits.tokenLimits.map((limit, idx) => (
                    <li key={`token-${idx}`}>Token limit: {limit.amount.toLocaleString()} tokens per {limit.quantity} {limit.unit}</li>
                  ))
                }
                {userTier.limits.rateLimits && userTier.limits.rateLimits.length > 0 &&
                  userTier.limits.rateLimits.map((limit, idx) => (
                    <li key={`rate-${idx}`}>Rate limit: {limit.amount.toLocaleString()} requests per {limit.quantity} {limit.unit}</li>
                  ))
                }
                <li>Accessible models: {userTier.models.length}</li>
              </ul>
            </div>
          </Alert>
        )}

        <Form id="create-api-key-form">
          <FormGroup label="Name" isRequired fieldId="api-key-name">
            <TextInput
              isRequired
              type="text"
              id="api-key-name"
              name="api-key-name"
              value={formData.name}
              onChange={(_event, value) => handleInputChange('name', value)}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>A descriptive name for this API key</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>

          <FormGroup label="Description" fieldId="api-key-description">
            <TextArea
              id="api-key-description"
              name="api-key-description"
              value={formData.description}
              onChange={(_event, value) => handleInputChange('description', value)}
              rows={3}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>Optional description of how this key will be used</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>

          <FormGroup label="Expiration date" fieldId="api-key-expiration">
            <DatePicker
              id="api-key-expiration"
              value={formData.expirationDate}
              onChange={(_event, value) => handleInputChange('expirationDate', value)}
              placeholder="YYYY-MM-DD"
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>
                  {userTier?.limits.apiKeyExpirationDays
                    ? `Default: ${userTier.limits.apiKeyExpirationDays} days from today ${userTier.limits.apiKeyExpirationDays === 0 ? '(Never expires)' : ''}`
                    : 'Optional expiration date for this API key'}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="primary"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          isDisabled={!isFormValid() || isSubmitting}
          id="create-key-submit-button"
        >
          Create API key
        </Button>
        <Button variant="link" onClick={handleClose} id="create-key-cancel-button">
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { CreateAPIKeyModal };
