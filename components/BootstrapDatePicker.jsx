import React from "react";
import moment from "moment";
import { DatePicker } from "@alifd/next";

function parse(obj) {
  if (typeof obj == "string") {
    let date = Date.parse(obj);
    if (date) {
      return new Date(date);
    } else {
      // 1y, 1M, 1d, 1h, 1m, 1s, -1y, ...
      const regMatch = /^(?<o>-?)(?<n>\d+)(?<f>[a-zA-Z])$/.exec(obj);
      if (regMatch) {
        const { groups } = regMatch;
        const n = parseInt(groups["n"]);
        const f = groups["f"];
        const now = new Date();
        const factor = (groups["o"] == "-" ? -1 : 1) * n;
        // console.log(`set${dateMethodKeys[f]}`, now[`get${dateMethodKeys[f]}`](), factor)
        now[`set${dateMethodKeys[f]}`](
          now[`get${dateMethodKeys[f]}`]() + factor
        );
        return now;
      } else {
        throw `Can not parse range parameter: ${obj && obj.toString()}`;
      }
    }
  }
  if (obj instanceof Date) {
    return date;
  }
}

const dateMethodKeys = {
  y: "FullYear",
  M: "Month",
  d: "Date",
  h: "Hours",
  m: "Minutes",
  s: "Seconds",
  f: "Milliseconds"
};

export default function BootstrapDatePicker(props) {
  const { range } = props;

  let disabledDate;

  if (range && range.length > 0) {
    const minDate = range[0] && parse(range[0]);
    const maxDate = range[1] && parse(range[1]);

    // console.log(minDate, maxDate);

    if (minDate || maxDate) {
      disabledDate = (moment, view) => {
        let valid = true;
        if (minDate) {
          valid = valid && moment >= minDate;
        }
        if (maxDate) {
          valid = valid && moment <= maxDate;
        }
        // console.log(moment, valid)
        return !valid;
      };
    }
  }

  const { disabledDate: _, onChange, ...otherProps } = props;

  // console.log(disabledDate)

  return (
    <DatePicker
      onChange={m =>
        onChange((moment.isMoment(m) && m.format("YYYY-MM-DD HH:mm:ss")) || m)
      }
      {...otherProps}
      disabledDate={disabledDate}
    />
  );
}

BootstrapDatePicker.RangePicker = function(props) {
  const { range } = props;

  let disabledDate;

  if (range && range.length > 0) {
    const minDate = range[0] && parse(range[0]);
    const maxDate = range[1] && parse(range[1]);

    // console.log(minDate, maxDate);

    if (minDate || maxDate) {
      disabledDate = (moment, view) => {
        let valid = true;
        if (minDate) {
          valid = valid && moment >= minDate;
        }
        if (maxDate) {
          valid = valid && moment <= maxDate;
        }
        // console.log(moment, valid)
        return !valid;
      };
    }
  }

  const { disabledDate: _, onChange, ...otherProps } = props;
  return (
    <DatePicker.RangePicker
      {...otherProps}
      onChange={moments =>
        onChange(
          moments.map(
            m => (moment.isMoment(m) && m.format("YYYY-MM-DD HH:mm:ss")) || m
          )
        )
      }
      disabledDate={disabledDate}
    />
  );
};
