import { AppointmentImage } from "../entities/AppointmentImage";

export interface AppointmentImageRepository {
  getAllImages(): Promise<AppointmentImage[]>;
  deleteImage(imageId: string): Promise<boolean>;
}
