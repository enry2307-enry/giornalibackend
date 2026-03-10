import { publisherRepository } from "./publisher/publisher.repository";
import { viewerRepository } from "./viewer/viewer.repository";

/**
 * NOTA: Questa funzione esegue al massimo 2 chiamate al database, minimo 1.
 * 
 * Controlla se all'userId passato come parametro è già associato nel database un publisher
 * o un viewer. Se uno dei due esiste ritorna true, altrimenti false
 * @param userId 
 * @returns If this profile is already associate with a profile
 */
export async function doesProfileAlreadyExist(userId: string): Promise<boolean> {
  const viewer = await viewerRepository.findOneWhere({user_id: userId});
  if(viewer) {
    return true;
  }

  const publisher = await publisherRepository.findOneWhere({user_id: userId});
  if(publisher) {
    return true;
  } 

  return false;
}