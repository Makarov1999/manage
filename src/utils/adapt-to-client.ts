export function adaptToClient<T, S>(obj: T): S {
    return Object
      .entries(obj)
      .reduce((acc, [key, val]) => {
        const modifiedKey = key.replace(/_([a-z])/g, (match) =>  match[1].toUpperCase());
        if (typeof val === 'object' && !Array.isArray(val)) {
          val = adaptToClient(val);
        }
        return ({
          ...acc,
          ...{ [modifiedKey]: val },
        });
      }, {}) as S;
  }