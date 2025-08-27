interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export type { ModalProps, ButtonVariant, ButtonProps };