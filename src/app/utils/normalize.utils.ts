function normalizeWithRange(
  range: number[],
  min: number,
  max: number,
  value: number
): number {
  const variation = (range[1] - range[0]) / (max - min);
  const val = parseInt(
    ((value === 0 ? 0 : range[0]) + (value - min) * variation).toFixed(2)
  );
  return val;
}

export function normalizeObject(range: number[], object: any) {
  type Keys = keyof typeof object;
  const values = Object.values(object) as number[];
  const min = Math.min.apply(Math, values);
  const max = Math.max.apply(Math, values);
  Object.keys(object).forEach((elem) => {
    const el = elem as Keys;
    object[el] = normalizeWithRange(range, min, max, object[el]);
  });
}
