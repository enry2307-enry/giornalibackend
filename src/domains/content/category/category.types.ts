import { BaseAbstractEntity } from "../../../types/baseEntity";
import { PublisherType } from "../../profiles/profiles.types";

export interface Category extends BaseAbstractEntity {
  name: string;
  priority: number;
  publisherType: PublisherType;
  icon_url: string;
  parent_category_id: string;
  sub?: []
}