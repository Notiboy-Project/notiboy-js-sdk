//Creation of lsig while creating a channel
export default function LsigTeal(name: string) {
  return `#pragma version 6
    byte "${name}"
    byte ""
    b!=
    return`;
}
