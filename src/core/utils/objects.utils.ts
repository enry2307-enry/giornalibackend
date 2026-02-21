// src/core/utils/object.utils.ts
import { FORBIDDEN_PUBLIC_FIELDS, ForbiddenFields } from '../constants/entities';

export function toPublic<T extends object>(entity: T): Omit<T, ForbiddenFields> {
  // 1. Creiamo una copia per non mutare l'originale
  const cleanEntity = { ...entity } as any;

  // 2. Cicliamo sui campi proibiti e cancelliamo solo se esistono
  FORBIDDEN_PUBLIC_FIELDS.forEach((field) => {
    if (field in cleanEntity) {
      delete cleanEntity[field];
    }
  });

  // 3. Forziamo il ritorno al tipo Omit desiderato
  return cleanEntity as Omit<T, ForbiddenFields>;
}