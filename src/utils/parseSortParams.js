import { SORT_ORDER } from "../constants/index.js";

function parseSortBy(value) {

  if (typeof value === 'undefined') {
    return '_id';
  }
  const keys = ['_id', 'name', 'createdAt', 'updatedAt'];

  return keys.includes(value) ? value : '_id';
  
}

function parseSortOrder(value) {

  const orders = [SORT_ORDER.ASC, SORT_ORDER.DESC];

  if (typeof value === 'undefined') {
    return SORT_ORDER.ASC;
  }

  return orders.includes(value) ? value : SORT_ORDER.ASC;
}


export function parseSortParams(query){
    const {sortBy, sortOrder} = query;

    const parsedSortBy = parseSortBy(sortBy);
    const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };

}