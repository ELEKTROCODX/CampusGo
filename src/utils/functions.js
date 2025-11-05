
export const isIosSafari = () => {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    /Safari/.test(navigator.userAgent) &&
    !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent)
  );
};

export const isSubscribed = async () => {
  if (!window.OneSignalDeferred) return false;

  return new Promise((resolve) => {
    window.OneSignalDeferred.push(async function (OneSignal) {
      const user = await OneSignal.User.get();
      resolve(!!user.subscriptionId);
    });
  });
};
