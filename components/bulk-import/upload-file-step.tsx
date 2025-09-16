"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseCSV, type CsvRow } from "@/utils/csv-parser";

interface UploadFileStepProps {
  onParsed: (data: {
    headers: string[];
    rows: CsvRow[];
    fileName: string;
  }) => void;
}

export function UploadFileStep({ onParsed }: UploadFileStepProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setError(null);
      if (file.size > 2 * 1024 * 1024) {
        setError("File too large (max 2MB)");
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onerror = () => setError("Failed to read file");
      reader.onload = () => {
        try {
          let text = "";
          const result = reader.result;
          if (typeof result === "string") {
            text = result;
          } else if (result instanceof ArrayBuffer) {
            text = new TextDecoder().decode(result);
          } else if (result) {
            text = String(result);
          }
          const { headers, rows } = parseCSV(text);
          if (!headers.length) {
            setError("No header row found in CSV");
            return;
          }
          onParsed({ headers, rows, fileName: file.name });
        } catch (e: any) {
          setError(e?.message || "Failed to parse CSV");
        }
      };
      reader.readAsText(file);
    },
    [onParsed],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
    noClick: true,
  });

  const clear = () => {
    setFileName(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed p-6 text-center rounded-md cursor-pointer",
          isDragActive && "border-blue-500 bg-blue-50",
        )}
      >
        <input {...getInputProps()} />
        <p className="text-base font-medium">Upload Orders CSV</p>
        <p className="text-sm text-muted-foreground">
          Click or drag & drop your .csv file (max 2MB)
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button type="button" variant="secondary" onClick={open}>
            Browse...
          </Button>
          {fileName && (
            <Button type="button" variant="ghost" onClick={clear}>
              Clear
            </Button>
          )}
        </div>
        {fileName && (
          <p className="mt-2 text-xs text-muted-foreground">{fileName}</p>
        )}
      </div>
      {error && (
        <div className="text-red-600 text-sm border border-red-300 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
