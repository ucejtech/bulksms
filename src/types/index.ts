import { IziToastPosition } from 'izitoast';

export interface AuthenticationModel {
    displayName?: string;
    email: string;
    password: string;
}

export interface ToastObject {
    success: (message: string, header: string, pos: IziToastPosition) => void;
    error: (message: string, header: string, pos: IziToastPosition) => void;
    info: (message: string, header: string, pos: IziToastPosition) => void;
    warning: (message: string, header: string, pos: IziToastPosition) => void;
}

export interface ConstantsObject {
    appTitle: string;
    authError: Record<string, string>;
}
