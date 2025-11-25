import * as React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalVariant,
  Button,
  Form,
  FormGroup,
  TextInput,
  Alert,
} from '@patternfly/react-core';
import { Tier } from '../types';

interface DeleteTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: Tier | null;
  onDelete: (tier: Tier) => void;
}

const DeleteTierModal: React.FunctionComponent<DeleteTierModalProps> = ({
  isOpen,
  onClose,
  tier,
  onDelete,
}) => {
  const [deleteConfirmation, setDeleteConfirmation] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  const isDeleteEnabled = tier && deleteConfirmation === tier.name;

  React.useEffect(() => {
    if (!isOpen) {
      setDeleteConfirmation('');
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleDeleteConfirm = () => {
    if (!tier || !isDeleteEnabled) return;

    setIsDeleting(true);
    
    // Simulate deletion delay
    setTimeout(() => {
      onDelete(tier);
      setIsDeleting(false);
      onClose();
    }, 1000);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && isDeleteEnabled) {
      handleDeleteConfirm();
    }
  };

  if (!tier) return null;

  return (
    <Modal
      id="delete-tier-modal"
      variant={ModalVariant.small}
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="delete-tier-modal-title"
      aria-describedby="delete-tier-modal-description"
    >
      <ModalHeader
        title="Delete tier?"
        labelId="delete-tier-modal-title"
      />
      <ModalBody id="delete-tier-modal-description">
        <Alert
          id="delete-tier-alert"
          variant="danger"
          title="This action cannot be undone"
          isInline
          style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}
        >
          Deleting this tier could affect any apps that are using API keys associated with this tier.
        </Alert>
        
        <p style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
          To confirm deletion, type the tier name below:
        </p>
        
        <p 
          id="tier-name-display"
          style={{ 
            fontFamily: 'var(--pf-t--global--font--family--mono)',
            padding: 'var(--pf-t--global--spacer--sm)', 
            backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', 
            borderRadius: 'var(--pf-t--global--border--radius--small)',
            marginBottom: 'var(--pf-t--global--spacer--md)'
          }}
        >
          {tier.name}
        </p>
        
        <Form>
          <FormGroup 
            label="Tier name" 
            isRequired 
            fieldId="delete-confirmation-input"
          >
            <TextInput
              id="delete-confirmation-input"
              value={deleteConfirmation}
              onChange={(_event, value) => setDeleteConfirmation(value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter tier name to confirm"
              isDisabled={isDeleting}
              aria-label="Type tier name to confirm deletion"
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          id="confirm-delete-tier-button"
          variant="danger"
          onClick={handleDeleteConfirm}
          isDisabled={!isDeleteEnabled}
          isLoading={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
        <Button
          id="cancel-delete-tier-button"
          variant="link"
          onClick={onClose}
          isDisabled={isDeleting}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { DeleteTierModal };

