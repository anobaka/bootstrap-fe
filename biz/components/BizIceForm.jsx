import { useState } from "react";
import { Dialog, Button } from "@alifd/next";

import IceForm from "../../components/IceForm/IceForm";

function submit(value, resolve, reject, api, requestModel, onSuccess, onFail) {
  console.log(value);
  api(requestModel(value)).invoke(t => {
    if (t.code) {
      reject();
      onFail && onFail();
    } else {
      resolve();
      onSuccess && onSuccess();
    }
  });
}

export default function BizIceForm(props) {
  const { onSuccess, onFail, api, requestModel, ...otherProps } = props;

  let submitRef;

  return (
    <div className="biz-ice-form">
      <IceForm
        submit={(value, resolve, reject) =>
          submit(value, resolve, reject, api, requestModel, onSuccess, onFail)
        }
        {...otherProps}
        submitRef={r => (submitRef = r)}
      />
      <div>
        <Button type="primary" onClick={submitRef}>
          提交
        </Button>
      </div>
    </div>
  );
}

BizIceForm.dialog = function(props) {
  const { onSuccess, onFail, api, requestModel, ...otherProps } = props;

  IceForm.dialog({
    submit: (value, resolve, reject) =>
      submit(value, resolve, reject, api, requestModel, onSuccess, onFail),
    ...otherProps
  });
};
