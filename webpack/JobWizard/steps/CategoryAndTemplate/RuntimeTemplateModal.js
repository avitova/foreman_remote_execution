import React, { useState } from 'react';
import { Modal, Icon, Button } from 'patternfly-react';
import PropTypes from 'prop-types';
import Editor from 'foremanReact/components/Editor';

const OutputTemplateModal = ({
  showEditor,
  setShowEditor,
  selectedRuntimeTemplates,
  setRuntimeTemplates,
}) => {
  const [template, setTemplate] = useState('');
  const data = {
    template,
    locked: false,
    type: 'templates',
    templateClass: 'OutputTemplate',
    showImport: true,
    showPreview: false,
    showHostSelector: false,
    isSafemodeEnabled: true,
  };

  return (
    <Modal
      show={showEditor}
      onHide={() => {
        setShowEditor(!showEditor);
      }}
      className="output-template-modal"
    >
      <Modal.Header>
        <h4 id="output-template-modal">Runtime template</h4>
        <Button
          className="close"
          onClick={() => {
            setShowEditor(!showEditor);
          }}
          aria-hidden="true"
          aria-label="Close"
          bsStyle="link"
        >
          <Icon type="pf" name="close" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Editor
          data={data}
          value={template}
          changeEditorValue={setTemplate}
          isRendering={false}
        />
        <Button
          variant="link"
          onClick={() => {
            setRuntimeTemplates(oldRuntimeTemplates => [
              ...oldRuntimeTemplates,
              template,
              //TODO: force setTemplate to invoke
            ]);
            setShowEditor(!showEditor);
          }}
        >
          Submit
        </Button>
      </Modal.Body>
    </Modal>
  );
};

OutputTemplateModal.propTypes = {
  showEditor: PropTypes.bool.isRequired,
  setShowEditor: PropTypes.func.isRequired,
  selectedRuntimeTemplates: PropTypes.array.isRequired,
  setRuntimeTemplates: PropTypes.func.isRequired,
};

export default OutputTemplateModal;
