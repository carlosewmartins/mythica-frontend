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
      50:  "#F4F6F7", 100: "#E2E7EA", 200: "#C8D1D6",
      300: "#A5B3BC", 400: "#738391", 500: "#0F1D26",
      600: "#0D1922", 700: "#0B151C", 800: "#091117",
      900: "#070D12", 950: "#050A0D"
    },
    colorScheme: {
      dark: {
        50:  "#F4F5F7", 100: "#E3E6EA", 200: "#C9CED6",
        300: "#A6AFBB", 400: "#7C8691", 500: "#0A0F16",
        600: "#080C12", 700: "#060A0E", 800: "#05080B",
        900: "#040609", 950: "#020305"
      }
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
              color: '#{gray-200}',
              borderColor: '{primary.700}',
              hoverBackground: '{primary.800}',
              hoverColor: '#{gray-200}',
              hoverBorderColor: '{primary.950}',
              activeBackground: '{primary.900}',
              activeBorderColor: '{primary.900}'
            },
            secondary: {
              background: '{secondary.500}',
              borderColor: '{slate.600}',
              hoverBackground: '{secondary.600}',
              hoverBorderColor: '{secondary.600}',
              activeBackground: '{secondary.700}',
              activeBorderColor: '{secondary.700}'
            }
          }
        }
      }
    },
    menubar: {
      root: {
        borderColor: 'rgba(0,0,0,0)',
        background: 'rgba(0,0,0,0)'
      }
    }
  }
});

export default MyPreset;