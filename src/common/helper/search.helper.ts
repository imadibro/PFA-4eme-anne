export function buildSearchRegex(searchTerm: string): RegExp | null {
  if (!searchTerm) return null;
  const sanitized = searchTerm.replace(/[^a-zA-Z0-9\s]/g, '');
  return new RegExp(sanitized, 'i');
}

export function buildSearchQuery(searchTerm: string, fields: string[]): Record<string, any> | null {
  const regexp = buildSearchRegex(searchTerm);
  if (!regexp) return null;
  return { $or: fields.map(field => ({ [field]: { $regex: regexp } })) };
}

export function buildSort(sort?: string, sortBy?: string, defaultField = 'createdAt'): Record<string, 1 | -1> {
  if (sort && sortBy) {
    return { [sortBy]: sort === 'desc' ? -1 : 1 };
  }
  return { [defaultField]: -1 };
}

export function parsePagination(limit?: number | string, offset?: number | string): { limit: number; offset: number } {
  return {
    limit: limit ? parseInt(limit as string, 10) : 10,
    offset: offset ? parseInt(offset as string, 10) : 0
  };
}
