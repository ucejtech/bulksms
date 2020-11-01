import iziToast, { IziToastPosition } from 'izitoast';

export default {
  success: (message: string, header: string, pos: IziToastPosition) => {
    const title = header || 'Success';
    const position = pos || 'topRight';
    iziToast.success({ title, position, message });
  },
  error: (message: string, header: string, pos: IziToastPosition) => {
    const title = header || 'Error';
    const position = pos || 'topRight';
    iziToast.error({ title, position, message });
  },
  info: (message: string, header: string, pos: IziToastPosition) => {
    const title = header || 'Error';
    const position = pos || 'topRight';
    iziToast.info({ title, position, message });
  },
  warning: (message: string, header: string, pos: IziToastPosition) => {
    const title = header || 'Warning';
    const position = pos || 'topRight';
    iziToast.warning({ title, position, message });
  }
};
