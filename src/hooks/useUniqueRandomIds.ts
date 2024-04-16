import { useCallback, useRef } from "react";
import { generateUniqueRandomIds } from "@/utils/generateUniqueRandomIds";
import useLikeConstructor from "@/hooks/useLikeConstructor";

function useUniqueRandomIds(cnt: number): {
  ids: string[];
  keepOrExpandIds: (length: number) => void;
  keepOrExpandIdsArrays: null;
};
function useUniqueRandomIds(cnt: number[]): {
  ids: string[];
  keepOrExpandIds: null;
  keepOrExpandIdsArrays: (length: number[]) => void;
};

function useUniqueRandomIds(cnt: number | number[]):
  | {
      ids: string[];
      keepOrExpandIds: (length: number) => void;
      keepOrExpandIdsArrays: null;
    }
  | {
      ids: string[];
      keepOrExpandIds: null;
      keepOrExpandIdsArrays: (length: number[]) => void;
    } {
  // const idsRef = useRef<string[] | string[][]>([]);
  const idsRef = useRef<string[]>([]);
  const idsArraysRef = useRef<string[][]>([]);
  // const prevIdCntRef = useRef();

  useLikeConstructor(() => {
    if (typeof cnt === "number") {
      if (cnt <= 0) {
        return;
      }
      idsRef.current = [...generateUniqueRandomIds(cnt)];
    } else if (
      Array.isArray(cnt) &&
      cnt.every((item) => typeof item === "number")
    ) {
      idsArraysRef.current = cnt.map((count) => {
        return [...generateUniqueRandomIds(count)];
      });
    } else {
      return;
    }
  });

  const keepOrExpandIds = useCallback((length: number) => {
    if (length <= 0 || length <= idsRef.current.length) {
      return;
    } else {
      const prevIdCnt = idsRef.current.length;
      idsRef.current.push(...generateUniqueRandomIds(length - prevIdCnt)); // `push` returns new length
      return;
    }
  }, []);

  const keepOrExpandIdsArrays = useCallback((length: number[]) => {
    if (
      Array.isArray(length) &&
      length.every((item) => typeof item === "number")
    ) {
      length.forEach((len, idx) => {
        if (len > idsArraysRef.current[idx].length) {
          const prevIdCnt = idsRef.current[idx].length;
          idsArraysRef.current[idx].push(
            ...generateUniqueRandomIds(len - prevIdCnt)
          );
        }
      });
    }
  }, []);

  // console.log("idsRef.current:", idsRef.current);
  if (typeof cnt === "number") {
    return {
      ids: idsRef.current,
      keepOrExpandIds,
      keepOrExpandIdsArrays: null
    };
  } else {
    return {
      ids: idsRef.current,
      keepOrExpandIds: null,
      keepOrExpandIdsArrays
    };
  }
}

export default useUniqueRandomIds;
