import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ProdutosProps } from '@/utils/produtos';

interface FormDetailProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedRow: ProdutosProps | null;
  handleDeleteProdu: () => void; // A função agora vem do pai
}

export function FormDetail({ open, setOpen, selectedRow, handleDeleteProdu }: FormDetailProps) {
  if (!selectedRow) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detalhes do Produto</SheetTitle>
        </SheetHeader>

        <form className="space-y-4 mt-4 p-4">
          {/* Campos de detalhe do produto */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">Nome do Produto</label>
            <input
              className='w-full border-1 rounded-md h-11 px-2'
              type="text"
              name="name"
              defaultValue={selectedRow.name}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">Fornecedor</label>
            <input
              className='w-full border-1 rounded-md h-11 px-2'
              type="text"
              name="fornecedor"
              defaultValue={selectedRow.fornecedor.name}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">NCM</label>
            <input
              className='w-full border-1 rounded-md h-11 px-2'
              type="text"
              name="ncm"
              defaultValue={selectedRow.ncm || ''}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">Preço</label>
            <input
              className='w-full border-1 rounded-md h-11 px-2'
              type="text"
              name="price"
              defaultValue={selectedRow.price}
              readOnly
            />
          </div>

          <div className="flex justify-between gap-x-4">
            <button
              type="button"
              className="bg-red-400 text-white px-4 py-2 w-full rounded hover:bg-red-500 transition duration-300"
              onClick={handleDeleteProdu} // Chama a função passada como prop
            >
              Excluir Produto
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}