import Sidebar from "@/components/Sidebar";
import UploadExcel from "@/components/UploadExcel";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className='absolute top-0 w-11/12 left-20'>
        <UploadExcel />
      </div>
    </main>
  );
}
