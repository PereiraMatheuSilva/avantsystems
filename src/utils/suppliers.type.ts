export interface SupplierProps{
  id: string;
  name: string;
  representante: string | null;
  phonerep: string | null;
  emailrep: string | null;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
