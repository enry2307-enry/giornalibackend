// src/core/utils/object.utils.ts
import { FORBIDDEN_PUBLIC_FIELDS, ForbiddenFields } from '../constants/entities';
import { ApiResponse, ApiStatus, Meta } from '../types/api.types';

/**
 * Rimuove i campi sensibili e opzionalmente trasforma l'oggetto in un nuovo tipo/interfaccia.
 * @param entity L'oggetto originale
 * @returns L'oggetto pulito castato a R (default: T senza ForbiddenFields)
 */
export function toPublic<T extends object, R = Omit<T, ForbiddenFields>>(entity: T): R {
  // 1. Creiamo una copia per non mutare l'originale
  const cleanEntity = { ...entity } as any;

  // 2. Cicliamo sui campi proibiti e cancelliamo solo se esistono
  FORBIDDEN_PUBLIC_FIELDS.forEach((field) => {
    if (field in cleanEntity) {
      delete cleanEntity[field];
    }
  });

  // 3. Ritorniamo l'oggetto castato al tipo R richiesto o al default Omit
  return cleanEntity as R;
}

/**
 * Rimuove tutte le chiavi che hanno valore 'undefined' da un oggetto.
 * Utile per preparare i dati per le query di update (PATCH).
 */
export function removeUndefined<T extends object>(obj: T): T {
  const cleanObj = { ...obj };
  
  Object.keys(cleanObj).forEach((key) => {
    if ((cleanObj as any)[key] === undefined) {
      delete (cleanObj as any)[key];
    }
  });

  return cleanObj;
}

export function toResponse({
  status = 'success',
  data,
  message,
  meta,
}: {
  status?: ApiStatus;
  data: object;
  message?: string;
  meta?: Meta;
}): ApiResponse {
  return { status, data: { ...data }, message, meta };
}