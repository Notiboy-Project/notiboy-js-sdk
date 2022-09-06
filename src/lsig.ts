export default function LsigTeal(name: string) {
  return `#pragma version 6
    byte "${name}"
    byte ""
    b!=
    return`;
}
