declare namespace JSX {
  interface IntrinsicElements {
    'md-filled-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      onClick?: (event: MouseEvent) => void;
    }, HTMLElement>;
    'md-outlined-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      onClick?: (event: MouseEvent) => void;
    }, HTMLElement>;
    'md-filled-text-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      label?: string;
      inputmode?: string;
      type?: string;
      autocomplete?: string;
    }, HTMLElement>;
    'md-icon-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      onClick?: (event: MouseEvent) => void;
    }, HTMLElement>;
    // 如需更多组件可继续添加
  }
}