import React, { useState } from 'react';
import { FormGroup, TextArea, Button } from '@patternfly/react-core';
import PropTypes from 'prop-types';

export const OutputTemplateTextField = ({
  runtimeTemplates,
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
  runtimeTemplates: PropTypes.array.isRequired,
  setRuntimeTemplates: PropTypes.func.isRequired,
};
