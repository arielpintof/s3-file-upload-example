import { Input } from "@/components/ui/input";
import { uploadFile } from "@/app/(form)/actions";
import { useFormState } from "react-dom";
import { SubmitButton } from "./submit-file-button";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const initialState = { message: "" };

export function UploadForm() {
  const [state, formAction] = useFormState(uploadFile, initialState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
    setPageNumber(1);
    setScale(1.0);
    console.log(file);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) =>
      Math.min(Math.max(prevPageNumber + offset, 1), numPages || 1)
    );
  };

  const zoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.1, 2));
  const zoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));

  const pdfOptions = useMemo(() => ({
    cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
    cMapPacked: true,
  }), []);

  return (
    <div className="flex flex-col items-center my-3">
      <form
        action={formAction}
        className="flex flex-col items-center gap-5 my-2"
      >
        <Input
          type="file"
          id="file"
          name="file"
          accept="images/*"
          onChange={fileChange}
        ></Input>
        {selectedFile && (
          <div className="flex flex-col p-3 relative min-h-[300px] min-w-[300px]">
            {selectedFile.type.startsWith("image/") ? (
              <Image
                className="border-2 rounded-full max-h-[300px] max-w-[300px] relative"
                src={URL.createObjectURL(selectedFile)}
                alt="Selected Image"
                fill
                style={{ objectFit: "cover" }}
              />
            ) : selectedFile.type === "application/pdf" ? (
              <Document
                className="flex mx-auto"
                file={URL.createObjectURL(selectedFile)}
                  onLoadSuccess={onDocumentLoadSuccess}
                  options={pdfOptions}
              >
                <Page
                  pageNumber={pageNumber} 
                  width={600}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            ) : (
              <p>Archivo no soportado</p>
            )}
            {selectedFile.type === 'application/pdf' && (
              <div className="flex justify-between items-center w-full mt-4 p-2 bg-gray-200 rounded">
                <button onClick={() => changePage(-1)} disabled={pageNumber <= 1} className="px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400">
                  Anterior
                </button>
                <span>
                  Página {pageNumber} de {numPages}
                </span>
                <button onClick={() => changePage(1)} disabled={pageNumber >= (numPages || 1)} className="px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400">
                  Siguiente
                </button>
                <button onClick={zoomOut} className="px-2 py-1 bg-green-500 text-white rounded">
                  Zoom -
                </button>
                <button onClick={zoomIn} className="px-2 py-1 bg-green-500 text-white rounded">
                  Zoom +
                </button>
              </div>
            )}
          </div>
        )}
        <SubmitButton />
      </form>
      {state.message && <p>{state.message}</p>}
    </div>
  );
}
