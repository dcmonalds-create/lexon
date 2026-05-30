import { useEffect, useCallback } from 'react';
import { usePhantomStore } from '../store/phantomStore';

/** Returns the injected Phantom provider, or null if not installed. */
function getPhantom() {
  return (window as any).phantom?.solana ?? null;
}

/**
 * Manages Phantom wallet connection state.
 *
 * - Auto-connects silently if the user previously approved this site.
 * - Listens for disconnect / account-change events.
 * - Exposes connect() / disconnect() for UI buttons.
 */
export function usePhantomWallet() {
  const { connected, publicKey, setConnected } = usePhantomStore();

  const isInstalled = Boolean(getPhantom()?.isPhantom);

  // ── Bootstrap: silent auto-connect + event listeners ────────────────────────
  useEffect(() => {
    const phantom = getPhantom();
    if (!phantom) return;

    // onlyIfTrusted: true → never shows a popup; only connects if already approved
    phantom
      .connect({ onlyIfTrusted: true })
      .then(({ publicKey }: any) => {
        setConnected(true, publicKey.toString());
      })
      .catch(() => {
        // Not previously trusted — stay disconnected, no error
      });

    const onDisconnect = () => setConnected(false, '');
    const onAccountChanged = (newKey: any) => {
      if (newKey) setConnected(true, newKey.toString());
      else setConnected(false, '');
    };

    phantom.on('disconnect', onDisconnect);
    phantom.on('accountChanged', onAccountChanged);

    return () => {
      phantom.off('disconnect', onDisconnect);
      phantom.off('accountChanged', onAccountChanged);
    };
  }, [setConnected]);

  // ── connect() — shown when wallet is installed but not yet connected ─────────
  const connect = useCallback(async () => {
    const phantom = getPhantom();
    if (!phantom) {
      window.open('https://phantom.app', '_blank', 'noopener,noreferrer');
      return;
    }
    try {
      const { publicKey } = await phantom.connect();
      setConnected(true, publicKey.toString());
    } catch (err: any) {
      // User dismissed the modal — silently ignore
      if (err?.code !== 4001) console.error('Phantom connect error:', err);
    }
  }, [setConnected]);

  // ── disconnect() ─────────────────────────────────────────────────────────────
  const disconnect = useCallback(async () => {
    const phantom = getPhantom();
    try {
      if (phantom) await phantom.disconnect();
    } catch {}
    setConnected(false, '');
  }, [setConnected]);

  const shortAddress = publicKey
    ? `${publicKey.slice(0, 4)}…${publicKey.slice(-4)}`
    : '';

  return { connected, publicKey, shortAddress, connect, disconnect, isInstalled };
}
