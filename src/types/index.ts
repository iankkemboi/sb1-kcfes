export interface Result {
  id: number;
  name: string;
  match: number;
  skills: string[];
}

export interface FileWithPreview extends File {
  preview?: string;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
}