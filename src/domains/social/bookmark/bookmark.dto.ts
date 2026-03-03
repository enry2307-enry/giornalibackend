import { IsBoolean, IsOptional } from "class-validator";

/**
 * Entrambe "SavePost" e "SaveScrollVideo" hanno questi attributi 
 */
class BaseUpdate {
  @IsBoolean()
  @IsOptional()
  notify_user?: boolean;
}
// Non inseriamo l'entity_id perché quello lo prende il controller da req.params.id
class BaseAbstractSaveContentCreate extends BaseUpdate {}

/**
 * Ereditiamo comunque anche se ora non ne abbiamo bisogno.
 * Per motivi di scalabilità e manutenzione resta la scelta corretta
 */
// == POST ==
export class SavePostCreateDTO extends BaseAbstractSaveContentCreate {}

// == SCROLL VIDEO ==
export class SaveScrollVideoCreateDTO extends BaseAbstractSaveContentCreate {}

/**
 * Con toggle intendo l'azione di "salvare" o "smettere di tenere salvato"
 * un post.
 * 
 * Perché eredita da BaseUpdate se il campo che si occupa di tenere
 * traccia del salvataggio è is_active?
 * Perché quando "salvi di nuovo" un contenuto, potresti voler attivare
 * la notifica.
 * Il campo notify_user è difatto opzionale
 */
export class SavePostToggleDTO extends BaseUpdate {}
export class SaveScrollVideoToggleDTO extends BaseUpdate {}

