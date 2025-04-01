
export const getDefaultText = (type: string, index: number): string => {
  const nameBase = type.charAt(0).toUpperCase() + type.slice(1);
  switch(type) {
    case 'Label':
      return `Label${index}`;
    case 'CommandButton':
      return `Command${index}`;
    case 'TextBox':
      return '';
    case 'CheckBox':
      return `Check${index}`;
    case 'OptionButton':
      return `Option${index}`;
    case 'ComboBox':
      return '';
    case 'ListBox':
      return '';
    case 'Frame':
      return `Frame${index}`;
    default:
      return `${nameBase}${index}`;
  }
};
