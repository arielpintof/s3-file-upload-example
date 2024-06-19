"use client"
import { UploadForm } from "./(form)/page";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-3">
      <h1 className="text-2xl font-bold">Subir archivo a Amazon S3</h1>
      <UploadForm></UploadForm>
    </main>
  );
}
