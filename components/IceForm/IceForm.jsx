import React, { useState, useEffect } from "react";
import { Dialog, Grid, Balloon, Icon, Switch } from "@alifd/next";
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError
} from "@icedesign/form-binder";

import "./IceForm.scss";

const { Col, Row } = Grid;

export default function IceForm(props) {
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
      return `请输入正确的${name}`;
    }
  }

  function generateFormError(field) {
    return (
      field.FormError ||
      (generateMessage(field) && (
        <div>
          <IceFormError name={field.name} />
        </div>
      ))
    );
  }

  function generateLabelTrailingIcon(field) {
    if (field.required) {
      return <span className="required">*</span>;
    }
  }

  function generateRow(field) {
    // console.log("regenerate rows: ", formValue);
    // todo: showIf not working
    return (
      (!field.showIf || field.showIf(formValue)) && (
        <Row className="item">
          <Col>
            <Row className="label-value">
              <Col
                span={props.labelSpan == undefined ? 8 : props.labelSpan}
                className="label"
              >
                {getDisplayName(field)}
                {field.tip && (
                  <Balloon
                    align="t"
                    closable={false}
                    trigger={<Icon type="help" size="small" className="tip" />}
                  >
                    {field.tip}
                  </Balloon>
                )}
                {generateLabelTrailingIcon(field)}&emsp;
              </Col>
              <Col span={props.valueSpan == undefined ? 16 : props.valueSpan}>
                <IceFormBinder
                  name={field.name}
                  required={field.required || false}
                  message={generateMessage(field)}
                  {...(field.formBinderProps || {})}
                >
                  {field.formComponent}
                </IceFormBinder>
              </Col>
            </Row>
            <Row className="error">
              <Col offset="8">{generateFormError(field)}</Col>
            </Row>
          </Col>
        </Row>
      )
    );
  }

  function submit(resolve, reject) {
    form.validateAll((errors, values) => {
      console.log("errors", errors, "values", values);
      if (!errors) {
        props.submit(value, resolve, reject);
      } else {
        props.onError && props.onError(values, value);
        reject && reject();
      }
    });
  }

  props.submitRef(submit);

  function onChange() {
    // console.log(`onChange: `, formValue, setFormValue);
    setFormValue(formValue);
    props.onChange && props.onChange(formValue);
  }

  let form;

  // console.log("render");

  return (
    <div className="ice-form">
      <IceFormBinderWrapper
        value={formValue}
        ref={f => (form = f)}
        onChange={onChange}
      >
        {(fields || []).map(f => generateRow(f)).filter(t => t)}
      </IceFormBinderWrapper>
    </div>
  );
}

IceForm.dialog = function(props) {
  const {
    iceDialogMethod,
    shouldUpdatePosition,
    closeable,
    ...otherProps
  } = props;

  let sw;

  Dialog[iceDialogMethod || "show"]({
    content: <IceForm {...otherProps} submitRef={s => (sw = s)} />,
    onOk: () =>
      new Promise((resolve, reject) => {
        sw(resolve, reject);
      }),
    shouldUpdatePosition:
      shouldUpdatePosition == undefined ? true : shouldUpdatePosition,
    closeable: closeable == undefined ? true : closeable,
    ...otherProps
  });
};
