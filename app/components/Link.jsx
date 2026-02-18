import { forwardRef } from "react";
import {
  Link as RRLink,
  NavLink as RRNavLink
} from "react-router";
import { useSelectedLocale, getPathWithoutLocale } from "~/lib/i18n";
const Link = forwardRef(
  function Link2(props, ref) {
    const selectedLocale = useSelectedLocale();
    const locale = props.locale ?? selectedLocale;
    if (props.variant === "nav") {
      const { variant, locale: _locale2, to: to2, ...rest2 } = props;
      const localizedTo2 = localizePath(to2, locale);
      return <RRNavLink ref={ref} to={localizedTo2} {...rest2} />;
    }
    const { locale: _locale, to, ...rest } = props;
    const localizedTo = localizePath(to, locale);
    return <RRLink ref={ref} to={localizedTo} {...rest} />;
  }
);
function localizePath(to, locale) {
  if (typeof to !== "string") return to;
  if (to.startsWith("http") || to.startsWith("//") || to.startsWith("#") || to.startsWith("mailto:") || to.startsWith("tel:")) {
    return to;
  }
  const cleanPath = getPathWithoutLocale(to);
  if (!locale.pathPrefix) return cleanPath;
  return locale.pathPrefix + (cleanPath === "/" ? "" : cleanPath);
}
export {
  Link
};
