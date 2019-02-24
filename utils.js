import { useRef, useEffect, useState } from "react";
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
export const useDiff = (
  value,
  { onAdd = null, onRemove = null, onUnmount = null, onChange = null }
) => {
  const prevArray = usePrevious(value);
  useEffect(() => {
    if (onAdd) array.filter(v => !prevArray.includes(v)).forEach(onAdd);
    if (onRemove) prevArray.filter(v => !array.includes(v)).forEach(onRemove);
    return onUnmount;
  }, [value]);
};
export const useDiffObject = (
  value,
  { onAdd = null, onRemove = null, onUnmount = null, onChange = null }
) => {
  const keys = Object.keys(value);
  const prevObject = usePrevious(value);
  const prevKeys = Object.keys(prevObject);
  if (onAdd)
    keys
      .filter(v => !prevKeys.includes(v))
      .forEach(key => onAdd(key, value[key]));
  if (onRemove)
    prevKeys
      .filter(v => !keys.includes(v))
      .forEach(key => onRemove(key, prevObject[key]));
  if (onChange) onChange();
  return onUnmount;
};
export const useDoing = (startValue = DO => {
  const [doing, setDoingState] = useState(startValue);
  const updateDoing = newValue => {
    switch (newValue) {
      case DO:
        switch (doing) {
          case DOING:
            setDoingState(DONEXT);
            break;
          default:
            setDoingState(newValue);
        }
      case DONE:
        switch (doing) {
          case DONEXT:
            setDoingState(DO);
            return;
          default:
            setDoingState(newValue);
        }
      default:
        throw `only values ${DO} and ${DONE} are valid`;
    }
  };
  return [doing, updateDoing];
});
export const DO = "do";
export const DONE = "done";
const DONEXT = "donext";
export const DOING = "doing";
export const makePropDiff = filter => (a, b) => propDiff(a, b, filter);
export const propDiff = (a, b, filter) => {
  if (Array.isArray(filter)) {
    return propDiff(a, b, props => pickBy(props, (_, k) => filter.includes(k)));
  }
  if (a === b) return false;
  if (a & !b || !a & b) return true;
  const af = propFilter(a);
  const bf = propFilter(b);
  const afk = Object.keys(af);
  const bfk = Object.keys(bf);
  if (afk.length != bfk.length) return true;
  if (afk.filter(k => !bfk.includes(k)).length) return true;
  if (afk.filter(k => bf[k] != af[k]).length) return true;
  if (
    afk.filter(k => {
      const t1 = bf[k] == af[k];
      if (t1) return false;
      if (typeof bf[k] === "object") {
        return JSON.stringify(bf[k]) != JSON.stringify(af[k]);
      } else {
        return true;
      }
    }).length
  )
    return true;
};
