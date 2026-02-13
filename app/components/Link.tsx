import {forwardRef} from 'react';
import {
  Link as RRLink,
  NavLink as RRNavLink,
  type LinkProps as RRLinkProps,
  type NavLinkProps as RRNavLinkProps,
} from 'react-router';
import {useSelectedLocale, getPathWithoutLocale} from '~/lib/i18n';
import type {I18nLocale} from '~/lib/i18n';

type BaseLinkProps = {
  /** Override the locale for this link (e.g. switch language) */
  locale?: I18nLocale;
};

type RegularLinkProps = BaseLinkProps &
  Omit<RRLinkProps, 'to'> & {
    variant?: never;
    to: RRLinkProps['to'];
  };

type NavLinkVariantProps = BaseLinkProps &
  Omit<RRNavLinkProps, 'to'> & {
    variant: 'nav';
    to: RRNavLinkProps['to'];
  };

type LinkProps = RegularLinkProps | NavLinkVariantProps;

/**
 * Locale-aware Link component. Automatically prepends the current locale's
 * path prefix to internal links.
 *
 * Usage:
 *   <Link to="/products">...        — regular link, auto-localized
 *   <Link variant="nav" to="/products"> — renders NavLink with active states
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(props, ref) {
    const selectedLocale = useSelectedLocale();
    const locale = props.locale ?? selectedLocale;

    if (props.variant === 'nav') {
      const {variant, locale: _locale, to, ...rest} = props;
      const localizedTo = localizePath(to, locale);
      return <RRNavLink ref={ref} to={localizedTo} {...rest} />;
    }

    const {locale: _locale, to, ...rest} = props;
    const localizedTo = localizePath(to, locale);
    return <RRLink ref={ref} to={localizedTo} {...rest} />;
  },
);

function localizePath(
  to: RRLinkProps['to'],
  locale: I18nLocale,
): RRLinkProps['to'] {
  if (typeof to !== 'string') return to;

  // Don't localize external URLs, hash links, or protocol-relative URLs
  if (
    to.startsWith('http') ||
    to.startsWith('//') ||
    to.startsWith('#') ||
    to.startsWith('mailto:') ||
    to.startsWith('tel:')
  ) {
    return to;
  }

  // Strip any existing locale prefix first, then prepend the target locale
  const cleanPath = getPathWithoutLocale(to);
  if (!locale.pathPrefix) return cleanPath;
  return locale.pathPrefix + (cleanPath === '/' ? '' : cleanPath);
}
