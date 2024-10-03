// libraryFine.d.ts
declare module './src/components/action-layout/wa/libraryFine.js' {
  export default function createLibraryFineModule(): Promise<{
    _malloc: (size: number) => number;
    _free: (ptr: number) => void;
    HEAP32: Int32Array;
    _runTests: (inputPtr: number, numTests: number, resultPtr: number) => void;
  }>;
}
