import {
  useFetcher,
  useNavigate
} from "react-router";
import { useRef, useEffect } from "react";
import { useAside } from "./Aside";
const SEARCH_ENDPOINT = "/search";
function SearchFormPredictive({
  children,
  className = "predictive-search-form",
  ...props
}) {
  const fetcher = useFetcher({ key: "search" });
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const aside = useAside();
  function resetInput(event) {
    event.preventDefault();
    event.stopPropagation();
    if (inputRef?.current?.value) {
      inputRef.current.blur();
    }
  }
  function goToSearch() {
    const term = inputRef?.current?.value;
    void navigate(SEARCH_ENDPOINT + (term ? `?q=${term}` : ""));
    aside.close();
  }
  function fetchResults(event) {
    void fetcher.submit(
      { q: event.target.value || "", limit: 5, predictive: true },
      { method: "GET", action: SEARCH_ENDPOINT }
    );
  }
  useEffect(() => {
    inputRef?.current?.setAttribute("type", "search");
  }, []);
  if (typeof children !== "function") {
    return null;
  }
  return <fetcher.Form {...props} className={className} onSubmit={resetInput}>
      {children({ inputRef, fetcher, fetchResults, goToSearch })}
    </fetcher.Form>;
}
export {
  SEARCH_ENDPOINT,
  SearchFormPredictive
};
