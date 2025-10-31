export const validatePhoneNumber = (phoneNumber: string | number): boolean => {
  const phoneNumberStr =
    typeof phoneNumber === "string"
      ? phoneNumber.replace(/\s+/g, "")
      : phoneNumber.toString()

  // Check mobile numbers first (must be exactly 10 digits starting with 98/97/91)
  if (/^(98|97|91)/.test(phoneNumberStr)) {
    return /^(98|97|91)\d{8}$/.test(phoneNumberStr)
  }

  // Check landline patterns if not a mobile number
  // 1. 1 YXXX XXX where Y = 4,5,6
  // 2. AB YXX XXX where A=1-9, B=0-9, Y=4,5,6
  const landlineRegex = /^(?:1[456]\d{6}|[2-9][0-9][456]\d{5})$/

  return landlineRegex.test(phoneNumberStr)
}
