import { useState } from "react";
import { Dialog } from "@alifd/next";
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError
} from "@icedesign/form-binder";

const styles = {
  required: {
    color: "red"
  }
};

export function IceForm(props) {
  const { value, fields } = props;

  const [formValue, setFormValue] = useState(value);

  function getDisplayName(field) {
    return field.displayName || field.name;
  }

  function generateMessage(field) {
    if (field.message) {
      return field.message;
    }
    if (field.required) {
      const name = getDisplayName(field);
      return `${name}是必填项`;
    }
  }

  function generateFormError(field) {
    return (
      field.FormError ||
      (generateMessage(field) && (
        <div>
          <IceFormError name={field.name} />{" "}
        </div>
      ))
    );
  }

  function generateLabelTrailingIcon(field) {
    if (field.required) {
      return <span className={styles.required}>*</span>;
    }
  }

  function generateRow(field) {
    return (
      <Row>
        <Col span="8">
          {getDisplayName(field)}
          {generateLabelTrailingIcon(field)}:&nbsp;
        </Col>
        <Col span="16">
          <IceFormBinder
            name={field.name}
            required={field.required || false}
            message={generateMessage(field)}
            {...(field.formBinderProps || {})}
          >
            {field.FormComponent}
          </IceFormBinder>
          {generateFormError(field)}
        </Col>
      </Row>
    );
  }

  function submit(resolve, reject) {
    this.form.validateAll((errors, values) => {
      console.log("errors", errors, "values", values);
      if (!errors) {
        props.submit(value, resolve, reject);
      } else {
        props.onError && props.onError(values, value);
        reject && reject();
      }
    });
  }

  props.submitWrapper(submit);

  return (
    <div>
      <FormBinderWrapper value={formValue} ref={f => (this.form = f)}>
        {(fields || []).map(f => generateRow(f))}
      </FormBinderWrapper>
    </div>
  );
}

IceForm.dialog = function(props) {
  const { title, submit, ...otherProps } = props;

  let sw;

  Dialog.show({
    title,
    content: (
      <IceForm {...otherProps} submit={submit} submitWrapper={s => (sw = s)} />
    ),
    onOk: () =>
      new Promise((resolve, reject) => {
        sw(resolve, reject);
      }),
    onClose: () => {}
  });
};
