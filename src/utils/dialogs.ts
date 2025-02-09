interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

export const showConfirmDialog = ({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
}: ConfirmDialogOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: cancelText,
          style: 'cancel',
          onPress: () => resolve(false),
        },
        {
          text: confirmText,
          style: destructive ? 'destructive' : 'default',
          onPress: () => resolve(true),
        },
      ],
      { cancelable: false }
    );
  });
}; 