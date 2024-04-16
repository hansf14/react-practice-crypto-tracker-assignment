import { useMemo } from "react";

const useBeforeRender = (
  callback: (...args: any) => any,
  cbArgs: any[] = []
) => {
  useMemo(() => {
    if (cbArgs.length !== 0) {
      callback(...cbArgs);
    } else {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback]);
};

export default useBeforeRender;
