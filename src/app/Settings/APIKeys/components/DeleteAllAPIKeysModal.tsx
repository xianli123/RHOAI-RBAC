import * as React from 'react';
import {
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Alert,
  Form,
  FormGroup,
  TextInput,
} from '@patternfly/react-core';

interface DeleteAllAPIKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  keyCount: number;
}

const DeleteAllAPIKeysModal: React.FunctionComponent<DeleteAllAPIKeysModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  keyCount,
}) => {
  const [deleteConfirmation, setDeleteConfirmation] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  const isDeleteEnabled = deleteConfirmation === 'delete';

  React.useEffect(() => {
    if (!isOpen) {
      setDeleteConfirmation('');
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleDeleteConfirm = () => {
    if (!isDeleteEnabled) return;

    setIsDeleting(true);
    
    // Simulate deletion delay
    setTimeout(() => {
      onDelete();
      setIsDeleting(false);
      onClose();
    }, 1000);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && isDeleteEnabled) {
      handleDeleteConfirm();
    }
  };

  return (
    <Modal
      id="delete-all-api-keys-modal"
      variant={ModalVariant.small}
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="delete-all-api-keys-modal-title"
      aria-describedby="delete-all-api-keys-modal-description"
    >
      <ModalHeader
        title="Delete all API keys?"
        labelId="delete-all-api-keys-modal-title"
      />
      <ModalBody id="delete-all-api-keys-modal-description">
        <Alert
          id="delete-all-api-keys-alert"
          variant="danger"
          title="This action cannot be undone"
          isInline
          style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}
        >
          Deleting all API keys will immediately revoke endpoint access to any applications currently using them.
          This will delete {keyCount} {keyCount === 1 ? 'key' : 'keys'}.
        </Alert>
        
        <p style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
          To confirm deletion, type <strong>delete</strong> below:
        </p>
        
        <Form>
          <FormGroup 
            label="Confirmation" 
            isRequired 
            fieldId="delete-all-confirmation-input"
          >
            <TextInput
              id="delete-all-confirmation-input"
              value={deleteConfirmation}
              onChange={(_event, value) => setDeleteConfirmation(value)}
              onKeyDown={handleKeyDown}
              placeholder="Type 'delete' to confirm"
              isDisabled={isDeleting}
              aria-label="Type 'delete' to confirm deletion of all API keys"
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          id="confirm-delete-all-button"
          variant="danger"
          onClick={handleDeleteConfirm}
          isDisabled={!isDeleteEnabled}
          isLoading={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete keys'}
        </Button>
        <Button
          id="cancel-delete-all-button"
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

export { DeleteAllAPIKeysModal };

