// Utility function for haptic feedback
export function triggerHapticFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate(50); // Vibrate for 50ms
    }
}
