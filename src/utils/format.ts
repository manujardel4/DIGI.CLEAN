export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount)) + ' FCFA';
};
