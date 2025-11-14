export function mapState(
  data: Record<string, any>,
  state: Record<string, any>,
  setState: React.Dispatch<React.SetStateAction<any>>,
) {
  const source = data._raw ? data._raw : data;

  const newState = { ...state };

  Object.entries(source).forEach(([key, value]) => {
    if (key in newState) {
      newState[key] = value;
    }
  });
  setState(newState);
}
