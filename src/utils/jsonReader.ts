import { UserStateType } from '../store/modules/user';

export default async (file: File) => new Promise<UserStateType['contacts']['data']>(resolve => {
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = () => {
    const result = JSON.parse(typeof reader.result === 'string' ? reader.result : '');
    resolve(result);
  };
});
