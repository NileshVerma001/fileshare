// src/types/global.d.ts
declare module '*.png' {
    const value: string;
    export default value;
}

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}
