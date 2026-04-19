// lib/state.ts

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { AppState, BeautyRecord } from "@/lib/types";
import { getRecords, saveRecords } from "@/lib/storage";

type Action =
  | { type: "HYDRATE"; payload: BeautyRecord[] }
  | { type: "ADD_RECORD"; payload: BeautyRecord }
  | { type: "UPDATE_RECORD"; payload: BeautyRecord }
  | { type: "DELETE_RECORD"; payload: string };

const initialState: AppState = {
  records: [],
  initialized: false,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...state,
        records: action.payload,
        initialized: true,
      };

    case "ADD_RECORD":
      return {
        ...state,
        records: [action.payload, ...state.records],
      };

    case "UPDATE_RECORD":
      return {
        ...state,
        records: state.records.map((record) =>
          record.id === action.payload.id ? action.payload : record
        ),
      };

    case "DELETE_RECORD":
      return {
        ...state,
        records: state.records.filter((record) => record.id !== action.payload),
      };

    default:
      return state;
  }
}

type AppContextValue = {
  state: AppState;
  addRecord: (record: BeautyRecord) => void;
  updateRecord: (record: BeautyRecord) => void;
  deleteRecord: (id: string) => void;
  getRecordByIdFromState: (id: string) => BeautyRecord | null;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const records = getRecords();
    dispatch({ type: "HYDRATE", payload: records });
  }, []);

  useEffect(() => {
    if (!state.initialized) return;
    saveRecords(state.records);
  }, [state.records, state.initialized]);

  const value = useMemo<AppContextValue>(() => {
    return {
      state,
      addRecord: (record) => {
        dispatch({ type: "ADD_RECORD", payload: record });
      },
      updateRecord: (record) => {
        dispatch({ type: "UPDATE_RECORD", payload: record });
      },
      deleteRecord: (id) => {
        dispatch({ type: "DELETE_RECORD", payload: id });
      },
      getRecordByIdFromState: (id) => {
        return state.records.find((record) => record.id === id) ?? null;
      },
    };
  }, [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppState must be used within AppProvider");
  }

  return context;
}
