function parseIsFavourite(value) {
    if (typeof value === 'undefined') return undefined; 
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
  
    return undefined;
}

export function parseFilterParams(query) {
  const { isFavourite } = query;

  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    isFavourite: parsedIsFavourite,
  };
}