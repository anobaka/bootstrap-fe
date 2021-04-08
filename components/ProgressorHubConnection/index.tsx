import React, { useEffect, useRef, useState } from "react";
import { HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { sleep, usePrevious } from "../../helpers/utils";

const Action = {
  Start: 1,
  Stop: 2,
  Initialize: 3,
};

const Method = {
  Client: {
    State: "State",
    Progress: "Progress",
  },
  Server: {
    Invoke: "Invoke",
  },
};

export default function useProgressorHubConnection({
  key, url, onConnStateChange = (state) => {}, onStateChange = (s) => {
  }, onProgressChange = (p) => {
  },
}) {
  const connection = useRef();
  const [connState, setConnState] = useState();
  const prevConnState = usePrevious(connState);
  const [state, setState] = useState();
  const [progress, setProgress] = useState();
  const disposed = useRef(false);

  useEffect(() => {
    if (prevConnState !== undefined && prevConnState !== connState) {
      onConnStateChange(connState);
    }
  }, [connState]);

  useEffect(() => {
    onStateChange(state);
  }, [state]);

  useEffect(() => {
    onProgressChange(progress);
  }, [progress]);

  const methods = {
    [Method.Client.State]: (varKey, varState) => {
      if (varKey === key) {
        setState(varState);
      }
    },
    [Method.Client.Progress]: (varKey, varProgress) => {
      console.log(varKey, varProgress);
      if (varKey === key) {
        setProgress(varProgress);
      }
    },
  };

  useEffect(() => {
    const conn = new HubConnectionBuilder()
      .withUrl(url)
      .configureLogging(LogLevel.Information)
      .build();
    conn.onreconnecting((e) => {
      console.log("reconnecting", e);
    });
    conn.onclose((e) => {
      console.log("disconnected", e);
    });
    conn.onreconnected((connectionId) => {
    });

    Object.keys(methods).map(t => conn.on(t, function () {
      console.log(t, ...arguments);
      methods[t](...arguments);
    }));

    conn.on('Progress', function (a, b) {
      console.log(arguments);
    });

    const daemon = async () => {
      while (!disposed.current) {
        if (conn.state !== connState) {
          setConnState(conn.state);
        }
        if (conn.state === HubConnectionState.Disconnected) {
          try {
            await conn
              .start()
              .then(() => {
                conn.invoke(Method.Server.Invoke, key, Action.Initialize, null);
              });
            // break;
          } catch (e) {
            console.log(e);
          }
        }
        await sleep(1000);
      }
    };

    daemon();

    connection.current = {
      start: (params) => {
        conn.invoke(Method.Server.Invoke, key, Action.Start, params ? JSON.stringify(params) : undefined);
      },
      stop: () => {
        conn.invoke(Method.Server.Invoke, key, Action.Stop, undefined);
      },
      dispose: () => {
        disposed.current = true;
        conn.stop();
        console.log(`connection to hub: ${url} disposed`);
      },
    };

    return () => {
      if (connection.current) {
        connection.current.dispose();
      }
    };
  }, []);

  return connection;
}
