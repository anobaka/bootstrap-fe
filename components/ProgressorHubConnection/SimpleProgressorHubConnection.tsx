import React, { useEffect, useRef, useState } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { Dialog, Message } from "@alifd/next";
import useProgressorHubConnection from "./index";

export default function useSimpleProgressorHubConnection({
  key, url, onStateChange = (s) => { }, onProgressChange = (p) => { },
}) {
  const connection = useRef();
  const dialog = useRef();

  const onConnStateChange = (state: HubConnectionState) => {
    if (dialog.current) {
      dialog.current.hide();
    }
    const options = {
      title: state,
      hasMask: false,
    };
    switch (state) {
    case HubConnectionState.Disconnected:
    case HubConnectionState.Connecting:
    case HubConnectionState.Disconnecting:
    case HubConnectionState.Reconnecting:
      Dialog.show(options);
      break;
    case HubConnectionState.Connected:
      Message.success(`Progressor [${key}] connected to ${url} successfully.`);
      break;
    }
  };

  const conn = useProgressorHubConnection({ key, url, onConnStateChange, onStateChange, onProgressChange });

  useEffect(() => {
    connection.current = {
      start: (params) => {
        Message.success("Starting");
        conn.current.start(params);
      },
      stop: () => {
        Message.success("Stopping");
        conn.current.stop();
      },
      dispose: () => {
        conn.current.dispose();
        if (dialog.current) {
          dialog.current.hide();
        }
      },
    };

    return () => {
      if (connection.current) {
        conn.current.dispose();
      }
    };
  }, []);

  return connection;
}
