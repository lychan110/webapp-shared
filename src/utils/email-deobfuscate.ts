/**
 * Email deobfuscation helper.
 *
 * Assembles an email address from separately-encoded user and domain
 * parts, keeping the full address out of static HTML source.
 *
 * Intended for use with a pattern like:
 * ```html
 * <a data-u="lychan115" data-d="gmail.com" id="contact-email"></a>
 * ```
 *
 * @param user   - The local-part of the email (the part before `@`).
 * @param domain - The domain part of the email (the part after `@`).
 * @returns The assembled email address: `user@domain`.
 *
 * @example
 * deobfuscateEmail('lychan115', 'gmail.com')
 * // → 'lychan115@gmail.com'
 */
export function deobfuscateEmail(user: string, domain: string): string {
  return `${user}@${domain}`;
}
