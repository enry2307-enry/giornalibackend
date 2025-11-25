// repositories/penaltyRepository.ts
import { Penalty } from '../types/models';
import { BaseRepository } from './baseRepository';

export class PenaltyRepository extends BaseRepository<Penalty> {
  protected tableName = 'penalty';
}