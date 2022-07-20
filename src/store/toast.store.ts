import { writable } from 'svelte/store'

export const toasts = writable([])

export const dismissToast = (id: number): void => {
  toasts.update((all) => all.filter((t) => t.id !== id))
}

export const addToast = (message: string, type?: string, dismissible?: boolean, timeout?: number): void => {
  // Create a unique ID so we can easily find/remove it
  // if it is dismissible/has a timeout.
  const id = Math.floor(Math.random() * 10000)

  // Setup some sensible defaults for a toast.
  const props = {
    id,
    message,
    type: type || 'info',
    timeout: timeout || 4000,
    dismissible: true,
  }
  if (dismissible !== undefined) props.dismissible = dismissible

  toasts.update((all) => [props, ...all])

  if (props.timeout && props.dismissible) setTimeout(() => dismissToast(id), props.timeout)
}