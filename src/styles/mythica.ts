import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
        50: '{amber.50}', 100: '{amber.100}', 200: '{amber.200}',
        300: '{amber.300}', 400: '{amber.400}', 500: '{amber.500}',
        600: '{amber.600}', 700: '{amber.700}', 800: '{amber.800}',
        900: '{amber.900}', 950: '{amber.950}'
    },
    secondary: {
        50: '{emerald.50}', 100: '{emerald.100}', 200: '{emerald.200}',
        300: '{emerald.300}', 400: '{emerald.400}', 500: '{emerald.500}',
        600: '{emerald.600}', 700: '{emerald.700}', 800: '{emerald.800}',
        900: '{emerald.900}', 950: '{emerald.950}'
    }  
  },
   components: {
    button: {
      root: {
        borderRadius: '10px',
        label: {
          fontWeight: '600'
        }
      },
      colorScheme: {
        dark: {
          root: {
            primary: {
              background: '{primary.700}',
              hoverBackground: '{primary.800}',
              borderColor: '{primary.700}',
              hoverBorderColor: '{primary.950}',
              color: '#fff',
              hoverColor: '{primary.contrast.color}',
            }
          }
        }
      }
    }
  }
});

export default MyPreset;

/*
const MeuTema = definePreset(Aura, {
    semantic: {
    secondary: {
      50: '{emerald.50}', 100: '{emerald.100}', 200: '{emerald.200}',
      300: '{emerald.300}', 400: '{emerald.400}', 500: '{emerald.500}',
      600: '{emerald.600}', 700: '{emerald.700}', 800: '{emerald.800}',
      900: '{emerald.900}', 950: '{emerald.950}'
    }
    },

    components: {
        button: {
            root: {
                borderRadius: '12px',

                primary: {
                    color: '#fff',
                    background: '{primary.800}'
                },

                label: {
                fontWeight: '600'
                }
            }
        }
    }
});

export default MeuTema;
*/