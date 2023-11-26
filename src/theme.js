import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        background: 'RGBA(0, 0, 0, 0.16)',
      },
    },
  },
});

export default theme;