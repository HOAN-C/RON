import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      surface: string;
      text: {
        primary: string;
        secondary: string;
      };
      team: {
        a: string;
        b: string;
        aTransparent: string;
        bTransparent: string;
      };
    };
  }
}
