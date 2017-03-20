export function extract(actions) {
  if (actions.length < 1) {
    return null;
  }

  const totalWeight = actions.reduce((sum, action) => action.weight + sum, 0);
  const threshould = Math.floor(Math.random() * totalWeight);

  let currentWeight = 0;
  return actions.find(action => {
    currentWeight += action.weight;

    if (currentWeight > threshould) {
      return true;
    }

    return false;
  });
}
