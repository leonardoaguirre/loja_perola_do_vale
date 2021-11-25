export class MyToast {
  id?: number;
  title: string;
  content: JSX.Element | string;
  time?: string;
  delay?: number;
  variant?: string;
  autohide?: boolean;
  img?: JSX.Element;
}