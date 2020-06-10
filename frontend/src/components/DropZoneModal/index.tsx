import React, { useState, useCallback } from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { DropzoneDialog } from 'material-ui-dropzone';

interface IProps {
  onSave: (args: any) => void;
  buttonOptions?: ButtonProps;
}

const DropZoneModalButton: React.FC<IProps> = ({
  onSave,
  buttonOptions,
  ...rest
}: IProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleModal = useCallback((): void => {
    setOpen(!open);
  }, [open]);

  return (
    <div>
      <Button {...buttonOptions} onClick={handleModal}>
        Anexar arquivo
      </Button>
      <DropzoneDialog
        {...rest}
        fileObjects={[]}
        open={open}
        onSave={(uploadedFiles: any) => {
          handleModal();
          onSave(uploadedFiles);
        }}
        acceptedFiles={[
          // 'application/pdf',
          'image/jpg',
          'image/jpeg',
          'image/png',
        ]}
        showPreviews
        maxFileSize={5000000}
        filesLimit={1}
        onClose={handleModal}
      />
    </div>
  );
};
export default DropZoneModalButton;
