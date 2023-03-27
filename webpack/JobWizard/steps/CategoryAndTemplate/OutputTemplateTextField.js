import React, { useState } from 'react';
import { Button } from 'patternfly-react';
import { FormGroup, TextArea } from '@patternfly/react-core';
import PropTypes from 'prop-types';

export const OutputTemplateTextField = ({
  selectedRuntimeTemplates,
  setRuntimeTemplates,
}) => {
  const [template, setTemplate] = useState('');
  return (
    <FormGroup label="Runtime template" isRequired={false}>
      <TextArea required={false} value={template} onChange={setTemplate} />
      <Button
        variant="link"
        onClick={() => {
          setRuntimeTemplates(oldRuntimeTemplates => [
            ...oldRuntimeTemplates,
            template,
          ]);
          setTemplate('');
        }}
      >
        Submit
      </Button>
    </FormGroup>
  );
};

OutputTemplateTextField.propTypes = {
  selectedRuntimeTemplates: PropTypes.array.isRequired,
  setRuntimeTemplates: PropTypes.func.isRequired,
};
