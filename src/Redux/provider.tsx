"use client";

import React, { useState } from "react";
import { persistor, store } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import LoadingPage from "@/components/global/loading-page";

type Props = {
  children: React.ReactNode;
};

const ReduxProvider = ({ children }: Props) => {
  const [isHydrated, setIsHydrated] = useState(false);

  return (
    <Provider store={store}>
      <PersistGate
        loading={<LoadingPage />}
        persistor={persistor}
        onBeforeLift={() => setIsHydrated(true)} // Runs when Redux has rehydrated
      >
        {isHydrated ? children : <LoadingPage />}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
